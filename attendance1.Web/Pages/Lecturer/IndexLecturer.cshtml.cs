using attendance1.Web.Models;
using attendance1.Web.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace attendance1.Web.Pages.Lecturer
{
    [Authorize(Policy = "LecturerAuth")]
    public class IndexLecturerModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
