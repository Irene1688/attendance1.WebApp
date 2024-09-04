using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace attendance1.Web.Pages.Admin
{
    [Authorize(Policy = "AdminAuth")]
    public class IndexAdminModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
