using attendance1.Web.Models;
using attendance1.Web.Models.PageModels;
using attendance1.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace attendance1.Web.Controllers
{
    public class AdminController : Controller
    {
        private readonly ClassService _classService;
        private readonly AdminService _adminService;
        
        public AdminController(ClassService classService, AdminService adminService)
        {
            _classService = classService;
            _adminService = adminService;
        }


        #region Programme Page
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetProgramme()
        {
            var programmeList = await _classService.GetAllProgrammeAsync();
            if (programmeList.Count == 0) 
            {
                TempData["PromptMessage"] = "No programme at here yet. Please add a programme first.";
            }
            var adminGroupedByProgrammeName = new Dictionary<string, List<StaffMdl>>();
            var classGroupedByProgrammeId = new Dictionary<int, List<ClassMdl>>();
            var adminList = await _adminService.GetAllAdminAsync();
            if (adminList != null && adminList.Count > 0)
            {
                adminGroupedByProgrammeName = adminList.GroupBy(admin => admin.UnderProgramme)
                                                      .ToDictionary(g => g.Key, g => g.ToList());
            }
           
            var classList = await _adminService.GetAllClassDetailsAsync();
            if (classList != null && classList.Count > 0)
            {
                classGroupedByProgrammeId = classList.GroupBy(classItem => classItem.ProgrammeId)
                                                       .ToDictionary(g => g.Key, g => g.ToList());
            }
            var model = new ProgrammePageMdl
            {
                ProgrammeList = programmeList,
                AdminGroupedByProgrammeName = adminGroupedByProgrammeName,
                ClassGroupedByProgrammeId = classGroupedByProgrammeId
            };
            return View("/Views/Admin/IndexAdmin.cshtml", model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> EditProgramme(int programmeId, string newProgrammeName)
        {
            var message = await _adminService.EditCurrentProgrammeAsync(programmeId, newProgrammeName);
            
            if (message == "New programme name saved successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while changing the programme name: " + message;
            }

            return RedirectToAction("GetProgramme", "Admin");
            
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddProgramme(string programmeName)
        {
            var message = await _adminService.AddNewProgrammeAsync(programmeName);

            if (message == "New programme added successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while adding the new programme: " + message;
            }

            return RedirectToAction("GetProgramme", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> DeleteProgramme(int programmeId)
        {
            var message = await _adminService.DeleteCurrentProgrammeAsync(programmeId);

            if (message == "Programme deleted successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while deleting this programme: " + message;
            }

            return RedirectToAction("GetProgramme", "Admin");
        }
        #endregion

        #region Admin Page
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAdmin()
        {
            var adminList = await _adminService.GetAllAdminAsync();
            var programList = await _classService.GetAllProgrammeAsync();
            var model = new AdminPageMdl
            {
                AllAdmin = adminList,
                AllProgramme = programList
            };
            return View("/Views/Admin/AdminPage.cshtml",  model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost] 
        public async Task<IActionResult> EditAdmin(string newAdminId, string adminName, string newAdminEmail, int newAdminProgramme)
        {
            var currentAdmin = new StaffMdl
            {
                StaffId = newAdminId,
                StaffName = adminName,
                StaffEmail = newAdminEmail,
            };
            var message = await _adminService.EditCurrentAdminAsync(currentAdmin, newAdminProgramme);

            if (message == "Admin detail changed successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while changing the admin detail: " + message;
            }

            return RedirectToAction("GetAdmin", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddAdmin(string adminId, string adminName, string adminEmail, string password, int adminProgramme)
        {
            var newAdmin = new StaffMdl
            {
                StaffId = adminId,
                StaffName = adminName,
                StaffEmail = adminEmail,
            };

            var message = await _adminService.AddNewAdminAsync(newAdmin, password, adminProgramme);

            if (message == "Admin account created successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while creating the admin account: " + message;
            }

            return RedirectToAction("GetAdmin", "Admin");

        }

        [Authorize(Roles = "Admin")]
        [HttpPost]  
        public async Task<IActionResult> DeleteAdmin(string deleteAdminId)
        {
            var message = await _adminService.DeleteCurrentAdminAsync(deleteAdminId);

            if (message == "Admin account deleted successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while deleting the admin account: " + message;
            }

            return RedirectToAction("GetAdmin", "Admin");
        }
        #endregion

        #region Lecturer Page
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetLecturer()
        {
            var lecturerList = await _adminService.GetAllLecturerAsync();
            var groupedClassBasedOnLecturer = new Dictionary<string, List<ClassMdl>>();

            foreach (var lecturer in lecturerList)
            {
                var classList = await _classService.GetClassForLecturerAsync(lecturer.StaffId);
                if (classList == null || classList.Count == 0)
                {
                    continue;
                }

                var classDetailList = new List<ClassMdl>();
                foreach (var classitem in classList)
                {
                    
                    var classDetail = await _classService.GetCourseDetailsForCurrentClassAsync(classitem.CourseId);
                    if (classDetail == null)
                    {
                        TempData["ErrorMessage"] = "An error occured while getting class details for lecturers.";
                        return View("/Views/Admin/LecturerPage.cshtml");
                    }
                    classDetailList.Add(classDetail);
                }
                groupedClassBasedOnLecturer.Add(lecturer.StaffId, classDetailList);
            }
            var model = new LecturerPageMdl
            {
                AllLecturer = lecturerList,
                GroupedClassBasedOnLecturer = groupedClassBasedOnLecturer
            };
            return View("/Views/Admin/LecturerPage.cshtml", model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> EditLecturer(string newLecturerId, string lecturerName, string newLecturerEmail)
        {
            var currentLecturer = new StaffMdl
            {
                StaffId = newLecturerId,
                StaffName = lecturerName,
                StaffEmail = newLecturerEmail,
            };
            var message = await _adminService.EditCurrentLecturerAsync(currentLecturer);

            if (message == "This lecturer's detail changed successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while changing the admin detail: " + message;
            }

            return RedirectToAction("GetLecturer", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddLecturer(string lecturerId, string lecturerName, string lecturerEmail, string password)
        {
            var newLecturer = new StaffMdl
            {
                StaffId = lecturerId,
                StaffName = lecturerName,
                StaffEmail = lecturerEmail
            };

            var message = await _adminService.AddNewLecturerAsync(newLecturer, password);

            if (message == "Lecturer account created successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while creating the lecturer account: " + message;
            }

            return RedirectToAction("GetLecturer", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> DeleteLecturer(string deleteLecturerId)
        {
            var message = await _adminService.DeleteCurrentLecturerAsync(deleteLecturerId);

            if (message == "Lecturer account deleted successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while deleting the lecturer account: " + message;
            }

            return RedirectToAction("GetLecturer", "Admin");
        }
        #endregion

        #region Student Page 
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetStudent()
        {
            List<string> studentIdList = new List<string>();
            var studentList = await _adminService.GetAllStudentAsync();
            
            foreach (var student in studentList)
            {
                studentIdList.Add(student.StudentID);
            }

            var groupedEnrolledClassesBasedOnStudentID = new Dictionary<string, List<ClassMdl>>();
            groupedEnrolledClassesBasedOnStudentID = await _adminService.GetEnrolledClassesForStudents(studentIdList);

            var groupedBindingDevicesBasedOnStudentID = new Dictionary<string, StudentDeviceMdl>();
            groupedBindingDevicesBasedOnStudentID = await _adminService.GetBindingDevicesForStudents(studentIdList);

            var model = new StudentPageMdl
            {
                StudentList = studentList,
                EnrolledClasses = groupedEnrolledClassesBasedOnStudentID,
                BindingDevices = groupedBindingDevicesBasedOnStudentID
            };
            return View("/Views/Admin/StudentPage.cshtml", model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> EditStudent(string newStudentId, string studentName, string oldStudentId)
        {
            var currentStudent = new StudentMdl
            {
                StudentID = oldStudentId,
                Name = studentName
            };
            var message = await _adminService.EditStudentIdForCurrentStudentAsync(currentStudent, newStudentId);

            if (message == "New Student ID saved successfully.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while changing this student ID: " + message;
            }

            return RedirectToAction("GetStudent", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> RemoveDevice(int removeDeviceId, string relatedStudentId)
        {
            var message = await _adminService.RemoveDeviceForStudentAsync(removeDeviceId, relatedStudentId);

            if (message == "Device of the student removed successfully.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while removing the device for the student: " + message;
            }
            return RedirectToAction("GetStudent", "Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> DeleteStudent(string deleteStudentId)
        {
            var message = await _adminService.DeleteCurrentStudentAsync(deleteStudentId);

            if (message == "Student account deleted successful.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while deleting the student account: " + message;
            }

            return RedirectToAction("GetStudent", "Admin");
        }
        #endregion

        #region FeedbackPage
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetFeedback()
        {
            var feedbackList = await _adminService.GetAllFeedbackAsync();
            if (feedbackList == null || feedbackList.Count == 0) 
            {
                TempData["PromptMessage"] = "There is no feedback yet.";
                feedbackList = new List<FeedbackMdl>();
            }

            var model = new FeedbackPageMdl
            {
                FeedbackList = feedbackList,
            };

            return View("/Views/Admin/FeedbackPage.cshtml", model);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> DeleteFeedback(int deleteFeedbackId)
        {
            var message = await _adminService.DeleteCurrentFeedbackAsync(deleteFeedbackId);

            if (message == "Feedback deleted successfully.")
            {
                TempData["SuccessMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occurred while deleting the feedback: " + message;
            }

            return RedirectToAction("GetFeedback", "Admin");
        }
        #endregion
    }
}
