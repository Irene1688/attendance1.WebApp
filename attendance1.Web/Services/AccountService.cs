using attendance1.Web.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Data.SqlClient;
using System.Security.Claims;
using attendance1.Web.Models;
using System.Data;



namespace attendance1.Web.Services
{
    public class AccountService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DatabaseContext _databaseContext;
        private readonly DeviceService _deviceService;
        private readonly ILogger _logger;

        public AccountService(IHttpContextAccessor httpContextAccessor, DatabaseContext databaseContext, DeviceService deviceService, ILogger<AccountService> logger)
        {
            _httpContextAccessor = httpContextAccessor;
            _databaseContext = databaseContext;
            _deviceService = deviceService;
            _logger = logger;
        }

        private string UserId => _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        private string UserSchoolRoleID => _httpContextAccessor.HttpContext.User.FindFirstValue("UserSchoolRoleID");
        //private string DeviceId => _httpContextAccessor.HttpContext.User.FindFirstValue("StudentDeviceId");
        private string AccRole => _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);


        private async Task<List<string>> ValidateStaffAsync(LoginMdl loginInput)
        {
            try
            {
                //string query = "SELECT userID, lecturerID, accRole FROM userDetail WHERE userName = @Username AND userPassword = @Password AND accRole IN ('Lecturer', 'Admin')";
                string query = "SELECT userID, lecturerID, accRole FROM userDetail WHERE userName = @Username AND userPassword = @Password AND accRole = @Role";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@Username", loginInput.Username),
                    new SqlParameter("@Password", loginInput.Password),
                    new SqlParameter("@Role", loginInput.Role)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                //if (result.Rows.Count > 0)
                if (result != null && result.Rows.Count > 0)
                {
                    var userId = result.Rows[0]["userID"].ToString();
                    var lecturerId = result.Rows[0]["lecturerID"].ToString();
                    var role = result.Rows[0]["accRole"].ToString();
                    return new List<string> { userId, lecturerId, role, ""};
                }
                else
                {
                    string message = "Check your name, password, and role and try again.";
                    return new List<string> { message };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while login process: " + ex.Message);
                return new List<string>();
            }
        }

        private async Task<List<string>> RegisterNewStudentAsync(LoginMdl loginInput)
        {
            try
            {
                // check student id existed or not
                string fetchQuey = @"SELECT studentID FROM userDetail WHERE studentID = @studentID";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@studentID", loginInput.StudentID)
                };
                var result = await _databaseContext.ExecuteQueryAsync(fetchQuey, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    // student ID existed, not allow to register
                    string message = "The student ID has been registered. Duplicate register action is not allowed. Please select login to proceed.";
                    return new List<string> { message };
                }

                // student ID does not existed, register the student
                string insertStudentQuery = @"INSERT INTO userDetail (userName, studentID, accRole) OUTPUT INSERTED.userID VALUES (@Username, @StudentID, @Role);";

                SqlParameter[] insertParameters =
                {
                    new SqlParameter("@Username", loginInput.Username),
                    new SqlParameter("@StudentID", loginInput.StudentID),
                    new SqlParameter("@Role", loginInput.Role)
                };

                int newUserId = await _databaseContext.ExecuteScalarAsync<int>(insertStudentQuery, insertParameters);

                return new List<string> { newUserId.ToString(), loginInput.StudentID, loginInput.Role };
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while register the new student: " + ex.Message);
                return new List<string>();
            }
           
        }

        private async Task<List<string>> GetUserDetailsAsync(LoginMdl loginInput)
        {
            try
            {
                string query = "SELECT userID, studentID, accRole FROM userDetail WHERE userName = @Username AND studentID = @StudentID AND accRole = @Role";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@Username", loginInput.Username),
                    new SqlParameter("@StudentID", loginInput.StudentID),
                    new SqlParameter("@Role", loginInput.Role)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);

                if (result != null && result.Rows.Count > 0)
                {
                    //student existed
                    var userId = result.Rows[0]["userID"].ToString();
                    var studentId = result.Rows[0]["studentID"].ToString();
                    var role = result.Rows[0]["accRole"].ToString();

                    return new List<string> { userId, studentId, role };
                }
                else
                {
                    string studentIdQuery = "SELECT studentID FROM userDetail WHERE studentID = @studentId";

                    SqlParameter[] studentIdParameters =
                    {
                        new SqlParameter("@Username", loginInput.Username),
                        new SqlParameter("@studentId", loginInput.StudentID),
                        new SqlParameter("@Role", loginInput.Role)
                    };
                    var IsRegistered = await _databaseContext.ExecuteQueryAsync(studentIdQuery, studentIdParameters);

                    if (IsRegistered != null && IsRegistered.Rows.Count > 0)
                    {
                        //studentId existed but different username
                        string message = "Check your name and password and try again.";
                        return new List<string> { message };
                        //return new List<string>();
                    }
                    else
                    {
                        //student does not existed
                        string message = "Student ID not found. If you are first time to use the website, please register first. If you are not first time use the website, and you have changed your student ID, please use your new student ID to login.";
                        return new List<string> { message };  
                        //var userDetail = await RegisterNewStudentAsync(loginInput);
                        //return userDetail;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting user details: " + ex.Message);
                return new List<string>();
            }
            
        }

        private async Task<List<string>> ValidateStudentAsync(LoginMdl loginInput, string deviceInfo, bool IsRegister, string UuidStatus)
        {
            var userDetail = new List<string>();
            //var studentDeviceInfo = await _deviceService.GetDeviceInfoAsync(deviceInfo);
            var studentDeviceInfo =  _deviceService.GetDeviceInfoAsync(deviceInfo);
            if (IsRegister)
            {
                //register
                if (UuidStatus == "re-use")
                {
                    string errorMessage = "This device is register with another student ID. Please try another device.";
                    userDetail.Add(errorMessage);
                    return userDetail;
                }
                else
                {
                    // uuid status == first assign
                    userDetail = await RegisterNewStudentAsync(loginInput);
                }
            }
            else
            {
                // login
                userDetail = await GetUserDetailsAsync(loginInput);
            }
            
            if (studentDeviceInfo == null || userDetail.Count == 0)
            {
                //Error occured while getting device infomation or student infomation
                _logger.LogError("Account Services, ValidateStudentAsync method: Failed to get device infomation or student infomation");
                return new List<string>();
            }

            var deviceIdOrErrorMessage = await _deviceService.ValidateStudentDeviceAndGetIdAsync(loginInput.StudentID, studentDeviceInfo, UuidStatus);
            userDetail.Add(deviceIdOrErrorMessage);
            return userDetail;
        }

        public async Task<string> LoginOrRegisterAsync(LoginMdl loginInput, string deviceIdentifier, bool IsRegister, string UuidStatus)
        {
            List<string> userDetail = loginInput.Role == "Student"
                                                         ? await ValidateStudentAsync(loginInput, deviceIdentifier, IsRegister, UuidStatus) //role = student
                                                         : await ValidateStaffAsync(loginInput); //role = staff

            if (userDetail.Count == 0)
            {
                return "Login failed.";
            }

            if (userDetail != null && userDetail.Count > 2 && (userDetail[3].StartsWith("Success") || string.IsNullOrEmpty(userDetail[3])))
            {
                // login success, proceed.
                return await RegisterUserClaims(userDetail, loginInput);
            }
            else if (userDetail != null && userDetail.Count > 2 && !userDetail[3].StartsWith("Success"))
            {
                // login failed, return error messsage
                return userDetail[3];
            }
            else if (userDetail.Count == 1 ||
                userDetail[0].StartsWith("Student ID not found") || 
                userDetail[0].StartsWith("The student ID has been registered") || 
                userDetail[0].StartsWith("Check your name and password and try again") ||
                userDetail[0].StartsWith("This device is register with another student ID"))
            {
                // login failed, return error messsage
                return userDetail[0];
            }
            else
            {
                return "Login failed.";
            }   
        }

        private async Task<string> RegisterUserClaims(List<string> userDetail, LoginMdl loginInput)
        {
            var userInfo = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userDetail[0]), // userid
                new(ClaimTypes.Name, loginInput.Username),
                new("UserSchoolRoleID", userDetail[1]), // admin id / lecturer id / student id
                new(ClaimTypes.Role, userDetail[2]), // acc role
                //new("StudentDeviceId", !string.IsNullOrEmpty(userDetail[3]) ? userDetail[3].Split(':')[1] : string.Empty) // null or device id
            };

            // only for student
            var IsRegister = RegisterStudentDetailToSession(userDetail);
            
            var userIdentity = new ClaimsIdentity(userInfo, CookieAuthenticationDefaults.AuthenticationScheme);
            
            var isPersistent = loginInput.Role == "Student" || loginInput.RememberMe; // student = true; or staff = true/ false
            var expiresUtc = isPersistent ? DateTimeOffset.UtcNow.AddDays(14) : (DateTimeOffset?)null;

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = isPersistent,
                ExpiresUtc = expiresUtc
            };

            try
            {
                await _httpContextAccessor.HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(userIdentity),
                    authProperties
                );

                var user = _httpContextAccessor.HttpContext.User;
                if (user.Identity.IsAuthenticated)
                {
                    _logger.LogInformation("SignInAsync executed successfully and user is authenticated.");
                    var role = user.FindFirstValue(ClaimTypes.Role);
                    _logger.LogInformation($"User role: {role}");
                }
                else
                {
                    _logger.LogWarning($"User with id {userDetail[1]} is not authenticated.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"User with id {userDetail[1]} sync in failed.");
            }

            //await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(userIdentity), authProperties);

            return "Login successfully." + userDetail[2];
        }

        public bool IsLogined()
        {
            if (_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated || _httpContextAccessor.HttpContext.Session.GetString("IsLogined") == "true")
            {
                return true;            
            }
            return false;
        }

        public string? GetCurrentLecturerId()
        {
            string accRole = AccRole;
            if (!string.IsNullOrWhiteSpace(accRole) && accRole == "Lecturer")
            {
                string lecturerId = UserSchoolRoleID;
                return lecturerId;
            }
            return null;
        }

        public string? GetCurrentUserRole()
        {
            var accRole = !string.IsNullOrWhiteSpace(AccRole) ? AccRole : _httpContextAccessor.HttpContext.Session.GetString("AccRole");

            return accRole;
        //    string accRole = AccRole;

        //    if (!string.IsNullOrWhiteSpace(accRole))
        //    {
        //        return accRole;
        //    }
        //    else
        //    {
        //        accRole = _httpContextAccessor.HttpContext.Session.GetString("AccRole");
        //    }
        //    return null;
        }

        public int GetCurrentStudentDeviceId()
        {
            string accRole = GetCurrentUserRole();
            if (!string.IsNullOrWhiteSpace(accRole) && accRole == "Student")
            {
                string deviceIdStr = _httpContextAccessor.HttpContext.Session.GetString("DeviceId");
                int deviceId = Convert.ToInt32(deviceIdStr);
                return deviceId;
            }
            return -1;
        }

        public bool RegisterStudentDetailToSession(List<string> userDetail)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (userDetail[2] == "Student" && httpContext != null)
            {
                httpContext.Session.SetString("UserId", userDetail[0]);
                httpContext.Session.SetString("StudentId", userDetail[1]);
                httpContext.Session.SetString("AccRole", userDetail[2]);
                httpContext.Session.SetString("DeviceId", !string.IsNullOrEmpty(userDetail[3]) ? userDetail[3].Split(':')[1] : string.Empty);
                httpContext.Session.SetString("IsLogined", "true");
                return true;
            }
            else
            {
                // not a student
                return false;
            }
        }

        public string? GetCurrentStudentId() 
        {
            string accRole = GetCurrentUserRole();
            if (!string.IsNullOrWhiteSpace(accRole) && accRole == "Student")
            {
                string studentId = _httpContextAccessor.HttpContext.Session.GetString("StudentId");
                return studentId;
            }
            return null;
        }

        public async Task<StudentMdl> GetCurrentStudentDetailAsync(string studentId)
        {
            try
            {
                string fetchQuery = @"SELECT studentID, userName FROM userDetail WHERE studentID = @studentID";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@studentID", studentId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    var row = result.Rows[0];
                    return new StudentMdl
                    {
                        StudentID = row["studentID"].ToString(),
                        Name = row["userName"].ToString()
                    };
                }
                return new StudentMdl();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting student infomation: " + ex.Message);
                return new StudentMdl();
            }
        }

        public async Task<List<StaffMdl>> GetManyAdminDetailAsync()
        {
            try
            {
                var adminList = new List<StaffMdl>();
                string fetchQuery = @"SELECT ud.userID, ud.userName, ud.email, ud.accRole, p.programmeName 
                                      FROM userDetail ud
                                      LEFT JOIN adminProgramme ap ON ud.userID = ap.userID
                                      LEFT JOIN Programme p ON ap.programmeID = p.programmeID
                                      WHERE ud.accRole = @accRole";

                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@accRole", "Admin")
                };
                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var admin = new StaffMdl
                        {
                            StaffName = row["userName"].ToString(),
                            AccRole = row["accRole"].ToString(),
                            StaffEmail = row["email"].ToString(),
                            UnderProgramme = row["programmeName"].ToString()
                        };

                        adminList.Add(admin);
                    }
                    return adminList;
                }
                return new List<StaffMdl>();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting admin detail: " + ex.Message);
                return new List<StaffMdl>();
            }
        }

        public string? GetCurrentAdminId()
        {
            string accRole = AccRole;
            if (!string.IsNullOrWhiteSpace(accRole) && accRole == "Admin")
            {
                string adminId = UserSchoolRoleID;
                return adminId;
            }
            return null;
        }

        public int GetCurrentUserId()
        {
            // student role cannot used the method
            // user id of student did not save
            int userId = Convert.ToInt32(UserId);
            if (userId != 0)
            {
                return userId;
            }
            return -1;
        }

        public async Task<StaffMdl> GetCurrentStaffDetail(string staffId, int userId)
        {
            try
            {
                string fetchQuery = @"SELECT userName, email, lecturerId, accRole FROM userDetail WHERE lecturerId = @staffId AND userID = @userId";
                SqlParameter[] fetecParameeters =
                {
                    new SqlParameter("@staffId", staffId),
                    new SqlParameter("@userId", userId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetecParameeters);
                if (result != null && result.Rows.Count > 0)
                {
                    DataRow row = result.Rows[0];
                    var staff = new StaffMdl
                    {
                        StaffName = row["userName"].ToString(),
                        StaffEmail = row["email"].ToString(),
                        StaffId = row["lecturerId"].ToString(),
                        AccRole = row["accRole"].ToString()
                    };
                    return staff;
                }
                return new StaffMdl();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting the personal account detail: " + ex.Message);
                return new StaffMdl();
            }
        }

        private async Task<bool> PasswordValidate(string staffId, string password)
        {
            try
            {
                string fetchQuery = @"SELECT * FROM userDetail WHERE lecturerId = @staffId AND userPassword = @password";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@staffId", staffId),
                    new SqlParameter("@password", password)
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
                Console.WriteLine("An error occured while getting the personal account detail (pw): " + ex.Message);
                return false;
            }
        }

        public async Task<string> EditCurrentUserDetailAsync(string staffId, string newStaffName, string oldUserPassword, string newUserPassword)
        {
            try
            {
                bool correctPassword = await PasswordValidate(staffId, oldUserPassword);
                if (!correctPassword)
                {
                    return "Your password is incorrect. Failed to save change.";
                }

                if (!String.IsNullOrWhiteSpace(newUserPassword))
                {
                    // save new password
                    string changeNameAndPasswordQuery = @"UPDATE userDetail SET userName = @staffName, userPassword = @userNewPassword WHERE lecturerId = @staffId AND userPassword = @userOldPassword";
                    SqlParameter[] changeNameAndPasswordParameters =
                    {
                        new SqlParameter("@staffName", newStaffName),
                        new SqlParameter("@userNewPassword", newUserPassword),
                        new SqlParameter("@staffId", staffId),
                        new SqlParameter("@userOldPassword", oldUserPassword)
                    };

                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(changeNameAndPasswordQuery, changeNameAndPasswordParameters);
                    if (result1 <= -1)
                    {
                        return "Failed to saved the change.";
                    }
                }
                else
                {
                    //only save name
                    string changeNameQuery = @"UPDATE userDetail SET userName = @staffName WHERE lecturerId = @staffId AND userPassword = @userOldPassword";
                    SqlParameter[] changeNameParameters =
                    {
                        new SqlParameter("@staffName", newStaffName),
                        new SqlParameter("@staffId", staffId),
                        new SqlParameter("@userOldPassword", oldUserPassword)
                    };

                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(changeNameQuery, changeNameParameters);
                    if (result2 <= -1)
                    {
                        return "Failed to saved the change.";
                    }
                }
                return "The changes saved successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while changing the personal account detail: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> SaveFeedbackAsync(string studentId, int rate, string feedbackContent)
        {
            try
            {
                string saveFeedbackQuery = @"INSERT INTO feedback (studentId, rating, feedbackContent, date)
                                             VALUES (@studentId, @rating, @feedbackContent, GETDATE())";
                SqlParameter[] saveFeedbackParameters =
                {
                    new SqlParameter("@studentId", studentId),
                    new SqlParameter("@rating", rate),
                    new SqlParameter("@feedbackContent", feedbackContent)
                };

                var result = await _databaseContext.ExecuteScalarAsync<int>(saveFeedbackQuery, saveFeedbackParameters);
                if (result <= -1)
                {
                    return "Failed to saved then feedback.";
                }

                return "The feeadback saved successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while saving the feedback content: " + ex.Message);
                return ex.Message;
            }
        }
    }
}
