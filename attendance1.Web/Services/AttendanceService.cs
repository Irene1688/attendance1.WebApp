using attendance1.Web.Data;
using attendance1.Web.Models;
using LiteDB;
using System.Data;
using System.Data.SqlClient;

namespace attendance1.Web.Services
{
    public class AttendanceService
    {
        private readonly DatabaseContext _databaseContext;

        public AttendanceService(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public string GenerateRandomCode(int length)
        {
            //const string chars = "0123456789AaBbCcDdEeFfGgHhiJjKkLMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
            const string chars = "0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public TimeSpan GetDuration(string codeValidTime)
        {
            return codeValidTime switch
            {
                "30 sec" => TimeSpan.FromSeconds(30),
                "1 Min" => TimeSpan.FromMinutes(1),
                "3 Min" => TimeSpan.FromMinutes(3),
                "5 Min" => TimeSpan.FromMinutes(5),
                _ => TimeSpan.Zero
            };
        }

        public async Task<int> SaveAttendnaceCodeToDatabase(AttendanceMdl codeInfo)
        {
            try
            {
                string query = @" INSERT INTO attendanceRecord (attendanceCode, date, startTime, endTime, courseID) OUTPUT INSERTED.recordID
                                  VALUES (@AttendanceCode, @Date, @StartTime, @EndTime, @CourseID)";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@AttendanceCode", codeInfo.AttendanceCode),
                    new SqlParameter("@Date", codeInfo.Date),
                    new SqlParameter("@StartTime", codeInfo.StartTime),
                    new SqlParameter("@EndTime", codeInfo.EndTime),
                    new SqlParameter("@CourseID", codeInfo.CourseID)
                };

                int attendanceId = await _databaseContext.ExecuteScalarAsync<int>(query, parameters);
                return attendanceId;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while sending the code to database: " + ex.Message);
                return -1;
            }

        }

        public async Task<AttendanceMdl> FetchValidAttendanceCodeFromDatabaseAsync(string studentAttendanceCode, DateTime studentSubmitDateTime)
        {
            var studentSubmitDate = studentSubmitDateTime.Date;
            var studentSubmitTime = studentSubmitDateTime.TimeOfDay;

            try 
            {
                string fetchAttendanceCodeQuery = @"SELECT TOP 100 recordID, attendanceCode, Date, startTime, endTime, courseID 
                                                    FROM attendanceRecord 
                                                    ORDER BY Date DESC";

                var result = await _databaseContext.ExecuteQueryAsync(fetchAttendanceCodeQuery, []);

                if (result != null && result.Rows.Count > 0)
                {
                    foreach (DataRow row in result.Rows)
                    {
                        string attendanceCode = row["attendanceCode"].ToString();
                        DateTime date = Convert.ToDateTime(row["Date"]);
                        TimeSpan startTime = TimeSpan.Parse(row["startTime"].ToString());
                        TimeSpan endTime = TimeSpan.Parse(row["endTime"].ToString());

                        if (attendanceCode == studentAttendanceCode && date.Date == studentSubmitDate && studentSubmitTime >= startTime && studentSubmitTime <= endTime)
                        {
                            return new AttendanceMdl
                            {
                                AttendanceId = Convert.ToInt32(row["RecordId"]),
                                AttendanceCode = row["AttendanceCode"].ToString(),
                                Date = date,
                                StartTime = startTime,
                                EndTime = endTime,
                                CourseID = Convert.ToInt32(row["CourseId"])
                            };
                            
                        }
                        
                    }
                }
                return new AttendanceMdl();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while validate the attendance code: " + ex.Message);
                return new AttendanceMdl();

            }
        }

        public async Task<string> SaveStudentAttendanceRecordToDatabaseAsync(StudentAttendanceMdl currentStudentAttendance) 
        {
            try
            {
                string insertQuery = @"INSERT studentAttendance(studentId, DateAndTime, courseId, deviceId, recordId)
                                       VALUES(@StudentId, @DateAndTime, @CourseId, @DeviceId, @AttendanceId)";

                SqlParameter[] parameters = 
                {
                    new SqlParameter("@StudentId", currentStudentAttendance.StudentId),
                    new SqlParameter("@DateAndTime", currentStudentAttendance.DateAndTime),
                    new SqlParameter("@CourseId", currentStudentAttendance.CourseId),
                    new SqlParameter("@DeviceId", currentStudentAttendance.DeviceId),
                    new SqlParameter("@AttendanceId", currentStudentAttendance.AttendanceId)
                };

                int result = await _databaseContext.ExecuteScalarAsync<int>(insertQuery, parameters);
                if (result >= 0)
                {
                    return "Take attendance successfully.";
                }
                else
                {
                    return "Failed to insert attendance record.";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while saving the attendance record of the student: " + ex.Message);
                return "Error: " + ex.Message;
            }
        }

        public async Task<bool> CheckDuplicateAttendanceAsync(string studentId, int deviceId, int attendanceId)
        {
            try
            {
                string checkQuery = @"SELECT studentID FROM studentAttendance
                                      WHERE recordID = @attendanceID AND (studentID = @studentID OR deviceID = @deviceID)";
                SqlParameter[] checkParameters =
                {
                    new SqlParameter("@studentID", studentId),
                    new SqlParameter("deviceID", deviceId),
                    new SqlParameter("@attendanceID", attendanceId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(checkQuery, checkParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured when check duplicate:" + ex.Message);
                return true;
            }
        }

        public async Task<bool> checkEnrollStatusOfCurrentStudent(string studentId, int courseId)
        {
            try
            {
                string checkQuery = @"SELECT studentID FROM enrolledStudent
                                      WHERE studentID = @studentID AND courseID = @courseID";

                SqlParameter[] checkParameters =
                {
                    new SqlParameter("@studentID", studentId),
                    new SqlParameter("@courseID", courseId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(checkQuery, checkParameters);
                if (result != null && result.Rows.Count > 0 )
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while check student enrolled status: " + ex.Message);
                return false;
            }
        }

        public async Task<List<StudentAttendanceMdl>> GetCurrentStudentHistoryAsync(string studentId)
        {
            try
            {
                var studentHistory = new List<StudentAttendanceMdl>();
                string fetchQuery = @"SELECT * FROM studentAttendance WHERE studentID = @studentID";

                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("studentID", studentId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var attendance = new StudentAttendanceMdl
                        {
                            StudentId = row["studentID"].ToString(),
                            DateAndTime = Convert.ToDateTime(row["DateAndTime"]),
                            CourseId = Convert.ToInt32(row["courseID"]),
                            DeviceId = row["deviceID"] != DBNull.Value ? Convert.ToInt32(row["deviceID"]) : (int?)null,
                            AttendanceId = Convert.ToInt32(row["attendanceID"])
                        };

                        studentHistory.Add(attendance);
                    }
                    return studentHistory;
                }
                return new List<StudentAttendanceMdl>();

            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while fetching history attendance: " + ex.Message);
                return new List<StudentAttendanceMdl>();
            }
        }
    }
}
