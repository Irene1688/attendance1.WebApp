using System;
using System.Linq;
using System.Threading.Tasks;
using attendance1.Web.Models;
using attendance1.Web.Services;

namespace attendance1.Web.Helpers
{
    public class MenuHelper
    {
        private readonly AccountService _accountService;
        private readonly ClassService _classService;

        public MenuHelper(AccountService accountService, ClassService classService)
        {
            _accountService = accountService;
            _classService = classService;
        }

        // used to determine what menu will be used
        public async Task<string> GetRoleAsync()
        {
            var role = _accountService.GetCurrentUserRole();
            if (role != null && role != "Student") 
            {
                return role;
            }
            return String.Empty;
        }

        // used by lecturer shared layout, sidemenu-left
        public async Task<bool> HasInactiveClassesAsync()
        {
            var lecturerId = _accountService.GetCurrentLecturerId();
            if (string.IsNullOrEmpty(lecturerId))
            {
                return false;
            }

            var classes = await _classService.GetClassForLecturerAsync(lecturerId);
            if (classes != null)
            {
                return classes.Any(classItem => classItem.IsActive == false);
            }

            return false;
        }
    }
}
