using attendance1.Web.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Razor;
using attendance1.Web.Pages;
using attendance1.Web.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Reflection;
using System.Security.Claims;
using attendance1.Web.Services;
using System.Data;
using NuGet.Protocol.Core.Types;
using DeviceDetectorNET;
using DeviceDetectorNET.Cache;
using DeviceDetectorNET.Parser;
using UAParser;
using System.Management;
using System.Net.NetworkInformation;
using DeviceDetectorNET.Class.Device;
using attendance1.Web.Models.PageModels;
using System.Net;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;



namespace attendance1.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly DatabaseContext _databaseContext;
        private readonly AccountService _accountService;
        private readonly DeviceService _deviceService;

        public AccountController(DatabaseContext databaseContext, AccountService accountService, DeviceService deviceService)
        {
            _databaseContext = databaseContext;
            _accountService = accountService;
            _deviceService = deviceService;
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




        #region login 优化版
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
                    _ => RedirectToAction("ErrorHandler", "Account", new { statusCode = HttpStatusCode.BadRequest }),
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

                //if (message.StartsWith("Student ID not found") || message.StartsWith("The student ID has been registered"))
                //{
                //    return message;
                //}

                //return "Check your Name and Student ID and try again.";
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
                //var status = HttpStatusCode.BadRequest;
                //return RedirectToAction("ErrorHandler", "Account", new { statusCode = status });
                return RedirectToAction("AccessDenied", "Account");
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

            //// 2. 清除所有的Claims
            //var claimsIdentity = User.Identity as ClaimsIdentity;
            //if (claimsIdentity != null)
            //{
            //    // 清除所有Claim
            //    foreach (var claim in claimsIdentity.Claims)
            //    {
            //        claimsIdentity.RemoveClaim(claim);
            //    }
            //}

            return View("Views/Login.cshtml");
        }

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitFeedback(int feedbackRating, string feedbackContent)
        {
            if (feedbackRating == 0 && feedbackContent == null)
            {
                var status = HttpStatusCode.ServiceUnavailable;
                return RedirectToAction("ErrorHandler", "Account", new { statusCode = status });
            }

            var studentId = _accountService.GetCurrentStudentId();
            var message = await _accountService.SaveFeedbackAsync(studentId, feedbackRating, feedbackContent);
            if (message == "The feeadback saved successfully.")
            {
                TempData["SuccessMessage"] = message + " Thank you for your feedback.";
            }
            else
            {
                TempData["ErrorMessage"] = "An error occured whele submitting your feedback: " + message + " Please try again.";
            }

            Console.WriteLine(feedbackRating.ToString());
            Console.WriteLine(feedbackContent);
            return RedirectToAction("TakeAttendancePage", "Attendance", new { studentId = studentId });
        }

        #region Error Page
        [HttpGet]
        public async Task<IActionResult> AccessDenied()
        {
            //return StatusCode(403);
            var info = new
            {
                StatusCode = "403",
                Message = "Access Not Granted"
            };
            return View("Views/ErrorPage.cshtml", info);
        }

        [HttpGet]
        public async Task<IActionResult> ErrorHandler(HttpStatusCode statusCode)
        {
            //Get status Code Message
            string status = Enum.GetName(typeof(HttpStatusCode), statusCode);
            if (string.IsNullOrEmpty(status))
            {
                status = "Internal Server Error";
            }

            // get error details
            string? originalQueryString = null;
            string? fullOriginalPath = null;
            int originalStatusCode = Convert.ToInt32(statusCode);
            bool hasStatusCodeReExecuteFeature = false;
            var statusCodeReExecuteFeature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            if (statusCodeReExecuteFeature != null)
            {
                originalStatusCode = statusCodeReExecuteFeature.OriginalStatusCode;
                fullOriginalPath = statusCodeReExecuteFeature.OriginalPathBase + statusCodeReExecuteFeature.OriginalPath + originalQueryString;
                hasStatusCodeReExecuteFeature = true;
            }

            // Get Exception details
            var exceptionDetails = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            var errorDetails = new
            {
                StatusCode = statusCode != 0 ? Convert.ToInt32(statusCode) : 500,
                Message = Regex.Replace(status, "([A-Z])", " $1").Trim(),

                HasStatusCodeReExecuteFeature = hasStatusCodeReExecuteFeature,
                OriginalStatusCode = originalStatusCode,
                FullOriginalPath = fullOriginalPath,

                HasException = exceptionDetails != null,
                ExceptionMessage = exceptionDetails?.Error.Message,
                //ExceptionStackTrace = exceptionDetails?.Error.StackTrace,
                ExceptionInner = exceptionDetails?.Error.InnerException?.Message
            };
            return View("Views/ErrorPage.cshtml", errorDetails);
        }

        #endregion
    }
}
