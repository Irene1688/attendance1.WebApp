using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Diagnostics;

namespace attendance1.Web.Controllers
{
    public class ErrorController: Controller
    {
        private readonly ILogger<ErrorController> _logger;
        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult AccessDenied()
        {
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
                ExceptionInner = exceptionDetails?.Error.InnerException?.Message
            };

            // log error
            _logger.LogError("An error occurred. Status Code: {StatusCode}. Message: {Message}. Path: {Path}. Exception: {ExceptionMessage}",
                errorDetails.StatusCode,
                errorDetails.Message,
                errorDetails.FullOriginalPath,
                errorDetails.ExceptionMessage);

            if (errorDetails.HasException && exceptionDetails?.Error != null)
            {
                _logger.LogError(exceptionDetails.Error, "Detailed exception information");
            }

            return View("Views/ErrorPage.cshtml", errorDetails);
        }
    }
}
