using attendance1.Web.Data;
using Microsoft.AspNetCore.Mvc;
using attendance1.Web.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Reflection;
using System.Security.Claims;
using attendance1.Web.Services;
using System.Data;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;

namespace attendance1.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly DatabaseContext _databaseContext;
        private readonly AccountService _accountService;
        private readonly DeviceService _deviceService;
        private readonly ILogger _logger;

        public AccountController(DatabaseContext databaseContext, AccountService accountService, DeviceService deviceService, ILogger<AccountController> logger)
        {
            _databaseContext = databaseContext;
            _accountService = accountService;
            _deviceService = deviceService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult CheckLogin()
        {
            if (_accountService.IsLogined())
            {
                var role = _accountService.GetCurrentUserRole();
                return role switch
                {
                    "Admin" => RedirectToAction("GetProgramme", "Admin"),
                    "Lecturer" => RedirectToAction("GetClass", "Class"),
                    "Student" => RedirectToAction("TakeAttendancePage", "Attendance"),
                    _ => View("Views/Login.cshtml"),
                //_ => RedirectToPage("/Login")
                };
            }
            return View("Views/Login.cshtml");

        }

        #region login
        [HttpGet]
        [Route("/Login")]
        public IActionResult Login()
        {
            var role = _accountService.GetCurrentUserRole();
            if (role == "Student")
            {
                return RedirectToAction("CheckLogin", "Account");
            }

            return View("Views/Login.cshtml");
        }

        [HttpPost]
        [Route("/Login")]
        public async Task<IActionResult> Login(LoginMdl loginmodel, bool IsRegister, string DeviceIdentifier, string UuidStatus)
        {
            if (string.IsNullOrEmpty(loginmodel.Username) || ((string.IsNullOrEmpty(loginmodel.StudentID) && string.IsNullOrEmpty(loginmodel.Password))))
            {
                return BadRequest();
            }

            if ((loginmodel.Role == "Student" && string.IsNullOrEmpty(DeviceIdentifier)) || (loginmodel.Role == "Student" && string.IsNullOrEmpty(UuidStatus)))
            {
                return BadRequest();
            }

            string message;
            if (loginmodel.Role == "Student")
            {
                //var userAgent = Request.Headers["User-Agent"].ToString();
                message = await _accountService.LoginOrRegisterAsync(loginmodel, DeviceIdentifier, IsRegister, UuidStatus);
            }
            else
            {
                // login for staff
                message = await _accountService.LoginOrRegisterAsync(loginmodel, string.Empty, IsRegister, string.Empty);
            }

            return HandleLoginResult(message, loginmodel.Role, loginmodel.StudentID);
        }

        private IActionResult HandleLoginResult(string message, string role, string? studentID)
        {
            if (message.StartsWith("Login successfully"))
            {
                role = message.Split(".")[1];
                return role switch
                {
                    "Admin" => RedirectToAction("GetProgramme", "Admin"),
                    "Lecturer" => RedirectToAction("GetClass", "Class"),
                    "Student" => RedirectToAction("TakeAttendancePage", "Attendance", new {studentId = studentID }),
                    _ => StatusCode(StatusCodes.Status400BadRequest),
                };
            }

            TempData["ErrorMessage"] = GetLoginErrorMessage(message, role);
            return View("Views/Login.cshtml");
            //return RedirectToPage("/Login");
        }

        private string GetLoginErrorMessage(string message, string role)
        {
            if (role == "Student")
            {
                if (message.StartsWith("This device is registered with another student ID"))
                {
                    return $"{message} Please use this Student ID to login or try another device.";
                }

                return message;
            }
            return message;
        }
        #endregion

        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var userId = _accountService.GetCurrentUserId();
            var role = _accountService.GetCurrentUserRole();
            if (role == null || (role != "Admin" && role != "Lecturer") || userId <= 0)
            {
                return RedirectToAction("AccessDenied", "Error");
            }

            var staffId = String.Empty;
            if (role == "Admin")
            {
                staffId = _accountService.GetCurrentAdminId();
            }
            else if (role == "Lecturer")
            {
                staffId = _accountService.GetCurrentLecturerId();
            }

            if (string.IsNullOrEmpty(staffId))
            {
                throw new InvalidOperationException("Cannot get your staff ID.");
            }

            var personalInfo = await _accountService.GetCurrentStaffDetail(staffId, userId);

            return View("/Views/Shared/AdminLecturerShared/ProfilePage.cshtml", personalInfo);
        }

        [HttpPost]
        public async Task<IActionResult> EditProfile(string staffId, string staffName, string oldUserPassword, string newUserPassword)
        {
            var message = await _accountService.EditCurrentUserDetailAsync(staffId, staffName, oldUserPassword, newUserPassword);
            if (message == "The changes saved successfully.")
            {
                TempData["SuccessMessage"] = message;
            }
            else if (message == "Your password is incorrect. Failed to save change.")
            {
                TempData["ErrorMessage"] = message;
            }
            else
            {
                TempData["ErrorMessage"] = "An error occured while trying to save the change: " + message;
            }

            return RedirectToAction("Profile", "Account");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // clear cookies
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            //// clear claims
            //var claimsIdentity = User.Identity as ClaimsIdentity;
            //if (claimsIdentity != null)
            //{
            //    foreach (var claim in claimsIdentity.Claims)
            //    {
            //        claimsIdentity.RemoveClaim(claim);
            //    }
            //}

            return View("Views/Login.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback(int feedbackRating, string feedbackContent)
        {
            var accRole = _accountService.GetCurrentUserRole();
            if (accRole == null || accRole != "Student")
            {
                return RedirectToAction("AccessDenied", "Error");
            }

            if (feedbackRating == 0 && feedbackContent == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            var studentId = _accountService.GetCurrentStudentId();
            if (studentId == null || String.IsNullOrEmpty(studentId))
            {
                TempData["ErrorMessage"] = "Please login first.";
                return View("/Views/Login.cshtml");
            }

            var message = await _accountService.SaveFeedbackAsync(studentId, feedbackRating, feedbackContent);
            if (message == "The feeadback saved successfully.")
            {
                TempData["SuccessMessage"] = message + " Thank you for your feedback.";
            }
            else
            {
                TempData["ErrorMessage"] = "An error occured whele submitting your feedback: " + message + " Please try again.";
            }

            return RedirectToAction("TakeAttendancePage", "Attendance", new { studentId = studentId });
        }
    }
}
