using attendance1.Web.Data;
using attendance1.Web.Models;
using System.Data;
using System.Data.SqlClient;

namespace attendance1.Web.Services
{
    public class AdminService
    {
        private readonly DatabaseContext _databaseContext;

        public AdminService(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<List<ClassMdl>> GetAllClassDetailsAsync()
        {
            try
            {
                var classList = new List<ClassMdl>();
                string fetchQuery = @"SELECT c.courseCode, c.courseName, c.LecturerID, u.userName AS LecturerName, c.courseSession, c.programmeID, p.programmeName
                                      FROM course c
                                      JOIN programme p ON c.programmeID = p.programmeID
                                      JOIN userDetail u ON c.LecturerID = u.lecturerID";

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, []);
                if (result != null && result.Rows.Count > 0 )
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var classItem = new ClassMdl
                        {
                            CourseCode =row["courseCode"].ToString(),
                            ClassName = row["courseName"].ToString(),
                            LecturerId = row["LecturerID"].ToString(),
                            LecturerName = row["LecturerName"].ToString(),
                            ClassSession = row["courseSession"].ToString(),
                            ProgrammeId = Convert.ToInt32(row["programmeID"]),
                            Programme = row["programmeName"].ToString()
                        };
                        classList.Add(classItem);
                    }
                }
                return classList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting all class details: " + ex.Message);
                return new List<ClassMdl>();
            }
        }

        public async Task<string> EditCurrentProgrammeAsync(int programmeId, string newProgrammeName)
        {
            try
            {
                string editQeury = @"UPDATE programme SET programmeName = @newProgrammeName WHERE programmeID = @programmeId";

                SqlParameter[] editParameters =
                {
                    new SqlParameter("@newProgrammeName", newProgrammeName),
                    new SqlParameter("@programmeId", programmeId)
                };

                var result = await _databaseContext.ExecuteScalarAsync<int>(editQeury, editParameters);
                if (result > -1 ) 
                {
                    return "New programme name saved successful.";
                }
                return "Failed to saved new programme name.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while editting the programme name: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> AddNewProgrammeAsync(string programmeName)
        {
            try
            {
                string addQeury = @"INSERT INTO programme (programmeName) VALUES (@programmeName)";
                    
                SqlParameter[] addParameters =
                {
                    new SqlParameter("@ProgrammeName", programmeName)
                };

                var result = await _databaseContext.ExecuteScalarAsync<int>(addQeury, addParameters);
                if (result > -1)
                {
                    return "New programme added successful.";
                }
                return "Failed to add new programme name.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while adding the new programme: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> DeleteCurrentProgrammeAsync(int programmeId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string deleteApQuery = @"DELETE FROM adminProgramme WHERE programmeID = @programmeId";
                    SqlParameter[] deleteApParameters =
                    {
                        new SqlParameter("@programmeId", programmeId)
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(deleteApQuery, deleteApParameters, connection, transaction);
                    if (result1 == -1)
                    {
                        return false;
                    }

                    string deleteAdminQuery = @"DELETE FROM programme WHERE programmeID = @programmeId";
                    SqlParameter[] deleteAdminParameters =
                    {
                        new SqlParameter("@programmeId", programmeId)
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(deleteAdminQuery, deleteAdminParameters, connection, transaction);
                    if (result2 == -1)
                    {
                        return false;
                    }

                    return true;
                });

                if (IsDeleted)
                {
                    return "Programme deleted successful.";
                }
                return "Failed to delete this programme. Please ensure there is no class or admin under this programme.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while deleting this programme: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<List<StaffMdl>> GetAllAdminAsync()
        {
            try
            {
                var adminList = new List<StaffMdl>();
                string fetchQuery = @"SELECT ud.userName, ud.lecturerID, ud.accRole, ud.email, p.programmeName 
                                      FROM userDetail ud
                                      LEFT JOIN adminProgramme ap ON ud.userID = ap.userID
                                      LEFT JOIN programme p ON ap.programmeID = p.programmeID
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
                            StaffId = row["lecturerID"].ToString(),
                            StaffEmail = row["email"].ToString(),
                            UnderProgramme = row["programmeName"].ToString()
                        };
                        adminList.Add(admin);
                    }
                }
                return adminList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting all admin infomation: " + ex.Message);
                return new List<StaffMdl>();
            }
        }

        private async Task<int> GetAdminProgrammeRecordId(int userId, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string checkRecordQuery = @"SELECT apID FROM adminProgramme WHERE userID = @userID";
                SqlParameter[] checkRecordParameters =
                {
                new SqlParameter ("@userID", userId)
            };
                var result = await _databaseContext.ExecuteScalarAsync<int>(checkRecordQuery, checkRecordParameters, connection, transaction);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An errror occured while getting admin-programme record id: " + ex.Message);
                return -1;
            }
        }

        private async Task<int> InsertNewAdminProgrammeRecord(int userId, int programmeId, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string insertProgrammeQuery = @"INSERT INTO adminProgramme (userID, programmeID) VALUES (@userID, @programmeID)";
                SqlParameter[] insertProgrammeParameters =
                {
                    new SqlParameter("@userID", userId),
                    new SqlParameter("@programmeID", programmeId)
                };

                var result = await _databaseContext.ExecuteScalarAsync<int>(insertProgrammeQuery, insertProgrammeParameters, connection, transaction);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while insert new admin-programme record to database: " + ex.Message);
                return -1;
            }
            
        }

        private async Task<int> UpdateAdminProgrammeRecord(int apRecordId, int userId, int programmeId, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string editProgrammeQuery = @"UPDATE adminProgramme SET programmeID = @programmeID WHERE userID = @userID AND apID = @apID";
                SqlParameter[] editProgrammeParameters =
                {
                    new SqlParameter("@programmeID", programmeId),
                    new SqlParameter("@userID", userId),
                    new SqlParameter("@apID", apRecordId)
                };

                var result = await _databaseContext.ExecuteScalarAsync<int>(editProgrammeQuery, editProgrammeParameters, connection, transaction);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while update the admin-programme record: " + ex.Message);
                return -1;
            }
        }

        private async Task<int> DeleteAdminProgrammeRecord(int userId, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string deleteAdminProgrammeQuery = @"DELETE FROM adminProgramme WHERE userID = @userID";
                SqlParameter[] deleteAdminProgrammeParameters =
                {
                new SqlParameter ("@userID", userId)
            };

                var result = await _databaseContext.ExecuteScalarAsync<int>(deleteAdminProgrammeQuery, deleteAdminProgrammeParameters, connection, transaction);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while deleting admin-programme record: " + ex.Message);
                return -1;
            }
        }

        public async Task<string> EditCurrentAdminAsync(StaffMdl admin, int programmeId)
        {
            try
            {
                bool IsChanged = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string editUserDetailQuery = @"UPDATE userDetail SET lecturerID = @staffID, email = @staffEmail 
                                                   OUTPUT INSERTED.userID
                                                   WHERE userName = @adminName AND accRole = @accRole";
                    
                    SqlParameter[] editUserDetailParameters =
                    {
                        new SqlParameter ("@staffID", admin.StaffId),
                        new SqlParameter ("@staffEmail", admin.StaffEmail),
                        new SqlParameter ("@adminName", admin.StaffName),
                        new SqlParameter ("@accRole", "Admin")
                    };

                    var userId = await _databaseContext.ExecuteScalarAsync<int>(editUserDetailQuery, editUserDetailParameters, connection, transaction);
                    if (userId <= 0)
                    {
                        return false;
                    }

                    if (programmeId > 0 && userId > 0)
                    {
                        var apId = await GetAdminProgrammeRecordId(userId, connection, transaction);
                        switch (apId)
                        {
                            case -1:
                                return false;

                            case 0:
                            {
                                var result3 = await InsertNewAdminProgrammeRecord(userId, programmeId, connection, transaction); 
                                if (result3 == -1)
                                {
                                    return false;
                                }
                                break;
                            }

                            case > 0:
                            {
                                var result4 = await UpdateAdminProgrammeRecord(apId, userId, programmeId, connection, transaction);
                                if (result4 == -1)
                                {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (programmeId == 0 && userId > 0)
                    {
                        var result4 = await DeleteAdminProgrammeRecord(userId, connection, transaction);
                        if (result4 == -1)
                        {
                            return false;
                        }
                    }
                    return true;
                });

                if (IsChanged)
                {
                    return "Admin detail changed successful.";
                }
                
                return "Failed to saved change of this admin.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while changing the admin detail: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> AddNewAdminAsync(StaffMdl newAdmin, string password, int programmeId)
        {
            try
            {
                bool IsAdded = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string addUserDetailQuery = @"INSERT INTO userDetail (userName, lecturerID, email, accRole, userPassword) OUTPUT INSERTED.userID VALUES (@adminName, @StaffId, @adminEmail, @accRole, @password) ";
                    SqlParameter[] addUserDetailParameters = 
                    {
                        new SqlParameter ("@adminName", newAdmin.StaffName),
                        new SqlParameter ("@StaffId", newAdmin.StaffId),
                        new SqlParameter ("@adminEmail", newAdmin.StaffEmail),
                        new SqlParameter ("@accRole", "Admin"),
                        new SqlParameter ("@password", password)
                    };

                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(addUserDetailQuery, addUserDetailParameters, connection, transaction);
                    if (result1 == -1)
                    {
                        return false;
                    }

                    if (programmeId != 0 && result1 != 0) // result1 is the userid of the admin
                    {
                        string addProgrammeQuery = @"INSERT INTO adminProgramme (userID, programmeID) VALUES (@userId, @programmeId)";
                        SqlParameter[] addProgrammeParameters =
                        {
                            new SqlParameter ("@userId", result1),
                            new SqlParameter("@programmeId", programmeId)
                        };

                        var result2 = await _databaseContext.ExecuteScalarAsync<int>(addProgrammeQuery, addProgrammeParameters, connection, transaction);
                        if (result2 == -1)
                        {
                            return false;
                        }
                    }
                    return true;
                });

                if (IsAdded)
                {
                    return "Admin account created successful.";
                }

                return "Failed to add this admin.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while adding the admin as new user: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> DeleteCurrentAdminAsync(string staffId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string selectUserIdQuery = @"SELECT userID FROM userDetail WHERE lecturerID = @adminId";
                    SqlParameter[] selectUserIParameters =
                    {
                        new SqlParameter("@adminId", staffId)
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(selectUserIdQuery, selectUserIParameters, connection, transaction);
                    if (result1 <= 0)
                    {
                        return false;
                    }

                    string deleteApQuery = @"DELETE FROM adminProgramme WHERE userID = @userId";
                    SqlParameter[] deleteApParameters =
                    {
                        new SqlParameter("@userId", result1)
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(deleteApQuery, deleteApParameters, connection, transaction);
                    if (result2 == -1)
                    {
                        return false;
                    }

                    string deleteAdminQuery = @"DELETE FROM userDetail WHERE lecturerID = @adminId AND userID = @userId";
                    SqlParameter[] deleteAdminParameters =
                    {
                        new SqlParameter("@adminId", staffId),
                        new SqlParameter("@userId", result1)
                    };
                    var result3 = await _databaseContext.ExecuteScalarAsync<int>(deleteAdminQuery, deleteAdminParameters, connection, transaction);
                    if (result3 == -1)
                    {
                        return false;
                    }

                    return true;
                });

                if (IsDeleted)
                {
                    return "Admin account deleted successful.";
                }
                return "Failed to delete this admin.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while deleting this admin: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<List<StaffMdl>> GetAllLecturerAsync()
        {
            try
            {
                var lecturerList = new List<StaffMdl>();
                string fetchQuery = @"SELECT userName, lecturerID, email FROM userDetail WHERE accRole = @accRole";

                SqlParameter[] fetchParameters =
                {
                    new SqlParameter("@accRole", "Lecturer")
                };

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var lecturer = new StaffMdl
                        {
                            StaffName = row["userName"].ToString(),
                            StaffId = row["lecturerID"].ToString(),
                            StaffEmail = row["email"].ToString(),
                        };
                        lecturerList.Add(lecturer);
                    }
                }
                return lecturerList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting all lecturer infomation: " + ex.Message);
                return new List<StaffMdl>();
            }
        }

        public async Task<string> EditCurrentLecturerAsync(StaffMdl lecturer)
        {
            try
            {
                bool IsChanged = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    var oldLecturerID = string.Empty;
                    string fetchQuery = @"SELECT lecturerID FROM userDetail WHERE accRole = @accRole AND userName = @lecturerName";
                    SqlParameter[] fetchParameters =
                    {
                        new SqlParameter ("@accRole", "Lecturer"),
                        new SqlParameter ("@lecturerName", lecturer.StaffName)
                    };

                    var result1 = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters, connection, transaction);
                    if (result1 != null && result1.Rows.Count > 0)
                    {
                        DataRow row = result1.Rows[0];
                        oldLecturerID = row["lecturerID"].ToString();
                    }
                    else
                    {
                        return false;
                    }

                    string editQuery = @"UPDATE userDetail SET lecturerID = @lecturerId, email = @lecturerEmail WHERE accRole = @accRole AND userName = @lecturerName";
                    SqlParameter[] editParameters =
                    {
                        new SqlParameter ("@lecturerId", lecturer.StaffId),
                        new SqlParameter ("@lecturerEmail", lecturer.StaffEmail),
                        new SqlParameter ("@accRole", "Lecturer"),
                        new SqlParameter ("@lecturerName", lecturer.StaffName)
                    };

                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(editQuery, editParameters, connection, transaction);
                    if (result2 <= -1)
                    {
                        return false;
                    }

                    string editCourseQuery = @"UPDATE course SET lecturerID = @lecturerId WHERE lecturerID = @oldLecturerID";
                    SqlParameter[] editCourseParameters =
                    {
                        new SqlParameter ("@oldLecturerID", oldLecturerID),
                        new SqlParameter ("@lecturerID", lecturer.StaffId),
                    };

                    var result3 = await _databaseContext.ExecuteScalarAsync<int>(editCourseQuery, editCourseParameters, connection, transaction);
                    if (result3 <= -1)
                    {
                        return false;
                    }
                    return true;
                });
               

                if (IsChanged)
                {
                    return "This lecturer's detail changed successful.";
                }

                return "Failed to saved change of this lecturer.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while changing the lecturer's detail: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> AddNewLecturerAsync(StaffMdl newLecturer, string password)
        {
            try
            {
                string addQuery = @"INSERT INTO userDetail (userName, lecturerID, email, userPassword, accRole) VALUES (@lecturerName, @lecturerId, @lecturerEmail, @password, @accRole)";
                SqlParameter[] addParameters =
                {
                    new SqlParameter("@lecturerName", newLecturer.StaffName),
                    new SqlParameter("@lecturerId", newLecturer.StaffId),
                    new SqlParameter("@lecturerEmail", newLecturer.StaffEmail),
                    new SqlParameter("@password", password),
                    new SqlParameter("@accRole", "Lecturer")
                };
                var result = await _databaseContext.ExecuteScalarAsync<int>(addQuery, addParameters);
                if (result > -1)
                {
                    return "Lecturer account created successful.";
                }
                return "Failed to create the lecturer account.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while creating the letcurer account: " + ex.Message);
                return ex.Message;
            }
        }

        private async Task<List<int>> GetCourseIdForCurrentLecturerAsync(string lecturerId, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                var courseIdList = new List<int>();
                string getCourseQuery = @"SELECT courseID FROM course WHERE lecturerID = @lecturerId";
                SqlParameter[] getCourseParameters =
                {
                        new SqlParameter("@lecturerId", lecturerId)
                    };
                var result1 = await _databaseContext.ExecuteQueryAsync(getCourseQuery, getCourseParameters, connection, transaction);
                if (result1 != null && result1.Rows.Count > 0)
                {
                    foreach (DataRow row in result1.Rows)
                    {
                        courseIdList.Add(Convert.ToInt32(row["courseID"]));
                    }
                }
                return courseIdList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error ocuured while getting the course ids for the lecturer: " + ex.Message);
                return new List<int>();
            }
        }

        public async Task<string> DeleteCurrentLecturerAsync(string lecturerId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    var courseIdList = await GetCourseIdForCurrentLecturerAsync(lecturerId, connection, transaction);

                    if (courseIdList.Count > 0)
                    {
                        //delete the attendance record of the students under these classes of the lecturer
                        string joinedCourseIds = string.Join(",", courseIdList);
                        string deleteStudentAttendanceRecordQuery = $"DELETE FROM studentAttendance WHERE courseID IN ({joinedCourseIds})";
                        var result1 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentAttendanceRecordQuery, [], connection, transaction);
                        if (result1 <= -1)
                        {
                            return false;
                        }

                        //delete the enrolled student of these classes of the lecturer
                        string deleteEnrolledStudentQuery = $"DELETE FROM enrolledStudent WHERE courseID IN ({joinedCourseIds})";
                        var result2 = await _databaseContext.ExecuteScalarAsync<int>(deleteEnrolledStudentQuery, [], connection, transaction);
                        if (result2 <= -1)
                        {
                            return false;
                        }

                        //delete the attendance code generated by these classes of the lecturer
                        string deleteAttendanceCodeQuery = $"DELETE FROM attendanceRecord WHERE courseID IN ({joinedCourseIds})";
                        var result3 = await _databaseContext.ExecuteScalarAsync<int>(deleteAttendanceCodeQuery, [], connection, transaction);
                        if (result3 <= -1)
                        {
                            return false;
                        }

                        //delete the classes created by the lecturer
                        string deleteCourseQuery = $"DELETE FROM course WHERE courseID IN ({joinedCourseIds}) AND lecturerID = @lecturerId";
                        SqlParameter[] deleteCourseParameters =
                        {
                            new SqlParameter("@lecturerId", lecturerId)
                        };
                        var result4 = await _databaseContext.ExecuteScalarAsync<int>(deleteCourseQuery, deleteCourseParameters, connection, transaction);
                        if (result4 <= -1)
                        {
                            return false;
                        }
                    }

                    //delete the lecturer account
                    string deleteLecturerQuery = @"DELETE FROM userDetail WHERE lecturerID = @lecturerId AND accRole = @accRole";
                    SqlParameter[] deleteLecturerParameters =
                    {
                            new SqlParameter("@lecturerId", lecturerId),
                            new SqlParameter("@accRole", "Lecturer")
                        };
                    var result5 = await _databaseContext.ExecuteScalarAsync<int>(deleteLecturerQuery, deleteLecturerParameters, connection, transaction);
                    if (result5 <= -1)
                    {
                        return false;
                    }
                    return true;
                });

                if (IsDeleted)
                {
                    return "Lecturer account deleted successful.";
                }
                return "Failed to delete this lecturer.";
            }
            catch (Exception ex) 
            {
                Console.WriteLine("An error occured while deleting the lecturer account: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<List<StudentMdl>> GetAllStudentAsync()
        {
            try
            {
                List<StudentMdl> studentList = new List<StudentMdl>();
                string fetchQuery = @"SELECT userName, studentID FROM userDetail WHERE accRole = @accRole";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter ("@accRole", "Student")
                };
                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if ( result != null && result.Rows.Count > 0 )
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var student = new StudentMdl
                        {
                            Name = row["userName"].ToString(),
                            StudentID = row["studentID"].ToString(),
                        };
                        studentList.Add(student);
                    }
                }
                return studentList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while getting all student: " + ex.Message);
                return new List<StudentMdl>();
            }
        }

        public async Task<Dictionary<string, List<ClassMdl>>> GetEnrolledClassesForStudents(List<string> studentIds)
        {
            try
            {
                var enrolledClasses = new Dictionary<string, List<ClassMdl>>();

                var joinedStudentIds = string.Join(",", studentIds.Select(id => $"'{id}'"));

                // Query to get courseIDs from enrolledStudent table
                string getCourseIdsQuery = $"SELECT studentID, courseID FROM enrolledStudent WHERE studentID IN ({joinedStudentIds})";

                var courseResults = await _databaseContext.ExecuteQueryAsync(getCourseIdsQuery, []);

                if (courseResults != null && courseResults.Rows.Count > 0)
                {
                    // Create a dictionary to hold studentID and their corresponding courseIDs
                    var studentCourseIdDict = courseResults.AsEnumerable()
                                                         .GroupBy(row => row["studentID"].ToString())
                                                         .ToDictionary(
                                                             g => g.Key,
                                                             g => g.Select(row => Convert.ToInt32(row["courseID"])).ToList()
                                                         );

                    // Extract all courseIDs
                    var courseIds = studentCourseIdDict.Values.SelectMany(courseList => courseList).Distinct();
                    var joinedCourseIds = string.Join(",", courseIds);

                    // Query to get course details and lecturer names
                    string getCourseDetailsQuery = $@"SELECT cd.courseID, cd.courseCode, cd.courseName, cd.programmeID, cd.courseSession, cd.lecturerID, ud.userName AS lecturerName, p.programmeName
                                                  FROM course cd
                                                  JOIN userDetail ud ON cd.lecturerID = ud.lecturerId
                                                  JOIN programme p ON cd.programmeID = p.programmeID
                                                  WHERE cd.courseID IN ({joinedCourseIds})";

                    var courseDetailsResult = await _databaseContext.ExecuteQueryAsync(getCourseDetailsQuery, []);

                    if (courseDetailsResult != null && courseDetailsResult.Rows.Count > 0)
                    {
                        var courseDetailDict = courseDetailsResult.AsEnumerable()
                                                                  .ToDictionary(
                                                                      row => Convert.ToInt32(row["courseID"]),
                                                                      row => new ClassMdl
                                                                      {
                                                                          CourseId = Convert.ToInt32(row["courseID"]),
                                                                          CourseCode = row["courseCode"].ToString(),
                                                                          ClassName = row["courseName"].ToString(),
                                                                          ProgrammeId = Convert.ToInt32(row["programmeID"]),
                                                                          Programme = row["programmeName"].ToString(),
                                                                          ClassSession = row["courseSession"].ToString(),
                                                                          LecturerId = row["lecturerID"].ToString(),
                                                                          LecturerName = row["lecturerName"].ToString()
                                                                      }
                                                                  );

                        // Populate the enrolledClasses dictionary
                        foreach (var studentId in studentCourseIdDict.Keys)
                        {
                            var studentCourses = studentCourseIdDict[studentId]
                                .Where(courseId => courseDetailDict.ContainsKey(courseId))
                                .Select(courseId => courseDetailDict[courseId])
                                .ToList();

                            enrolledClasses[studentId] = studentCourses;
                        }
                    }
                }

                return enrolledClasses;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occred while get the enrolled classes for students: " + ex.Message);
                return new Dictionary<string, List<ClassMdl>>();
            }
            
        }

        public async Task<Dictionary<string, StudentDeviceMdl>> GetBindingDevicesForStudents(List<string> studentIds)
        {
            try
            {
                var studentDeviceDict = new Dictionary<string, StudentDeviceMdl>();

                var joinedStudentIds = string.Join(",", studentIds.Select(id => $"'{id}'"));
                string getDevicesQuery = $"SELECT studentID, deviceID, deviceCode, deviceType, bindDate FROM studentDevice WHERE studentID IN ({joinedStudentIds})";

                var deviceResults = await _databaseContext.ExecuteQueryAsync(getDevicesQuery, []);

                if (deviceResults != null && deviceResults.Rows.Count > 0)
                {
                    studentDeviceDict = deviceResults.AsEnumerable()
                                                     .GroupBy(row => row["studentID"]?.ToString() ?? string.Empty)
                                                     .Where(g => !string.IsNullOrEmpty(g.Key))
                                                     .ToDictionary(
                                                         g => g.Key!,
                                                         g => g.Select(row => new StudentDeviceMdl
                                                         {
                                                             DeviceId = Convert.ToInt32(row["deviceID"]),
                                                             EncodeDeviceCodeWithoutUUID = row["deviceCode"].ToString() ?? string.Empty,
                                                             DeviceType = row["deviceType"].ToString() ?? string.Empty,
                                                             BindDate = row["bindDate"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(row["bindDate"])
                                                         }).FirstOrDefault()!
                                                     );
                }

                return studentDeviceDict;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while getting the binding devices for students: " + ex.Message);
                return new Dictionary<string, StudentDeviceMdl>();
            }
        }

        public async Task<string> EditStudentIdForCurrentStudentAsync(StudentMdl currentStudent, string newStudentID)
        {
            try
            {
                bool IsChanged = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string editUserDetailQuery = @"UPDATE userDetail SET studentID = @newStudentID WHERE studentID = @oldStudentID AND userName = @studentName AND accRole = @accRole";
                    SqlParameter[] editUserDetailParameters =
                    {
                        new SqlParameter("@newStudentID", newStudentID),
                        new SqlParameter("@oldStudentID", currentStudent.StudentID),
                        new SqlParameter("@studentName", currentStudent.Name),
                        new SqlParameter("@accRole", "Student")
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(editUserDetailQuery, editUserDetailParameters, connection, transaction);
                    if (result1 == -1) 
                    {
                        return false;
                    }

                    string editEnrolledStudentQuery = @"UPDATE enrolledStudent SET studentID = @newStudentID WHERE studentID = @oldStudentID";
                    SqlParameter[] editEnrolledStudentParameters =
                    {
                        new SqlParameter("@newStudentID", newStudentID),
                        new SqlParameter("@oldStudentID", currentStudent.StudentID),
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(editEnrolledStudentQuery, editEnrolledStudentParameters, connection, transaction);
                    if (result2 == -1)
                    {
                        return false;
                    }

                    string editStudentAttendanceQuery = @"UPDATE studentAttendance SET studentID = @newStudentID WHERE studentID = @oldStudentID";
                    SqlParameter[] editStudentAttendanceParameters =
                    {
                        new SqlParameter("@newStudentID", newStudentID),
                        new SqlParameter("@oldStudentID", currentStudent.StudentID),
                    };
                    var result3 = await _databaseContext.ExecuteScalarAsync<int>(editStudentAttendanceQuery, editStudentAttendanceParameters, connection, transaction);
                    if (result3 == -1)
                    {
                        return false;
                    }

                    string editStudentDeviceQuery = @"UPDATE studentDevice SET studentID = @newStudentID WHERE studentID = @oldStudentID";
                    SqlParameter[] editStudentDeviceParameters =
                    {
                        new SqlParameter("@newStudentID", newStudentID),
                        new SqlParameter("@oldStudentID", currentStudent.StudentID),
                    };
                    var result4 = await _databaseContext.ExecuteScalarAsync<int>(editStudentDeviceQuery, editStudentDeviceParameters, connection, transaction);
                    if (result4 == -1)
                    {
                        return false;
                    }

                    return true;
                });

                if (IsChanged)
                {
                    return "New Student ID saved successfully.";
                }
                return "Failed to saved the new student ID.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while editting this student's student ID: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<string> RemoveDeviceForStudentAsync(int removeDeviceId, string relatedStudentId)
        {
            try
            {
                bool IsRemoved = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string removeDeviceQuery = @"UPDATE studentDevice SET deviceCode = @deviceCode, uuID = @uuid WHERE deviceID = @deviceId AND studentID = @studentId";
                    SqlParameter[] removeDeviceParameters =
                    {
                        new SqlParameter("@deviceId", removeDeviceId),
                        new SqlParameter("@studentId", relatedStudentId),
                        new SqlParameter("@deviceCode", "default-device-code"),
                        new SqlParameter("@uuid", DBNull.Value)
                    };

                    var result = await _databaseContext.ExecuteScalarAsync<int>(removeDeviceQuery, removeDeviceParameters, connection, transaction);
                    if (result <= -1)
                    {
                        return false;
                    }

                    return true;
                });

                if (IsRemoved)
                {
                    return "Device of the student removed successfully.";
                }
                return "Failed to remove the device for the student.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while removing the device: " + ex.Message);
                return ex.Message;

            }
        }

        public async Task<string> DeleteCurrentStudentAsync(string deleteStudentId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    // delete student attendance record
                    string deleteStudentAttendanceQuery = @"DELETE FROM studentAttendance WHERE studentID = @studentID";
                    SqlParameter[] deleteStudentAttendanceParameter =
                    {
                        new SqlParameter("@studentID", deleteStudentId)
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentAttendanceQuery, deleteStudentAttendanceParameter, connection, transaction);
                    if (result1 <= -1)
                    {
                        return false;
                    }

                    // delete student enrolled classes
                    string deleteEnrolledClassQuery = @"DELETE FROM enrolledStudent WHERE studentID = @studentID";
                    SqlParameter[] deleteEnrolledClassParameter =
                    {
                        new SqlParameter("@studentID", deleteStudentId)
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(deleteEnrolledClassQuery, deleteEnrolledClassParameter, connection, transaction);
                    if (result2 <= -1)
                    {
                        return false;
                    }

                    // delete student binding device
                    string deleteStudentDeviceQuery = @"DELETE FROM studentDevice WHERE studentID = @studentID";
                    SqlParameter[] deleteStudentDeviceParameter =
                    {
                        new SqlParameter("@studentID", deleteStudentId)
                    };
                    var result3 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentDeviceQuery, deleteStudentDeviceParameter, connection, transaction);
                    if (result3 <= -1)
                    {
                        return false;
                    }

                    //delete the student account
                    string deleteStudentQuery = @"DELETE FROM userDetail WHERE studentID = @studentId AND accRole = @accRole";
                    SqlParameter[] deleteStudentParameters =
                    {
                            new SqlParameter("@studentId", deleteStudentId),
                            new SqlParameter("@accRole", "Student")
                        };
                    var result4 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentQuery, deleteStudentParameters, connection, transaction);
                    if (result4 <= -1)
                    {
                        return false;
                    }
                    return true;
                });

                if (IsDeleted)
                {
                    return "Student account deleted successful.";
                }
                return "Failed to delete this student account.";
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occure while deleting the student account: " + ex.Message);
                return ex.Message;
            }
        }

        public async Task<List<FeedbackMdl>> GetAllFeedbackAsync()
        {
            try
            {
                List<FeedbackMdl> feedbackList = new List<FeedbackMdl>();
                string fetchQuery = @"SELECT f.feedbackId, f.studentId, u.userName, f.rating, f.feedbackContent, f.date 
                                      FROM feedback f
                                      JOIN userDetail u ON f.studentId = u.studentId
                                      WHERE u.accRole = @accRole";
                SqlParameter[] fetchParameters =
                {
                    new SqlParameter ("@accRole", "Student")
                };
                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, fetchParameters);
                if (result != null && result.Rows.Count > 0)
                {
                    foreach (DataRow row in result.Rows)
                    {
                        var feedback = new FeedbackMdl
                        {
                            FeedbackId = Convert.ToInt32(row["feedbackId"]),
                            StudentId = row["studentId"].ToString(),
                            StudentName = row["userName"].ToString(),
                            Date = Convert.ToDateTime(row["date"]),
                            Rate = Convert.ToInt32(row["rating"]),
                            FeedbackContent = row["feedbackContent"].ToString()
                        };
                        feedbackList.Add(feedback);
                    }
                }
                return feedbackList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occred while getting the feedbacks: " + ex.Message);
                return new List<FeedbackMdl>();
            }
        }

        public async Task<string> DeleteCurrentFeedbackAsync(int deleteFeedbackId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string deleteFeedbackQuery = @"DELETE FROM feedback WHERE feedbackId = @feedbackId";
                    SqlParameter[] deleteFeedbackParameters =
                    {
                        new SqlParameter("@feedbackId", deleteFeedbackId)
                    };

                    var result = await _databaseContext.ExecuteScalarAsync<int>(deleteFeedbackQuery, deleteFeedbackParameters, connection, transaction);
                    if (result <= -1)
                    {
                        return false;
                    }

                    return true;
                });

                if (IsDeleted)
                {
                    return "Feedback deleted successfully.";
                }
                return "Failed to delete the feedback.";

            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occred while deleting the feedbacks: " + ex.Message);
                return ex.Message;
            }
        }
    }
}
