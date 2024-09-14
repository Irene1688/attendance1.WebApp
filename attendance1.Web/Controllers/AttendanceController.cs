using attendance1.Web.Data;
using attendance1.Web.Models;
using attendance1.Web.Models.PageModels;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Reflection;
using System.Security.Claims;
using System.Data;
using System.CodeDom.Compiler;
using attendance1.Web.Services;
using Microsoft.AspNetCore.Authorization;

namespace attendance1.Web.Controllers
{
    public class AttendanceController : Controller
    {
        private readonly DatabaseContext _databaseContext;
        private readonly AccountService _accountService;
        private readonly AttendanceService _attendanceService;
        private readonly DeviceService _deviceService;
        private readonly ClassService _classService;
        private readonly ILogger _logger;

        public AttendanceController(DatabaseContext databaseContext, AccountService accountService, AttendanceService attendanceService, DeviceService deviceService, ClassService classService, ILogger<AttendanceController> logger)
        {
            _databaseContext = databaseContext;
            _accountService = accountService;
            _attendanceService = attendanceService;
            _deviceService = deviceService;
            _classService = classService;
            _logger = logger;
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> GenerateCode(int courseId, string CodeValidTime)
        {
            var attendanceCode = _attendanceService.GenerateRandomCode(6);
            var duration = _attendanceService.GetDuration(CodeValidTime);
            var now = DateTime.Now;

            var attendanceRecord = new AttendanceMdl
            {
                AttendanceCode = attendanceCode,
                Date = now.Date,
                StartTime = now.TimeOfDay,
                EndTime = now.TimeOfDay + duration,
                CourseID = courseId
            };

            int attendanceId = await _attendanceService.SaveAttendnaceCodeToDatabase(attendanceRecord);
            if (attendanceId > 0)
            {
                TempData["AttendanceId"] = attendanceId;
                TempData["AttendanceCode"] = attendanceCode;
                TempData["Duration"] = CodeValidTime;
                TempData["EndTime"] = attendanceRecord.EndTime.ToString();

                return RedirectToAction("CodePage", "Attendance", new { RecordId = attendanceId });
            }
            else
            {
                TempData["ErrorMessage"] = "Error occured when generate the attendance code, please try again.";
                return RedirectToAction("GetClass", "Class");
            }
            //string query = @"
            //                INSERT INTO attendanceRecord (attendanceCode, date, startTime, endTime, courseID) OUTPUT INSERTED.recordID
            //                VALUES (@AttendanceCode, @Date, @StartTime, @EndTime, @CourseID)";

            //SqlParameter[] parameters =
            //{
            //        new SqlParameter("@AttendanceCode", attendanceRecord.AttendanceCode),
            //        new SqlParameter("@Date", attendanceRecord.Date),
            //        new SqlParameter("@StartTime", attendanceRecord.StartTime),
            //        new SqlParameter("@EndTime", attendanceRecord.EndTime),
            //        new SqlParameter("@CourseID", attendanceRecord.CourseID)
            //};

            //int attendanceId = await _databaseContext.ExecuteScalarAsync<int>(query, parameters);
        }

        [Authorize(Roles = "Lecturer")]
        [HttpGet]
        public IActionResult CodePage(int RecordId)
        {
            if (TempData.Count == 4)
            {
                // Check if any TempData value is null or type is incorrect
                if (
                    TempData["EndTime"] is not string endTimeValue || 
                    TempData["AttendanceId"] is not int attendanceIdValue || 
                    TempData["AttendanceCode"] is not string attendanceCodeValue ||
                    TempData["Duration"] is not string durationValue)
                {
                    TempData["ErrorMessage"] = "Lost necessary data when generating the attendance code, please try again.";
                    return RedirectToAction("GetClass", "Class");
                }

                AttendanceMdl attendanceDetail = new AttendanceMdl()
                {
                    AttendanceId = Convert.ToInt32(attendanceIdValue),
                    AttendanceCode = attendanceCodeValue,
                    Duration = durationValue,
                    EndTime = TimeSpan.Parse(endTimeValue)
                };

                return View("/Views/Lecturer/CodePage.cshtml", attendanceDetail);
            }
            else
            {
                TempData["ErrorMessage"] = "Lost necessary data when generate the attendance code, please try again.";
                return RedirectToAction("GetClass", "Class");
            }
        }

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> SubmitAttendance(string attendanceCode, string deviceCode)
        {
            var studentId = _accountService.GetCurrentStudentId();
            var submitDateTime = DateTime.Now;
            
            var validAttendanceCode = await _attendanceService.FetchValidAttendanceCodeFromDatabaseAsync(attendanceCode, submitDateTime);

            string? message;

            if (validAttendanceCode.AttendanceCode == null)
            {
                message = "Invalid or expired attendance code. Please try again.";
                TempData["ErrorMessage"] = message;
                return RedirectToAction("TakeAttendancePage", "Attendance");
                //return View("/Views/Student/IndexStudent.cshtml");
            }

            var IsEnrolled = await _attendanceService.checkEnrollStatusOfCurrentStudent(studentId, validAttendanceCode.CourseID);
            if (!IsEnrolled)
            {
                message = "Failed to take attendance. You are not enrolled in this class.";
                TempData["ErrorMessage"] = message;
                return RedirectToAction("TakeAttendancePage", "Attendance");
            }

            //var studentDeviceMacAddress = _deviceService.GetMacAddress();
            var studentDeviceCode = _deviceService.GetEncodeDeviceCode(deviceCode);
            var studentDeviceId = await _deviceService.GetDeviceIdForCurrentStudentAsync(studentId, studentDeviceCode);
            if (studentDeviceId <= 0)
            {
                //device does not existed
                message = "Invalid device used. Please re-login and try again.";
                TempData["ErrorMessage"] = message;
                return RedirectToAction("TakeAttendancePage", "Attendance");
            }

            var IsDuplicate = await _attendanceService.CheckDuplicateAttendanceAsync(studentId, studentDeviceId,validAttendanceCode.AttendanceId);
            if (IsDuplicate)
            {
                message = "You have already took attendance!";
                TempData["ErrorMessage"] = message;
                return RedirectToAction("TakeAttendancePage", "Attendance");
            }

            var currentStudentAttendance = new StudentAttendanceMdl()
            {
                StudentId = studentId,
                CourseId = validAttendanceCode.CourseID,
                DateAndTime = submitDateTime,
                DeviceId = studentDeviceId,
                AttendanceId = validAttendanceCode.AttendanceId
            };

            message = await _attendanceService.SaveStudentAttendanceRecordToDatabaseAsync(currentStudentAttendance);
            if (message == "Take attendance successfully.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = message;
            }
            return RedirectToAction("TakeAttendancePage", "Attendance");
        }

        // debug
        private string GetCurrentStudentId()
        {
            string accRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            if (!string.IsNullOrWhiteSpace(accRole) && accRole == "Student")
            {
                //string studentId = UserSchoolRoleID;
                //return studentId;
                return "Success gain accRole in contoller";
            }
            return null;
        }

        [HttpGet]
        public async Task<IActionResult> TakeAttendancePage()
        {
            //var studentId = _accountService.GetCurrentStudentId();
            // debug
            var message = GetCurrentStudentId;
            _logger.LogError("message:"+  message);
            if (string.IsNullOrEmpty(studentId))
            {
                TempData["ErrorMessage"] = "Please login first.";
                return View("/Views/Login.cshtml");
            }

            var studentDetail = await _accountService.GetCurrentStudentDetailAsync(studentId);
            if (studentDetail.StudentID == null)
            {
                TempData["ErrorMessage"] = "Your student ID is incorrect. Please login again if your student ID have been changed.";
                return View("/Views/Login.cshtml");
            }

            var deviceId = _accountService.GetCurrentStudentDeviceId();
            if (deviceId <= 0 )
            {
                TempData["ErrorMessage"] = "Please login first.";
                return View("/Views/Login.cshtml");
            }
            var existedDeviceId = await _deviceService.CheckDeviceIdExisted(deviceId);
            if (!existedDeviceId)
            {
                TempData["ErrorMessage"] = "This device has been unbind to your student ID. Login again to bind the device to your student ID.";
                return View("/Views/Login.cshtml");
            }

            var historyStudentAttendance = await _attendanceService.GetCurrentStudentHistoryAsync(studentId);
            var adminDetail = await _accountService.GetManyAdminDetailAsync();

            var courseIdList = new List<int>();
            var courseDetail = new List<ClassMdl>();

            var model = new StudentTakeAttendancePageMdl();

            if (historyStudentAttendance != null)
            {
                foreach (var history in historyStudentAttendance)
                {
                    if (!courseIdList.Contains(history.CourseId)) // avoid repeat course id
                    {
                        courseIdList.Add(history.CourseId);
                    }
                }
                courseDetail = await _classService.GetCourseDetailsForManyCourseAsync(courseIdList);
            }

            // get the five day of current week
            var currentWeekDates = new List<int>();
            var currentWeekDays = new List<string>();
            var currentWeekMonths = new List<string>();

            DateTime today = DateTime.Today;
            int daysTillMonday = (int)DayOfWeek.Monday - (int)today.DayOfWeek;
            if (daysTillMonday > 0) daysTillMonday -= 7; 

            DateTime monday = today.AddDays(daysTillMonday);

            for (int i = 0; i < 5; i++)
            {
                var day = monday.AddDays(i);
                currentWeekDates.Add(day.Day);
                currentWeekDays.Add(day.ToString("ddd"));
                currentWeekMonths.Add(day.ToString("MMM"));
            }

            model.StudentDetail = studentDetail;
            model.StudentHistoryAttendance = historyStudentAttendance ?? new List<StudentAttendanceMdl>();
            model.StudentHistoryCourse = courseDetail;
            model.AdminInfo = adminDetail;
            model.CurrentWeekDate = currentWeekDates;
            model.CurrentWeekDay = currentWeekDays;
            model.CurrentWeekMonth = currentWeekMonths;

            return View("/Views/Student/IndexStudent.cshtml", model);
        }

        [Authorize(Roles = "Student")]
        [HttpGet]
        public async Task<IActionResult> HistoryAttendancePage()
        {
            var studentId = _accountService.GetCurrentStudentId();
            var historyStudentAttendance = await _attendanceService.GetCurrentStudentHistoryAsync(studentId);

            var courseIdList = new List<int>();
            var courseDetail = new List<ClassMdl>();

            var model = new StudentTakeAttendancePageMdl();

            if (historyStudentAttendance != null)
            {
                foreach (var history in historyStudentAttendance)
                {
                    if (!courseIdList.Contains(history.CourseId)) // avoid repeat course id
                    {
                        courseIdList.Add(history.CourseId);
                    }
                }
                courseDetail = await _classService.GetCourseDetailsForManyCourseAsync(courseIdList);

                // group attendance record based on date
                var groupedHistory = historyStudentAttendance
                    .GroupBy(h => h.DateAndTime.Date)
                    .OrderByDescending(g => g.Key)
                    .ToDictionary(g => g.Key, g => g.ToList());

                model.GroupedStudentHistoryAttendance = groupedHistory;
            }

            model.StudentHistoryAttendance = historyStudentAttendance ?? new List<StudentAttendanceMdl>();
            model.StudentHistoryCourse = courseDetail;

            return View("/Views/Student/HistoryAttendancePage.cshtml", model);
        }

    }

}
