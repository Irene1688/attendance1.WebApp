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



namespace attendance1.Web.Controllers
{
    //public class AccountController : Controller
    //{
    //    private readonly DatabaseContext _databaseContext;

    //    public AccountController(DatabaseContext databaseContext)
    //    {
    //        _databaseContext = databaseContext;
    //    }

    //    [HttpGet]
    //    public IActionResult CheckLogin()
    //    {
    //        if (User.Identity.IsAuthenticated)
    //        {
    //            var role = User.FindFirst(ClaimTypes.Role)?.Value;

    //            switch (role)
    //            {
    //                case "Admin":
    //                    return RedirectToPage("/Admin/IndexAdmin");
    //                case "Lecturer":
    //                    return RedirectToAction("GetClass", "Class");
    //                    //return RedirectToPage("/Lecturer/IndexLecturer");
    //                default:
    //                    return RedirectToPage("/Login");
    //            }
    //        }
    //        return View();
    //    }

    //    [HttpPost]
    //    public async Task<IActionResult> Login(LoginMdl loginmodel)
    //    {
    //        string query = "SELECT userID, lecturerID, accRole FROM userDetail WHERE userName = @Username AND userPassword = @Password";
    //        SqlParameter[] parameters =
    //        [
    //            new SqlParameter("@Username", loginmodel.Username),
    //            new SqlParameter("@Password", loginmodel.Password)
    //        ];

    //        var result = _databaseContext.ExecuteQuery(query, parameters);

    //        if (result.Rows.Count > 0)
    //        {
    //            var userId = result.Rows[0]["userID"].ToString();
    //            string? lecturerId = result.Rows[0]["lecturerID"].ToString();
    //            string? role = result.Rows[0]["accRole"].ToString();

    //            // remember user 
    //            var userInfo = new List<Claim>
    //                {
    //                    new Claim(ClaimTypes.NameIdentifier, userId),
    //                    new Claim(ClaimTypes.Name, loginmodel.Username),
    //                    new Claim("LecturerID", lecturerId),
    //                    new Claim(ClaimTypes.Role, role)
    //                };

    //            var userIdentity = new ClaimsIdentity(userInfo, CookieAuthenticationDefaults.AuthenticationScheme);

    //            var authProperties = new AuthenticationProperties
    //            {
    //                IsPersistent = loginmodel.RememberMe
    //            };

    //            await HttpContext.SignInAsync(
    //                CookieAuthenticationDefaults.AuthenticationScheme,
    //                new ClaimsPrincipal(userIdentity),
    //                authProperties);

    //            // redirect 
    //            switch (role)
    //            {
    //                case "Admin":
    //                    //return RedirectToAction("Index", "Admin");
    //                    return RedirectToPage("/Admin/IndexAdmin");
    //                case "Lecturer":
    //                    return RedirectToAction("GetClass", "Class");
    //                    //return RedirectToPage("/Lecturer/IndexLecturer");
    //                default:
    //                    // 默认跳转到首页或其他页面
    //                    return RedirectToPage("/Error");
    //            }
    //        }

    //        TempData["ErrorMessage"] = "Check your name and password and try again.";
    //        return RedirectToPage("/Login");
    //    }
    //}

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
                    _ => RedirectToPage("/Login")
                };
            }
            return RedirectToPage("/Login");

            //if (User.Identity.IsAuthenticated)
            //{
            //    var role = User.FindFirst(ClaimTypes.Role)?.Value;

            //    return role switch
            //    {
            //        "Admin" => RedirectToPage("/Admin/IndexAdmin"),
            //        "Lecturer" => RedirectToAction("GetClass", "Class"),
            //        _ => RedirectToPage("/Login"),
            //    };
            //}
            //return View();
        }

        


        #region login 优化版
        [HttpPost]
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
                    //_ => RedirectToPage("/Error"),
                    _ => RedirectToAction("ErrorHandler", "Account", new { statusCode = HttpStatusCode.BadRequest }),
                };
            }

            TempData["ErrorMessage"] = GetLoginErrorMessage(message, role);
            return RedirectToPage("/Login");
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
            // 1. 清除身份验证Cookie
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

            // 4. 重定向到登录页面或其他适当的位置
            return RedirectToPage("/Login"); // 假设登录页面是 "Login" 方法在 "Account" 控制器中
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
            //return StatusCode(404);
            string status = Enum.GetName(typeof(HttpStatusCode), statusCode);
            if (string.IsNullOrEmpty(status))
            {
                status = "Unknown Error";
            }

            var info = new
            {
                    StatusCode = Convert.ToInt32(statusCode),
                    Message = Regex.Replace(status, "([A-Z])", " $1").Trim()
            };
            return View("Views/ErrorPage.cshtml", info);
        }

        #endregion
    }
}
