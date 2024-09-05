using attendance1.Web.Services;
using attendance1.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace attendance1.Web.ViewCompoents
{
    public class InactiveClassListLecViewComponent : ViewComponent
    {
        private readonly AccountService _accountService;
        private readonly ClassService _classService;

        public InactiveClassListLecViewComponent(AccountService accountService, ClassService classService)
        {
            _accountService = accountService;
            _classService = classService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var inactiveClasses = new List<ClassMdl>();
            var lecturerId = _accountService.GetCurrentLecturerId();
            //var lecturerId = HttpContext.User.FindFirstValue("LecturerID");
            if (string.IsNullOrEmpty(lecturerId))
            {
                return View("/Views/Shared/Components/Lecturer/ClassListMenu.cshtml", new List<ClassMdl>());
                //return View(new List<ClassMdl>());
            }

            var classes = await _classService.GetClassForLecturerAsync(lecturerId);
            if (classes != null)
            {
                foreach (var classItem in classes)
                {
                    if (classItem.IsActive == false)
                    {
                        inactiveClasses.Add(classItem);
                    }
                }
            }

            return View("/Views/Shared/Components/Lecturer/ClassListMenu.cshtml", inactiveClasses);
        }
    }
}
