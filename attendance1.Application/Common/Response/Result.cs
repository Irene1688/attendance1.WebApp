using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace attendance1.Application.Common.Response
{
    //public class ApiResponse<T>
    //{
    //    public bool IsSuccess { get; set; }
    //    public HttpStatusCode StatusCode { get; set; }
    //    public string Message { get; set; } = string.Empty;
    //    public T? Data { get; set; }
    //}
    public class Result<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public HttpStatusCode StatusCode { get; set; }

        public static Result<T> SuccessResult(T data)
        {
            return new Result<T> { Success = true, Data = data, StatusCode = HttpStatusCode.OK };
        }

        public static Result<T> FailureResult(string errorMessage, HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        {
            return new Result<T> { Success = false, ErrorMessage = errorMessage, StatusCode = statusCode };
        }
    }

}
