using attendance1.Web.Data;
using attendance1.Web.Models;
using System.Data.SqlClient;
using attendance1.Web.Pages;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Data;
using System.Globalization;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NuGet.Packaging;
using NuGet.Protocol.Plugins;
using System.Transactions;
using System.Reflection;
using System.Data.Common;
using NuGet.Common;
using System;
using Microsoft.VisualStudio.Web.CodeGeneration.Design;


namespace attendance1.Web.Services
{
    public class ClassService
    {
        private readonly DatabaseContext _databaseContext;

        public ClassService(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public async Task<Tuple<DateTime, DateTime>> GetSemesterDetails(int semesterId)
        {
            try
            {
                string query = "SELECT startWeek, endWeek FROM courseSemester WHERE semesterID = @SemesterID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@SemesterID", semesterId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return null;
                }

                var row = result.Rows[0];
                var startDate = Convert.ToDateTime(row["startWeek"]);
                var endDate = Convert.ToDateTime(row["endWeek"]);

                return Tuple.Create(startDate, endDate);
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while get semester details: " + ex.Message);
                return null;
            }
            
        }

        private async Task<string> GetCurrentProgrammeAsync(int programmeId)
        {
            try
            {
                string query = "SELECT programmeName FROM programme WHERE programmeID = @ProgrammeID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@ProgrammeID", programmeId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return null;
                }

                var row = result.Rows[0];
                var programme = row["programmeName"].ToString();

                return programme;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while" + ex.Message);
                return null;
            }
        }

        private async Task<int> AddOrGetSemesterIdForCurrentClassAsync(DateTime startDate, DateTime endDate, SqlConnection connection, SqlTransaction transaction)
        {
            int semesterId;
            try
            {
                string checkSemesterQuery = "SELECT semesterID FROM courseSemester WHERE startWeek = @StartDate AND endWeek = @EndDate";
                SqlParameter[] checkSemesterParameters =
                {
                    new SqlParameter("@StartDate", startDate),
                    new SqlParameter("@EndDate", endDate)
                };

                var existingSemesterId = await _databaseContext.ExecuteScalarAsync<int?>(checkSemesterQuery, checkSemesterParameters, connection, transaction);

                if (existingSemesterId > 0)
                {
                    semesterId = existingSemesterId;
                }
                else
                {
                    // Insert new semester
                    string semesterQuery = "INSERT INTO courseSemester (startWeek, endWeek) OUTPUT INSERTED.semesterID VALUES (@StartDate, @EndDate)";
                    SqlParameter[] semesterParameters =
                    {
                        new SqlParameter("@StartDate", startDate),
                        new SqlParameter("@EndDate", endDate)
                    };
                    semesterId = await _databaseContext.ExecuteScalarAsync<int>(semesterQuery, semesterParameters, connection, transaction);
                }

                return semesterId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing add or read semester ID query: {ex.Message}");
                return -1;
            }
        }

        private async Task<int> AddCurrentClassAsync(ClassMdl classDetail, string lecturerId, SqlConnection connection, SqlTransaction transaction)
        {
            int courseId;
            try
            {
                string courseQuery = "INSERT INTO course (courseCode, courseName, classDay, courseSession, lecturerID, programmeID, semesterID) OUTPUT INSERTED.courseID VALUES (@CourseCode, @CourseName, @ClassDays, @CourseSession, @LecturerID, @ProgrammeID, @SemesterID)";
                SqlParameter[] courseParameters =
                {
                        new SqlParameter("@CourseCode", classDetail.CourseCode),
                        new SqlParameter("@CourseName", classDetail.ClassName),
                        new SqlParameter("@ClassDays", classDetail.ClassDays),
                        new SqlParameter("@CourseSession", classDetail.SessionMonth + " " + classDetail.SessionYear),
                        new SqlParameter("@LecturerID", lecturerId),
                        new SqlParameter("@ProgrammeID", classDetail.ProgrammeId),
                        new SqlParameter("@SemesterID", classDetail.SemesterId)
                };
                courseId = await _databaseContext.ExecuteScalarAsync<int>(courseQuery, courseParameters, connection, transaction);
                return courseId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing add course query: {ex.Message}");
                return -1;
            }
        }

        private async Task<string> AddStudentsToCurrentClassAsync(IFormFile csvFile, int courseId, SqlConnection connection, SqlTransaction transaction)
        {
            using var reader = new StreamReader(csvFile.OpenReadStream());
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var EnrollStudentsList = csv.GetRecords<StudentMdl>().ToList();
            try
            {
                foreach (var student in EnrollStudentsList)
                {
                    string studentQuery = "INSERT INTO enrolledStudent (studentID, studentName, courseID) VALUES (@StudentID, @StudentName, @CourseID)";
                    SqlParameter[] studentParameters =
                    {
                            new SqlParameter("@StudentID", student.StudentID),
                            new SqlParameter("@StudentName", student.Name),
                            new SqlParameter("@CourseID", courseId)
                        };
                    await _databaseContext.ExecuteScalarAsync<int>(studentQuery, studentParameters, connection, transaction);
                }
                return "Students add successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }

        }

        private async Task<int> EditCurrentClassDetailAsync(ClassMdl classDetail, SqlConnection connection, SqlTransaction transaction)
        {
            try
            {
                string courseQuery = "UPDATE course SET courseCode = @CourseCode, courseName = @CourseName, classDay = @ClassDays, courseSession = @CourseSession, programmeID = @ProgrammeID, semesterID = @SemesterID WHERE courseID = @CourseID";
                SqlParameter[] courseParameters =
                {
                    new SqlParameter("@CourseCode", classDetail.CourseCode),
                    new SqlParameter("@CourseName", classDetail.ClassName),
                    new SqlParameter("@ClassDays", classDetail.ClassDays),
                    new SqlParameter("@CourseSession", classDetail.SessionMonth + " " + classDetail.SessionYear),
                    new SqlParameter("@ProgrammeID", classDetail.ProgrammeId),
                    new SqlParameter("@SemesterID", classDetail.SemesterId),
                    new SqlParameter("@CourseID", classDetail.CourseId)
                };
                var SuccessGetZero = await _databaseContext.ExecuteScalarAsync<int>(courseQuery, courseParameters, connection, transaction);
                return SuccessGetZero;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing add course query: {ex.Message}");
                return -1;
            }
        }

        public async Task<List<ClassMdl>?> GetClassForLecturerAsync(string lecturerId)
        {
            try
            {
                List<ClassMdl> classes = new List<ClassMdl>();
                string query = "SELECT courseID, courseCode, courseName, courseSession, classDay, semesterID FROM course WHERE lecturerID = @LecturerID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@LecturerID", lecturerId)
                };
            
                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<ClassMdl>();
                }

                foreach (DataRow row in result.Rows)
                {
                    var courseStatus = false;
                    var semesterId = Convert.ToInt32(row["semesterID"]);
                    var semesterDetails = await GetSemesterDetails(semesterId);
                    if (semesterDetails.Item2 >= DateTime.Now)
                    {
                        courseStatus = true;
                    }

                    var classItem = new ClassMdl
                    {
                        CourseId = Convert.ToInt32(row["courseID"]),
                        CourseCode = row["courseCode"].ToString(),
                        ClassName = row["courseName"].ToString(),
                        ClassSession = row["courseSession"].ToString(),
                        ClassDays = row["classDay"].ToString(),
                        IsActive = courseStatus
                    };
                    classes.Add(classItem);
                }

                return classes;
                //return result.AsEnumerable().Select(row => new ClassMdl
                //{
                //    CourseId = Convert.ToInt32(row["courseID"]),
                //    CourseCode = row["courseCode"].ToString(),
                //    ClassName = row["courseName"].ToString(),
                //    ClassSession = row["courseSession"].ToString(),
                //    ClassDays = row["classDay"].ToString(),
                //}).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing query: {ex.Message}");
                return null;
            }
        }

        public async Task<List<ProgrammeMdl>> GetAllProgrammeAsync()
        {
            try
            {
                string query = "SELECT programmeID, programmeName FROM programme";
                //SqlParameter[] parameters = [];

                var result = await _databaseContext.ExecuteQueryAsync(query, []);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<ProgrammeMdl>();
                }

                return result.AsEnumerable().Select(row => new ProgrammeMdl
                {
                    ProgrammeId = Convert.ToInt32(row["programmeID"]),
                    Programme = row["programmeName"].ToString()
                }).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing query: {ex.Message}");
                return new List<ProgrammeMdl>();
            }
        }

        public async Task<ClassMdl> GetCourseDetailsForCurrentClassAsync(int courseId)
        {
            try
            {
                string query = "SELECT courseID, programmeID, courseCode, courseName, courseSession, semesterID, classDay FROM course WHERE courseID = @CourseID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@CourseID", courseId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return new ClassMdl();
                }

                var row = result.Rows[0];
                int semesterId = Convert.ToInt32(row["semesterID"]);
                var semesterDetails = await GetSemesterDetails(semesterId);
                if (semesterDetails == null)
                {
                    return new ClassMdl();
                }
                var startDate = semesterDetails.Item1;
                var endDate = semesterDetails.Item2;
                var classStatus = false;
                if (endDate >= DateTime.Now)
                {
                    classStatus = true;
                }

                int programmeId = Convert.ToInt32(row["programmeID"]);
                var programme = await GetCurrentProgrammeAsync(programmeId);
                if (programme == null)
                {
                    return new ClassMdl();
                }

                return new ClassMdl
                {
                    CourseId = Convert.ToInt32(row["courseID"]),
                    CourseCode = row["courseCode"].ToString(),
                    ClassName = row["courseName"].ToString(),
                    ClassSession = row["courseSession"].ToString(),
                    StartDate = startDate,
                    EndDate = endDate,
                    ClassDays = row["classDay"].ToString(),
                    ProgrammeId = Convert.ToInt32(row["programmeID"]),
                    Programme = programme,
                    IsActive = classStatus
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while get course details for current class: " + ex.Message);
                return new ClassMdl();
            }
        }

        public async Task<List<StudentMdl>> GetEnrolledStudentsForCurrentClassAsync(int courseId)
        {
            try
            {
                string query = "SELECT studentID, studentName FROM enrolledStudent WHERE courseID = @CourseID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@CourseID", courseId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<StudentMdl>();
                }

                return result.AsEnumerable().Select(row => new StudentMdl
                {
                    StudentID = row["studentID"].ToString(),
                    Name = row["studentName"].ToString()
                }).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while get enrolled student for current class: " + ex.Message);
                return new List<StudentMdl>();
            }
        }

        public List<int> ChangeRegularClassDayToIntListAsync(string classDays)
        {
            return classDays.Split(',').Select(day => int.Parse(day)).ToList();
        }

        public async Task<List<AttendanceMdl>> GetExtraClassDayForCurrentClassAsync(int courseId)
        {
            try
            {
                string query = "SELECT recordID, Date, attendanceCode FROM attendanceRecord WHERE courseID = @CourseID";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@CourseID", courseId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<AttendanceMdl>();
                }

                return result.AsEnumerable().Select(row => new AttendanceMdl
                {
                    AttendanceId = Convert.ToInt32(row["recordID"]),
                    Date = Convert.ToDateTime(row["Date"])
                }).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while get extra class day for current class: " + ex.Message);
                return new List<AttendanceMdl>();
            }
        }

        public async Task<(int recordId, DateTime? attendanceDate)> GetLatestAttendanceDateForCurrentClassAsync(int courseId)
        {
            try
            {
                //string query = "SELECT MAX(recordID), Date FROM attendanceRecord WHERE courseID = @CourseID";
                string fetchQuery = @"SELECT recordID, Date FROM attendanceRecord WHERE courseID = @CourseID 
                                      AND recordID = ( SELECT MAX(recordID) FROM attendanceRecord WHERE courseID = @CourseID)";
                SqlParameter[] parameters =
                {
                    new SqlParameter("@CourseID", courseId)
                };

                var result = await _databaseContext.ExecuteQueryAsync(fetchQuery, parameters);
                if (result == null || result.Rows.Count == 0 || result.Rows[0][0] == DBNull.Value)
                {
                    return (0, null);
                }

                int recordId = Convert.ToInt32(result.Rows[0]["recordID"]);
                DateTime? attendanceDate = result.Rows[0]["Date"] != DBNull.Value ? Convert.ToDateTime(result.Rows[0]["Date"]) : (DateTime?)null;

                return (recordId, attendanceDate);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing query: {ex.Message}");
                return (0, null);
            }
            //try
            //{
            //    string query = "SELECT MAX(Date) FROM attendanceRecord WHERE courseID = @CourseID";
            //    SqlParameter[] parameters =
            //    {
            //        new SqlParameter("@CourseID", courseId)
            //    };

            //    var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
            //    if (result == null || result.Rows.Count == 0 || result.Rows[0][0] == DBNull.Value)
            //    {
            //        return null;
            //    }

            //    return Convert.ToDateTime(result.Rows[0][0]);
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine($"Error executing query: {ex.Message}");
            //    return new DateTime();
            //}
        }

        public Task<List<ClassWeekMdl>> GetAllClassWeekWithDaysForCurrentClassAsync(DateTime startDate, DateTime endDate, List<int> choosedClassDays, List<AttendanceMdl> extraClassDays)
        {
            var weeks = new List<ClassWeekMdl>();

            int daysToMonday = ((int)DayOfWeek.Monday - (int)startDate.DayOfWeek + 7) % 7;
            startDate = startDate.AddDays(daysToMonday);
            int totalWeeks = (endDate - startDate).Days / 7;

            for (int weekIndex = 0; weekIndex <= totalWeeks; weekIndex++)
            {
                var week = new ClassWeekMdl
                {
                    WeekIndex = weekIndex + 1,
                    AllClassDays = new List<string>()
                };

                var weekStartDate = startDate.AddDays(weekIndex * 7);
                var regularClassDays = choosedClassDays.Select(day => weekStartDate.AddDays(day - 1)).ToList();

                var combinedClassDays = new List<AttendanceMdl>();


                combinedClassDays.AddRange(extraClassDays
                    .Where(d => d.Date >= weekStartDate && d.Date < weekStartDate.AddDays(7)));

                combinedClassDays.AddRange(regularClassDays
                    .Where(date => !combinedClassDays.Any(mdl => mdl.Date == date))
                    .Select(date => new AttendanceMdl { Date = date }));

                combinedClassDays = combinedClassDays.OrderBy(d => d.Date).ThenBy(d => d.AttendanceId).ToList();

                foreach (var group in combinedClassDays.GroupBy(d => d.Date))
                {
                    var dates = group.ToList();
                    for (int i = 0; i < dates.Count; i++)
                    {
                        var date = dates[i];
                        if (dates.Count > 1)
                        {
                            week.AllClassDays.Add($"{date.Date:dd/MM/yyyy} - {i + 1}.{date.AttendanceId}");
                        }
                        else
                        {
                            week.AllClassDays.Add($"{date.Date:dd/MM/yyyy} .{date.AttendanceId}");
                        }
                    }
                }

                weeks.Add(week);
            }

            return Task.FromResult(weeks);
        }

        public async Task<List<StudentAttendanceMdl>> GetStudentAttendanceForCurrentClassAsync(int courseId, List<string> studentIds)
        {
            try
            {
                // Convert the student IDs to a string suitable for the IN clause
                string studentIdsList = string.Join(",", studentIds.Select(id => $"'{id}'"));

                // Construct the query with the student IDs directly embedded
                string query = $"SELECT recordID, studentID, DateAndTime FROM studentAttendance WHERE courseID = @CourseID AND studentID IN ({studentIdsList})";

                SqlParameter[] parameters =
                {
                    new SqlParameter("@CourseID", courseId),
                    new SqlParameter("@StudentIDList", studentIdsList)
                };

                var result = await _databaseContext.ExecuteQueryAsync(query, parameters);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<StudentAttendanceMdl>();
                }

                var studentAttendanceRecords = new List<StudentAttendanceMdl>();
                foreach (DataRow row in result.Rows)
                {
                    studentAttendanceRecords.Add(new StudentAttendanceMdl
                    {
                        StudentId = row["studentID"].ToString(),
                        DateAndTime = Convert.ToDateTime(row["DateAndTime"]),
                        AttendanceId = Convert.ToInt32(row["recordID"])
                    });
                }

                return studentAttendanceRecords;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occured while get student attendance for current class: " + ex.Message);
                return new List<StudentAttendanceMdl>();
            }
        }

        public async Task<string> AddNewClassAsync(ClassMdl classDetail, string lecturerId)
        {
            try
            {
                bool IsSaved = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    var semesterId = await AddOrGetSemesterIdForCurrentClassAsync(classDetail.StartDate, classDetail.EndDate, connection, transaction);
                    if (semesterId > 0)
                    {
                        classDetail.SemesterId = semesterId;
                    }
                    else
                    {
                        return false;
                    }

                    var courseId = await AddCurrentClassAsync(classDetail, lecturerId, connection, transaction);
                    if (courseId <= 0)
                    {
                        return false;
                    }

                    // Parse CSV file and insert into EnrolledStudent table
                    var message = await AddStudentsToCurrentClassAsync(classDetail.CsvFile, courseId, connection, transaction);

                    return true;
                });

                if (IsSaved)
                {
                    return "A new class is added successfully.";
                }
                else
                {
                    return "Failed to add a new class.";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> EditCurrentClassAsync(ClassMdl classDetail)
        {
            try
            {
                bool IsSaved = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    var semesterId = await AddOrGetSemesterIdForCurrentClassAsync(classDetail.StartDate, classDetail.EndDate, connection, transaction);
                    if (semesterId > 0)
                    {
                        classDetail.SemesterId = semesterId;
                    }
                    else
                    {
                        return false;
                    }

                    var status = await EditCurrentClassDetailAsync(classDetail, connection, transaction);
                    if (status != 0)
                    {
                        return false;
                    }

                    return true;
                });
                return "Class details saved successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> DeleteCurrentClassAsync(int courseId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string deleteStudentQuery = "DELETE FROM enrolledStudent WHERE courseID = @courseId";
                    SqlParameter[] StudentParams = {
                        new SqlParameter("@courseId", courseId)
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentQuery, StudentParams, connection, transaction);
                    if (result1 <= -1)
                    {
                        return false;
                    }

                    string deleteStudentAttendanceQuery = "DELETE FROM studentAttendance WHERE courseID = @courseId";
                    SqlParameter[] StudentAttendanceCodeParams = {
                        new SqlParameter("@courseId", courseId)
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<int>(deleteStudentAttendanceQuery, StudentAttendanceCodeParams, connection, transaction);
                    if (result2 <= -1)
                    {
                        return false;
                    }

                    string deleteAttendanceCodeQuery = "DELETE FROM attendanceRecord WHERE courseID = @courseId";
                    SqlParameter[] AttendanceCodeParams = {
                        new SqlParameter("@courseId", courseId)
                    };
                    var result3 = await _databaseContext.ExecuteScalarAsync<int>(deleteAttendanceCodeQuery, AttendanceCodeParams, connection, transaction);
                    if (result3 <= -1)
                    {
                        return false;
                    }

                    string deleteCourseQuery = "DELETE FROM course WHERE courseID = @courseId";
                    SqlParameter[] CourseParams = {
                        new SqlParameter("@courseId", courseId)
                    };
                    var result4 = await _databaseContext.ExecuteScalarAsync<int>(deleteCourseQuery, CourseParams, connection, transaction);
                    if (result4 <= -1)
                    {
                        return false;
                    }

                    return true;
                });
                
                if (IsDeleted)
                {
                    return "Class deleted successfully.";
                }
                return "Failed to deleted the class.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public List<StudentMdl> ChangeStudentToModel(IFormFile csvFile, string studentId, string studentName)
        {
            List<StudentMdl> studentList = new List<StudentMdl>();

            if (!string.IsNullOrEmpty(studentId) && !string.IsNullOrEmpty(studentName))
            {
                // Add single student
                studentList.Add(new StudentMdl { StudentID = studentId, Name = studentName });
            }
            else if (csvFile != null)
            {
                // Add multiple students from CSV
                using (var reader = new StreamReader(csvFile.OpenReadStream()))
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    studentList = csv.GetRecords<StudentMdl>().ToList();
                }
            }
            return studentList;
        }

        public async Task<string> AddStudentsToCurrentClassAsync(List<StudentMdl> studentList, int courseId)
        {
            try
            {
                foreach (var student in studentList)
                {
                    string studentQuery = "INSERT INTO enrolledStudent (studentID, studentName, courseID) VALUES (@StudentID, @StudentName, @CourseID)";
                    SqlParameter[] studentParameters =
                    {
                        new SqlParameter("@StudentID", student.StudentID),
                        new SqlParameter("@StudentName", student.Name),
                        new SqlParameter("@CourseID", courseId)
                    };
                    await _databaseContext.ExecuteScalarAsync<int>(studentQuery, studentParameters);
                }
                return "Student(s) add successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> DeleteStudentFromCurrentClassAsync(int courseId, List<string> StudentIds)
        {
            List<StudentMdl> studentList = new List<StudentMdl>();

            foreach (var studentId in StudentIds)
            {
                studentList.Add(new StudentMdl
                {
                    StudentID = studentId
                });
            }

            try
            {
                foreach (var student in studentList)
                {
                    bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                    {
                        string deleteFromClassQuery = "DELETE FROM enrolledStudent WHERE courseID = @courseId AND studentID = @studentId";
                        SqlParameter[] enrolledStudentParams = {
                            new SqlParameter("@courseId", courseId),
                            new SqlParameter("@studentId", student.StudentID)
                        };
                        var result1 = await _databaseContext.ExecuteScalarAsync<int>(deleteFromClassQuery, enrolledStudentParams, connection, transaction);
                        if (result1 <= -1)
                        {
                            return false;
                        }

                        //string deleteAttendanceQuery = "DELETE FROM studentAttendance WHERE courseID = @courseId AND studentID = @studentId";
                        //SqlParameter[] studentAttendanceParams = {
                        //    new SqlParameter("@courseId", courseId),
                        //    new SqlParameter("@studentId", student.StudentID)
                        //};
                        //var result2= await _databaseContext.ExecuteScalarAsync<int>(deleteAttendanceQuery, studentAttendanceParams, connection, transaction);
                        //if (result2 <= -1)
                        //{
                        //    return false;
                        //}
                        return true;
                    });
                    if (!IsDeleted)
                    {
                        return "Failed to remove this/these students.";
                    }
                }

                return "Student(s) removed successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> DeleteClassDayForCurrentClassAsync(int courseId, DateTime dateToDelete, int recordId)
        {
            try
            {
                bool IsDeleted = await _databaseContext.ExecuteInTransactionAsync(async (connection, transaction) =>
                {
                    string deleteStudentAttendanceQuery = "DELETE FROM studentAttendance WHERE courseID = @courseId AND recordID = @recordId";
                    SqlParameter[] studentAttendanceParams = {
                        new SqlParameter("@courseId", courseId),
                        new SqlParameter("@recordId", recordId)
                    };
                    var result1 = await _databaseContext.ExecuteScalarAsync<StudentMdl>(deleteStudentAttendanceQuery, studentAttendanceParams, connection, transaction);
                    if (result1 <= -1)
                    {
                        return false;
                    }

                    string deleteAttendanceCodeQuery = "DELETE FROM attendanceRecord WHERE courseID = @courseId AND recordID = @recordID AND Date = @Date";
                    SqlParameter[] AttendanceCodeParams = {
                        new SqlParameter("@courseId", courseId),
                        new SqlParameter("@recordId", recordId),
                        new SqlParameter("@Date", dateToDelete)
                    };
                    var result2 = await _databaseContext.ExecuteScalarAsync<StudentMdl>(deleteAttendanceCodeQuery, AttendanceCodeParams, connection, transaction);
                    if (result2 <= -1)
                    {
                        return false;
                    }

                    return true;
                });
                
                if (IsDeleted)
                {
                    return "Class Day with attandance record deleted successfully.";
                }
                return "Failed to delete Class Day with attandance record.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> AddCurrentStudentAttendnaceRecordAsync(int courseId, string studentID, DateTime date, List<int> attendanceIds)
        {
            try
            {
                // Build a single SQL query for batch insert
                string getDeviceIdQuery = @"SELECT deviceID FROM studentDevice WHERE studentID = @studentId";

                var deviceId = await _databaseContext.ExecuteScalarAsync<int>(getDeviceIdQuery, [new SqlParameter("@studentId", studentID)]);

                if (deviceId == 0)
                {
                    return "No binded device found for the given student. Please let the student to login first.";
                }

                // Build a single SQL query for batch insert
                var values = new List<string>();
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@courseId", courseId),
                    new SqlParameter("@studentId", studentID),
                    new SqlParameter("@deviceId", deviceId),
                    new SqlParameter("@currentDateTime", date)
                };

                for (int i = 0; i < attendanceIds.Count; i++)
                {
                    values.Add($"(@studentId, @currentDateTime, @courseId, @attendanceId{i}, @deviceId)");
                    parameters.Add(new SqlParameter($"@attendanceId{i}", attendanceIds[i]));
                }

                string AddStudentAttendanceQuery = $@"INSERT INTO studentAttendance (studentID, DateAndTime, courseID, recordID, deviceID)
                                                      VALUES {string.Join(", ", values)};";

                await _databaseContext.ExecuteScalarAsync<int>(AddStudentAttendanceQuery, parameters.ToArray());

                return "Student's attendance added successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<string> DeleteCurrentStudentAttendnaceRecordAsync(int courseId, string studentID, List<int> attendanceIds)
        {
            try
            {
                // Build parameter array for attendanceIds
                var attendanceIdParameters = attendanceIds.Select((id, index) =>
                    new SqlParameter($"attendanceId{index}", id)
                ).ToArray();

                // Add common parameters
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@courseId", courseId),
                    new SqlParameter("@studentId", studentID),
                };
                parameters.AddRange(attendanceIdParameters);

                string deleteAttendanceQuery = @"DELETE FROM studentAttendance 
                                                 WHERE courseID = @courseId 
                                                 AND studentID = @studentId 
                                                 AND recordID IN (" + string.Join(",", attendanceIdParameters.Select(p => $"@{p.ParameterName}")) + ")";

                await _databaseContext.ExecuteScalarAsync<int>(deleteAttendanceQuery, parameters.ToArray());

                return "Student's attendance deleted successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return ex.Message;
            }
        }

        public async Task<List<ClassMdl>> GetCourseDetailsForManyCourseAsync(List<int> courseIdList)
        {
            try
            {
                var courseDetailsList = new List<ClassMdl>();
                string courseIdString = string.Join(",", courseIdList);
                string query = $"SELECT courseID, courseCode, courseName, courseSession FROM course WHERE courseID IN ({courseIdString})";

                var result = await _databaseContext.ExecuteQueryAsync(query, []);
                if (result == null || result.Rows.Count == 0)
                {
                    return new List<ClassMdl>();
                }

                foreach (DataRow row in result.Rows)
                {
                    var classDetails = new ClassMdl
                    {
                        CourseId = Convert.ToInt32(row["courseID"]),
                        CourseCode = row["courseCode"].ToString(),
                        ClassName = row["courseName"].ToString(),
                        ClassSession = row["courseSession"].ToString()
                    };
                    courseDetailsList.Add(classDetails);
                }
                return courseDetailsList;
  
            }
            catch ( Exception ex )
            {
                Console.WriteLine("An error occured while getting course details: " + ex.Message);
                return new List<ClassMdl>();
            }
        }
    }
}
