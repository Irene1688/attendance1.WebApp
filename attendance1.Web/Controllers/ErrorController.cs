using Microsoft.AspNetCore.Mvc;
using attendance1.Web.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Razor;
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
    public class ErrorController: Controller
    {
        public ErrorController()
        {
            
        }

        [HttpGet]
        public IActionResult AccessDenied()
        {
            //return StatusCode(403);
            var info = new
            {
                StatusCode = "403",
                Message = "Access Not Granted",
                HasStatusCodeReExecuteFeature = false,
                HasException = false
            };
            return View("Views/ErrorPage.cshtml", info);
        }

        [HttpGet]
        /// <summary>
        /// for using this method:
        /// always return StatusCode();
        /// or using throw new Exception();
        /// example: return StatusCode(StatusCodes.Status400BadRequest);
        /// example: throw new Exception("Some data lost, please try again.");
        /// </summary>
        public IActionResult ErrorHandler(HttpStatusCode statusCode)
        {
            //Get status Code Message
            string status = Enum.GetName(typeof(HttpStatusCode), statusCode) ?? "Internal Server Error";


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
    }
}
