using attendance1.Web.Data;
using attendance1.Web.Models;
using System.Data.SqlClient;
using System.Net.NetworkInformation;
using System.Text;
using System.Security.Cryptography;
using DeviceDetectorNET.Class;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using UAParser;
using attendance1.Web.Controllers;


namespace attendance1.Web.Services
{
    public class DeviceService
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger _logger;

        public DeviceService(DatabaseContext databaseContext, IHttpContextAccessor httpContextAccessor, ILogger<DeviceService> logger)
        {
            _databaseContext = databaseContext;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        //public string GetMacAddress()
        //{
        //    try
        //    {
        //        const int MIN_MAC_ADDR_LENGTH = 12;
        //        string macAddress = string.Empty;
        //        long maxSpeed = -1;

        //        foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
        //        {
        //            Console.WriteLine(
        //                "Found MAC Address: " + nic.GetPhysicalAddress() +
        //                " Type: " + nic.NetworkInterfaceType);

        //            string tempMac = nic.GetPhysicalAddress().ToString();
        //            if (nic.Speed > maxSpeed &&
        //                !string.IsNullOrEmpty(tempMac) &&
        //                tempMac.Length >= MIN_MAC_ADDR_LENGTH)
        //            {
        //                Console.WriteLine("New Max Speed = " + nic.Speed + ", MAC: " + tempMac);
        //                maxSpeed = nic.Speed;
        //                macAddress = tempMac;
        //            }
        //        }

        //        return macAddress;
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("An error occurred while getting the MAC address: " + ex.Message);
        //        Console.WriteLine("Stack Trace: " + ex.StackTrace);
        //        return "Error retrieving MAC address.";
        //    }
        //}

        private static string HashEncode(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public StudentDeviceMdl GetDeviceInfoAsync(string deviceInfo)
        {
            try
            {
                string[] deviceInfoParts = deviceInfo.Split(';');
                string[] filteredDeviceInfoParts = deviceInfoParts.Skip(1).ToArray(); //skip uuid

                // re-combine
                string DeviceInfoWithoutUUID = string.Join(";", filteredDeviceInfoParts);

                var currentDevice = new StudentDeviceMdl
                {
                    // deviceInfo.Split(';')[0] is uuid
                    UUID = deviceInfoParts[0].Split(':')[1],
                    StudentId = deviceInfoParts[1].Split(':')[1],
                    HardwareConcurrency = Convert.ToInt32(deviceInfoParts[2].Split(':')[1]),
                    ColorDepth = Convert.ToInt32(deviceInfoParts[3].Split(':')[1]),
                    ScreenResolution = deviceInfoParts[4].Split(':')[1],
                    DeviceType = deviceInfoParts[5].Split(':')[1],
                    EncodeDeviceCodeWithoutUUID = HashEncode(DeviceInfoWithoutUUID)
                };
                return currentDevice;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while encode the device information: " + ex.Message);
                return new StudentDeviceMdl();
            }
        }
        public string GetEncodeDeviceCode(string deviceCode)
        {
            var encodeDeviceCode = HashEncode(deviceCode);
            return encodeDeviceCode;
        }

        public async Task<string> ValidateStudentDeviceAndGetIdAsync(string studentID, StudentDeviceMdl studentDeviceInfo, string uuidStatus)
        {
            try
            {
                string checkExistedQuery = "SELECT studentID, deviceID, uuID FROM studentDevice WHERE deviceCode = @deviceCode";

                SqlParameter[] deviceParameters = {
                    new SqlParameter("@deviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID)
                };

                var result1 = await _databaseContext.ExecuteQueryAsync(checkExistedQuery, deviceParameters);
                if (result1 != null && result1.Rows.Count > 0)
                {
                    //device existed or the device property is same as the registered device.
                    var originalStudentID = result1.Rows[0]["studentID"].ToString();
                    var deviceId = result1.Rows[0]["deviceID"].ToString();
                    var originalUUID = result1.Rows[0]["uuID"].ToString();

                    if (originalStudentID != studentID || originalStudentID.ToLower() != studentDeviceInfo.StudentId)
                    {
                        // generally impossible occured
                        _logger.LogWarning("Student " + studentID + "failed to validate device because student id not same as the db student id with the device.");
                        return $"This device is registered with another student ID: {originalStudentID}.";
                    }

                    // check uuid (browser id)
                    if (uuidStatus == "re-use" && originalUUID == studentDeviceInfo.UUID)
                    {
                        // success login with the device
                        // tested, ok
                        _logger.LogInformation("Student " + studentID + "success to validate the device.");
                        return $"Success:{deviceId}";
                    }
                    else if (uuidStatus == "re-use" && originalUUID != studentDeviceInfo.UUID)
                    {
                        // this browser logined with another account in the past that is different with current account (found device code means the current account's device code contains the same device properties with the current device)
                        string fetchQuery = @"SELECT studentID FROM studentDevice WHERE uuID = @UUID";
                        SqlParameter[] fetchParamater =
                        {
                            new SqlParameter("@UUID", studentDeviceInfo.UUID)
                        };
                        var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParamater);
                        if (result != null && result.Rows.Count > 0)
                        {
                            string UuidBindedStudentId = result.Rows[0]["studentID"].ToString();
                            // tested, ok
                            _logger.LogWarning("Stduent " + studentID + "failed to validate device because the used uuid is belong to another student id in db.");
                            return $"This device is registered with another student ID: {UuidBindedStudentId}.";
                        }
                        else
                        {
                            // generally impossible occur, because uuid must existed 
                            // uuid does not existed
                            string updateUUIDQuery = "UPDATE studentDevice SET uuID = @UUID WHERE studentID = @studentID AND deviceCode = @deviceCode AND deviceID = @deviceId";

                            SqlParameter[] updateUUIDParameters = {
                                new SqlParameter("@deviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID),
                                new SqlParameter("@studentID", originalStudentID),
                                new SqlParameter("@UUID", studentDeviceInfo.UUID),
                                new SqlParameter("@deviceId", deviceId)
                            };

                            var result2 = await _databaseContext.ExecuteScalarAsync<int>(updateUUIDQuery, updateUUIDParameters);
                            if (result2 <= -1)
                            {
                                // tested, ok
                                _logger.LogWarning("Stduent " + studentID + "failed to validate device because failed to update the uuid of the student. Info: uuid status: re-use.");
                                return "Failed to update UUID (browser id).";
                            }
                            _logger.LogInformation("Stduent " + studentID + "success validate the device and returned device id.");
                            return $"Success:{deviceId}";
                        }
                        
                    }
                    else if (uuidStatus == "re-assign")
                    {
                        // user clear the browser cache or use new browser instance
                        string updateUUIDQuery = "UPDATE studentDevice SET uuID = @UUID WHERE studentID = @studentID AND deviceCode = @deviceCode AND deviceID = @deviceId";

                        SqlParameter[] updateUUIDParameters = {
                            new SqlParameter("@deviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID),
                            new SqlParameter("@studentID", originalStudentID),
                            new SqlParameter("@UUID", studentDeviceInfo.UUID),
                            new SqlParameter("@deviceId", deviceId)
                        };

                        var result2 = await _databaseContext.ExecuteScalarAsync<int>(updateUUIDQuery, updateUUIDParameters);
                        if (result2 <= -1)
                        {
                            // tested, ok
                            _logger.LogWarning("Stduent " + studentID + "failed to validate device because failed to update the uuid of the student. Info: uuid status: re-assign.");
                            return "Failed to update UUID (browser id).";
                        }
                        _logger.LogInformation("Stduent " + studentID + "success validate the device and returned device id.");
                        return $"Success:{deviceId}";
                    } 
                    else if (uuidStatus == "first-assign")
                    {
                        // first-assign = student click register but the device code is found
                        // tested, ok
                        _logger.LogWarning("Stduent " + studentID + "click register but the device code is found");
                        return $"Found duplicate register action!";
                    }
                    _logger.LogError($"Stduent " + studentID + "meet unknown status. Debug Info: uuid status: {uuidStatus}; original uuid: {originalUUID}; current uuid: {studentDeviceInfo.UUID}");
                    return $"Unknown status. Debug Info: uuid status: {uuidStatus}; original uuid: {originalUUID}; current uuid: {studentDeviceInfo.UUID}";
                }
                else
                {
                    // no found device code (device not existed)
                    if (uuidStatus == "first-assign" || uuidStatus == "re-use")
                    {
                        // check uuid existed or not
                        string fetchQuery = @"SELECT studentID FROM studentDevice WHERE uuID = @UUID";
                        SqlParameter[] fetchParamater =
                        {
                            new SqlParameter("@UUID", studentDeviceInfo.UUID)
                        };
                        var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParamater);
                        if (result != null && result.Rows.Count > 0)
                        {
                            // uuid existed 
                            string UuidBindedStudentId = result.Rows[0]["studentID"].ToString();
                            if (studentID != UuidBindedStudentId)
                            {
                                _logger.LogWarning("Student" + studentID + "try to register device with a uuid that already registered and used by other student: " + UuidBindedStudentId + ".");
                                return $"This device is registered with another student ID: {UuidBindedStudentId}.";
                            }
                            _logger.LogWarning("Student" + studentID + "try to register device with not existed device code but uuid already in db. Means different device used.");
                            return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                        }
                        else
                        {
                            // uuid does not existed
                            // first-assign or re-use: student register, deivce does not existed, register the device

                            // 1. check student id existed
                            string checkStudentIDQuery = @"SELECT studentID, deviceCode, deviceID FROM studentDevice WHERE studentID = @studentID";
                            SqlParameter[] checkStudentIDParameters =
                            {
                                new SqlParameter("@studentID", studentID)
                            };

                            var studentIDresult = await _databaseContext.ExecuteQueryAsync(checkStudentIDQuery, checkStudentIDParameters);
                            if (studentIDresult != null && studentIDresult.Rows.Count > 0)
                            {
                                // student id existed in studentDevice table
                                _logger.LogWarning("Student" + studentID + "has stored in student device table, cannot register the current device.");
                                return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                            }

                            // student does not existed
                            // register the device 
                            string insertDeviceQuery = @"INSERT INTO studentDevice (studentID, deviceType, bindDate, deviceCode, uuID) OUTPUT INSERTED.deviceID VALUES (@StudentID, @DeviceType, @BindDate, @DeviceCode, @UUID);";

                            SqlParameter[] insertDeviceParameters = {
                                new SqlParameter("@StudentID", studentID),
                                new SqlParameter("@DeviceType", studentDeviceInfo.DeviceType),
                                new SqlParameter("@BindDate", DateTime.Today),
                                new SqlParameter("@DeviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID),
                                new SqlParameter("@UUID", studentDeviceInfo.UUID)
                            };

                            var deviceId = await _databaseContext.ExecuteScalarAsync<int>(insertDeviceQuery, insertDeviceParameters);
                            if (deviceId > 0)
                            {
                                // tested, ok
                                return $"Success:{deviceId.ToString()}";
                            }
                            return "Faile to register this device. Please try again.";
                        }
                    }
                    
                    if (uuidStatus == "re-use" || uuidStatus == "re-assign")
                    {
                        // device is not existed
                        // check the student id is in database or not 
                        string checkStudentIDQuery = @"SELECT studentID, deviceCode, deviceID FROM studentDevice WHERE studentID = @studentID";
                        SqlParameter[] checkStudentIDParameters =
                        {
                            new SqlParameter("@studentID", studentID)
                        };

                        var result3 = await _databaseContext.ExecuteQueryAsync(checkStudentIDQuery, checkStudentIDParameters);
                        if (result3 != null && result3.Rows.Count > 0)
                        {
                            // student id existed in student device table (db)
                            // check uuid existed 
                            // check uuid existed or not
                            string fetchQuery = @"SELECT studentID FROM studentDevice WHERE uuID = @UUID";
                            SqlParameter[] fetchParamater =
                            {
                                new SqlParameter("@UUID", studentDeviceInfo.UUID)
                            };
                            var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParamater);
                            if (result != null && result.Rows.Count > 0)
                            {
                                string UuidBindedStudentId = result.Rows[0]["studentID"].ToString();
                                if (studentID != UuidBindedStudentId)
                                {
                                    _logger.LogWarning("Student" + studentID + "try to register device with a uuid that already registered and used by other student: " + UuidBindedStudentId + ".");
                                    return $"This device is registered with another student ID: {UuidBindedStudentId}.";
                                }
                                _logger.LogWarning("Student" + studentID + "try to register device with not existed device code but uuid already in db. Means different device used.");
                                return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                            }
                            else
                            {
                                // uuid does not existed in db and device code not found
                                // student has registered to database
                                string deviceCode = result3.Rows[0]["deviceCode"].ToString();
                                string deviceId = result3.Rows[0]["deviceID"].ToString();
                                if (deviceCode == "default-device-code")
                                {
                                    // student rebind a new device
                                    // student device is no existed in database, means device is unbinded by admin, prebind for the student
                                    string updateDeviceQuery = @"UPDATE studentDevice SET deviceType = @deviceType, bindDate = @bindDate, deviceCode = @deviceCode, uuID = @uuid WHERE deviceID = @deviceID AND studentID = @studentID;";
                                    SqlParameter[] updateDeviceParameters = {
                                        new SqlParameter("@studentID", studentID),
                                        new SqlParameter("@deviceID", Convert.ToInt32(deviceId)),
                                        new SqlParameter("@deviceType", studentDeviceInfo.DeviceType),
                                        new SqlParameter("@bindDate", DateTime.Today),
                                        new SqlParameter("@deviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID),
                                        new SqlParameter("@uuid", studentDeviceInfo.UUID)
                                    };

                                    var result4 = await _databaseContext.ExecuteScalarAsync<int>(updateDeviceQuery, updateDeviceParameters);
                                    if (result4 > -1)
                                    {
                                        // tested, ok
                                        _logger.LogInformation("Student" + studentID + "success change the binding device.");
                                        return $"Success:{deviceId.ToString()}";
                                    }
                                    return "Failed to rebind a new device to your student ID. Please try again.";
                                }
                                else
                                {
                                    if (uuidStatus == "re-use")
                                    {
                                        // check is the uuid existed and bind with another student id
                                        // this browser logined with another account in the past that is different with current account (found device code means the current account's device code contains the same device properties with the current device)
                                        string fetchStudentIdQuery = @"SELECT studentID FROM studentDevice WHERE uuID = @UUID";
                                        SqlParameter[] fetchStudentIdParamater =
                                        {
                                            new SqlParameter("@UUID", studentDeviceInfo.UUID)
                                        };
                                        var result4 = await _databaseContext.ExecuteQueryAsync(fetchStudentIdQuery, fetchStudentIdParamater);
                                        if (result4 != null && result4.Rows.Count > 0)
                                        {
                                            // generally impossible occur because device code is not found
                                            // uuid found
                                            string UuidBindedStudentId = result4.Rows[0]["studentID"].ToString();
                                            if (studentID != UuidBindedStudentId)
                                            {
                                                _logger.LogWarning("Student" + studentID + "try to register device with a uuid that already registered and used by other student: " + UuidBindedStudentId + ".");
                                                return $"This device is registered with another student ID: {UuidBindedStudentId}.";
                                            }
                                            _logger.LogWarning("Student" + studentID + "try to register device with not existed device code but uuid already in db. Means different device used.");
                                            return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                                        }

                                        // uuid not found
                                        _logger.LogWarning("Student" + studentID + "use a uuid that is re-use but not found in db. Failed to validate device.");
                                        return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                                    }
                                    // the student has device code but no same as the current login device code
                                    _logger.LogWarning("Student" + studentID + "has device code but no same as the current login device code.");
                                    return "This device is not the device you registered, please use the registered device to proceed. If you want to change your binding device, please contact admin to remove your current binding device.";
                                }
                            }
                        }
                        else
                        {
                            // student id does not existed
                            // tested, ok
                            string studentRegisteredQuery = @"SELECT studentID FROM userDetail WHERE studentID = @studentID";
                            SqlParameter[] studentRegisteredParameters =
                            {
                                new SqlParameter("@studentID", studentID)
                            };
                            var result = await _databaseContext.ExecuteQueryAsync(studentRegisteredQuery, studentRegisteredParameters);
                            if (result != null && result.Rows.Count > 0)
                            {
                                // student register account but does not has binded device
                                string insertDeviceQuery = @"INSERT INTO studentDevice (studentID, deviceType, bindDate, deviceCode, uuID) OUTPUT INSERTED.deviceID VALUES (@StudentID, @DeviceType, @BindDate, @DeviceCode, @UUID);";

                                SqlParameter[] insertDeviceParameters = {
                                    new SqlParameter("@StudentID", studentID),
                                    new SqlParameter("@DeviceType", studentDeviceInfo.DeviceType),
                                    new SqlParameter("@BindDate", DateTime.Today),
                                    new SqlParameter("@DeviceCode", studentDeviceInfo.EncodeDeviceCodeWithoutUUID),
                                    new SqlParameter("@UUID", studentDeviceInfo.UUID)
                                };

                                var deviceId = await _databaseContext.ExecuteScalarAsync<int>(insertDeviceQuery, insertDeviceParameters);
                                if (deviceId > 0)
                                {
                                    // tested, ok
                                    return $"Success:{deviceId.ToString()}";
                                }
                                return "Faile to register this device. Please try again.";
                            }
                            else
                            {
                                // student havent register
                                return "Student ID not found. Please choose register before you login.";
                            }
                        }
                    }
                    
                    return $"Unknown status. Debug Info: uuid status: {uuidStatus}; current uuid: {studentDeviceInfo.UUID}";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{studentID}: {ex.Message}");
                return "Ann error occured while validate student device: " + ex.Message;
            }
        }

        public async Task<int> GetDeviceIdForCurrentStudentAsync(string studentId, string deviceCode)
        {
            try
            {
                string findDeviceQuery = @"SELECT deviceID FROM studentDevice WHERE studentID = @studentId AND deviceCode = @deviceCode";

                SqlParameter[] findDeviceParameters = {
                    new SqlParameter("@studentID", studentId),
                    new SqlParameter("@deviceCode", deviceCode)
                };

                var result = await _databaseContext.ExecuteQueryAsync(findDeviceQuery, findDeviceParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    var deviceId = Convert.ToInt32(result.Rows[0]["deviceID"]);
                    return deviceId;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting the device Id: " + ex.Message);
                return -1;
            }
        }

        public async Task<bool> CheckDeviceIdExisted(int deviceId)
        {
            try
            {
                string fetchQuery = @"SELECT deviceID FROM studentDevice WHERE deviceID = @deviceID";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@deviceID", deviceId)
                };
                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while checking the deviceId existed: " + ex.Message);
                return false;
            }
        } 
    }
}
