using attendance1.Web.Data;
using attendance1.Web.Models;
using attendance1.Web.Models.PageModels;
//using Microsoft.CodeAnalysis.Elfie.Serialization;
using attendance1.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace attendance1.Web.Controllers
{
    public class ClassController : Controller
    {
        private readonly DatabaseContext _databaseContext;
        private readonly AccountService _accountService;
        private readonly ClassService _classService;

        //private readonly IHttpContextAccessor _httpContextAccessor;
        public ClassController(DatabaseContext databaseContext, AccountService accountService, ClassService classService)
        {
            _databaseContext = databaseContext;
            _accountService = accountService;
            _classService = classService;
        }

        [Authorize(Roles = "Lecturer")]
        [HttpGet]
        public async Task<IActionResult> GetClass()
        {
            //var lecturerId = User.FindFirstValue("LecturerID");
            var lecturerId = _accountService.GetCurrentLecturerId();
            if (string.IsNullOrEmpty(lecturerId))
            {
                TempData["ErrorMessage"] = "Please log in first.";
                return View("/Views/Login.cshtml");
            }

            var classList = await _classService.GetClassForLecturerAsync(lecturerId);
            if (classList.Count == 0)
            {
                TempData["PromptMessage"] = "Please add a class first.";
            }

            return View("/Views/Lecturer/IndexLec.cshtml", classList);
        }

        [Authorize(Roles = "Lecturer")]
        [HttpGet]
        public async Task<IActionResult> AddClass()
        {
            var ProgrammeList = await _classService.GetAllProgrammeAsync();
            if (ProgrammeList == null)
            {
                TempData["ErrorMessage"] = "Something error when getting the programmes list.";
            }

            var classModel = new ClassMdl
            {
                ProgrammeDropDownMenu = ProgrammeList,
            };

            return View("/Views/Lecturer/AddClass.cshtml", classModel);
        }

        [Authorize(Roles = "Lecturer")]
        [HttpGet]
        public async Task<IActionResult> ClassAttendance(int id)
        {
            if (id <= 0 || id == null)
            {
                var status = HttpStatusCode.BadRequest;
                return RedirectToAction("ErrorHandler", "Account", new { statusCode = status });
            }
            int courseId = id;
            bool courseStatus = false;
            //var courseDetails = await GetCourseDetails(courseId);
            var courseDetails = await _classService.GetCourseDetailsForCurrentClassAsync(courseId);
            if (courseDetails == null)
            {
                TempData["ErrorMessage"] = "Class not found. Please add the class first.";
                return RedirectToAction("AddClass", "Class");
            }

            var enrolledStudents = await _classService.GetEnrolledStudentsForCurrentClassAsync(courseId);
            if (enrolledStudents == null)
            {
                TempData["PromptMessage"] = "No student found. Please add the student first.";
            }
            //var semesterDetails = await GetSemesterDetails(courseDetails.SemesterId);
            //var regularClassDays = courseDetails.ClassDays.Split(',').Select(day => int.Parse(day)).ToList();
            var regularClassDays = _classService.ChangeRegularClassDayToIntListAsync(courseDetails.ClassDays);

            //var extraClassDays = await GetExtraClassDays(courseId);
            var extraClassDays = await _classService.GetExtraClassDayForCurrentClassAsync(courseId);
            
            //var latestAttendanceDate = await GetLatestAttendanceDate(courseId);
            var latestAttendanceDate = await _classService.GetLatestAttendanceDateForCurrentClassAsync(courseId);

            //var weekDetails = await GetWeekDetails(courseDetails.StartDate, courseDetails.EndDate, regularClassDays, extraClassDays, courseId);
            var weekDetails = await _classService.GetAllClassWeekWithDaysForCurrentClassAsync(courseDetails.StartDate, courseDetails.EndDate, regularClassDays, extraClassDays);

            var model = new ClassAttendanceMdl
            {
                ClassDetails = courseDetails,
                EnrolledStudents = enrolledStudents,
                ClassDays = regularClassDays,
                //StudentAttendance = await GetAttendance(courseId, enrolledStudents.Select(s => s.StudentID).ToList()),
                StudentAttendance = await _classService.GetStudentAttendanceForCurrentClassAsync(courseId, enrolledStudents.Select(s => s.StudentID).ToList()),
                LatestAttendanceDate = latestAttendanceDate,
                WeekDetails = weekDetails,
            };

            return View("/Views/Lecturer/ClassAttendancePage.cshtml", model);
        }

        [Authorize(Roles = "Lecturer")]
        [HttpGet]
        public async Task<IActionResult> EditClass(int id)
        {
            int courseId = id;
            ClassMdl classDetails = await _classService.GetCourseDetailsForCurrentClassAsync(courseId);
            if (classDetails == null)
            {
                return RedirectToAction("ErrorHandler", "Account");
            }

            classDetails.SessionMonth = classDetails.ClassSession.Split(" ")[0];
            classDetails.SessionYear = classDetails.ClassSession.Split(" ")[1];
            classDetails.ProgrammeDropDownMenu = await _classService.GetAllProgrammeAsync();

            return View("/Views/Lecturer/EditClass.cshtml", classDetails);
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> CreateClass(ClassMdl classmodel)
        {
            if (!ModelState.IsValid)
            {
                //return BadRequest();
                var status = HttpStatusCode.MethodNotAllowed;
                return RedirectToAction("ErrorHandler", "Account", new { statusCode = status});
            }

            var lecturerId = _accountService.GetCurrentLecturerId();
            if (string.IsNullOrEmpty(lecturerId))
            {
                TempData["ErrorMessage"] = "Please log in first.";
                return View("/Views/Login.cshtml");
            }
            try
            {
                var message = await _classService.AddNewClassAsync(classmodel, lecturerId);

                if (message == "A new class is added successfully.")
                {
                    TempData["SuccessMessage"] = message;
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occured whele adding the new class: " + message;
                }
                return RedirectToAction("AddClass", "Class");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while adding the class: " + ex.Message;
                return View("/Views/Lecturer/AddClass.cshtml");
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> EditClassDetail(ClassMdl classDetails)
        {
            if (!ModelState.IsValid)
            {
                return View(classDetails);
            }

            try
            {
                var message = await _classService.EditCurrentClassAsync(classDetails);

                //var message = await EditClassInfoAsync(classDetails);
                if (message == "Class details saved successfully.")
                {
                    TempData["SuccessMessage"] = message;
                    return RedirectToAction("ClassAttendance", "Class", new { id = classDetails.CourseId });
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while changing the class details: " + message;
                    return RedirectToAction("EditClass", "Class", new { id = classDetails.CourseId });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while changing the class details: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = classDetails.CourseId });
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> DeleteClass(int courseId)
        {
            try
            {
                //var message = await DeleteClassAsync(courseId);
                var message = await _classService.DeleteCurrentClassAsync(courseId);

                if (message == "Class deleted successfully.")
                {
                    TempData["SuccessMessage"] = message;
                    return RedirectToAction("GetClass", "Class");
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while deleting the class: " + message;
                    return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while deleting the class: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> AddStudent(IFormFile studentListFile, string studentId, string studentName, int courseId)
        {
            try
            {
                var studentListModel = _classService.ChangeStudentToModel(studentListFile, studentId, studentName);

                var message = await _classService.AddStudentsToCurrentClassAsync(studentListModel, courseId);

                if (message == "Student(s) add successfully.")
                {
                    TempData["SuccessMessage"] = message;
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while adding the students: " + message;
                }

                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while adding the students: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> DeleteStudent(int courseId, List<string> selectedStudentId)
        {
            try
            {
                var message = await _classService.DeleteStudentFromCurrentClassAsync(courseId, selectedStudentId);

                if (message == "Student(s) removed successfully.")
                {
                    TempData["SuccessMessage"] = message;
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while deleting the students: " + message;
                }

                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while deleting the students: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> DeleteClassDay(int courseId, string selectedClassDay)
        {
            try
            {
                if (string.IsNullOrEmpty(selectedClassDay))
                {
                    return BadRequest("Class day is required.");
                }
                DateTime dateToDelete = DateTime.ParseExact(selectedClassDay.Split(' ')[0], "dd/MM/yyyy", null);

                int recordId = Convert.ToInt32(selectedClassDay.Split('.')[1]);
                if (recordId == 0)
                {
                    TempData["ErrorMessage"] = "The class day does not exits any record.";
                    return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
                }

                //var message = await DeleteClassDayAsync(recordId, courseId, dateToDelete);
                var message = await _classService.DeleteClassDayForCurrentClassAsync(courseId, dateToDelete, recordId);

                if (message == "Class Day with attandance record deleted successfully.")
                {
                    TempData["SuccessMessage"] = message;
                }
                else
                {
                    TempData["ErrorMessage"] = "An error occurred while deleting the class day: " + message;
                }

                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while deleting the class day: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
        }

        [Authorize(Roles = "Lecturer")]
        [HttpPost]
        public async Task<IActionResult> EditStudentAttendance(int courseId, string changedStatuses)
        {
            try
            {
                var AllChanges = JsonSerializer.Deserialize<List<StudentAttendanceMdl>>(changedStatuses);
                var StudentId = AllChanges.FirstOrDefault().StudentId;
                var Date = AllChanges.FirstOrDefault().DateAndTime;

                var addAttendanceIds = AllChanges.Where(c => c.Action == "add").Select(c => c.AttendanceId).ToList();
                var deleteAttendanceIds = AllChanges.Where(c => c.Action == "delete").Select(c => c.AttendanceId).ToList();

                var addTask = addAttendanceIds.Count > 0 ? _classService.AddCurrentStudentAttendnaceRecordAsync(courseId, StudentId, Date, addAttendanceIds) : Task.FromResult("");
                var deleteTask = deleteAttendanceIds.Count > 0 ? _classService.DeleteCurrentStudentAttendnaceRecordAsync(courseId, StudentId, deleteAttendanceIds) : Task.FromResult("");

                await Task.WhenAll(addTask, deleteTask);

                var addMessage = addTask.Result;
                var deleteMessage = deleteTask.Result;

                if ((string.IsNullOrEmpty(addMessage) || addMessage == "Student's attendance added successfully.") &&
                    (string.IsNullOrEmpty(deleteMessage) || deleteMessage == "Student's attendance deleted successfully."))
                {
                    TempData["SuccessMessage"] = "Student's records changed successfully.";
                }
                else
                {
                    TempData["ErrorMessage"] = $"An error occurred while changing the record of the student: {addMessage} {deleteMessage}";
                }

                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                TempData["ErrorMessage"] = "An error occurred while changing the record of the student: " + ex.Message;
                return RedirectToAction("ClassAttendance", "Class", new { id = courseId });
            }
        }

    }
}
