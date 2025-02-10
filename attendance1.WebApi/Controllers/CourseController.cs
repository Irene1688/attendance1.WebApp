namespace attendance1.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Policy = "AllLoginedUser")]
    public class CourseController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILectureService _lectureService;
        private readonly ICourseService _courseService;
        private readonly ILogger<CourseController> _logger;

        public CourseController(ICourseService courseService, IAdminService adminService, ILectureService lectureService, ILogger<CourseController> logger)
        {
            _courseService = courseService ?? throw new ArgumentNullException(nameof(courseService));
            _adminService = adminService ?? throw new ArgumentNullException(nameof(adminService));
            _lectureService = lectureService ?? throw new ArgumentNullException(nameof(lectureService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        #region Course CRUD
        [HttpPost("createNewCourse")]
        public async Task<ActionResult<int>> CreateNewCourse([FromBody] CreateCourseRequestDto requestDto)
        {
            var result = await _courseService.CreateNewCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getAllCourse")]
        public async Task<ActionResult<PaginatedResult<GetCourseResponseDto>>> GetAllCourse([FromBody] GetCourseRequestDto requestDto)
        {
            var result = await _courseService.GetAllCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getActiveCourseSelectionByLecturerId")]
        public async Task<ActionResult<GetActiveCourseSelectionResponseDto>> GetActiveCourseSelectionByLecturerId([FromBody] DataIdRequestDto requestDto)
        {
            var result = await _courseService.GetActiveCourseSelectionByLecturerIdAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("getActiveCoursesByLecturerId")]
        public async Task<ActionResult<List<GetLecturerClassRequestDto>>> GetCoursesByLecturerId([FromBody] DataIdRequestDto requestDto)
        {
            var classes = await _courseService.GetActiveClassesOfLecturerAsync(requestDto);
            return StatusCode((int)classes.StatusCode, classes);
        }

        [HttpPost("getCourseDetailsById")]
        public async Task<ActionResult<GetCourseDetailsResponseDto>> GetCourseDetails([FromBody] DataIdRequestDto requestDto)
        {
            var classDetails = await _courseService.GetCourseDetailsAsync(requestDto);
            return StatusCode((int)classDetails.StatusCode, classDetails);
        }
        
        [HttpPost("editCourse")]
        public async Task<ActionResult<bool>> EditCourse([FromBody] EditCourseRequestDto requestDto)
        {
            var result = await _courseService.EditCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("deleteCourse")]
        public async Task<ActionResult<bool>> DeleteCourse([FromBody] DeleteRequestDto requestDto)
        {
            var result = await _courseService.DeleteCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("multipleDeleteCourse")]
        public async Task<ActionResult<bool>> MultipleDeleteCourse([FromBody] List<DeleteRequestDto> requestDto)
        {
            var result = await _courseService.MultipleDeleteCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion

        #region Course Students
        [HttpPost("getEnrolledStudents")]
        public async Task<ActionResult<List<GetEnrolledStudentResponseDto>>> GetEnrolledStudents([FromBody] GetEnrolledStudentRequestDto requestDto)
        {
            var students = await _courseService.GetEnrolledStudentsAsync(requestDto);
            return StatusCode((int)students.StatusCode, students);
        }

        [HttpPost("getAvailableStudents")]
        public async Task<ActionResult<List<GetAvailableStudentResponseDto>>> GetAvailableStudents([FromBody] GetAvailableStudentRequestDto requestDto)
        {
            var students = await _courseService.GetAvailableStudentsAsync(requestDto);
            return StatusCode((int)students.StatusCode, students);
        }

        [HttpPost("addStudentsToCourseAndTutorial")]
        public async Task<ActionResult<bool>> AddStudentsToCourseAndTutorial([FromBody] AddStudentsToCourseRequestDto requestDto)
        {
            var result = await _courseService.AddStudentsToCourseAndTutorialAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("addSingleStudentToCourse")]
        public async Task<ActionResult<bool>> AddSingleStudentToCourse([FromBody] AddStudentToCourseWithoutUserIdRequestDto requestDto)
        {
            var result = await _courseService.AddSingleStudentToCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("addStudentsByCsvToCourse")]
        public async Task<ActionResult<bool>> AddStudentsByCsvToCourse([FromForm] int courseId, [FromForm] IFormFile file, [FromForm] bool defaultAttendance)
        {
            var result = await _courseService.AddStudentsByCsvToCourseAsync(courseId, file, defaultAttendance);
            return StatusCode((int)result.StatusCode, result);
        }

        [HttpPost("removeStudentFromCourse")]
        public async Task<ActionResult<bool>> RemoveStudentFromClass([FromBody] RemoveStudentFromCourseRequestDto requestDto)
        {
            var result = await _courseService.RemoveStudentFromCourseAsync(requestDto);
            return StatusCode((int)result.StatusCode, result);
        }
        #endregion

        #region Student fetch Course
        [HttpPost("getEnrolledCoursesSelectionByStudentId")]
        public async Task<ActionResult<List<GetStudentEnrolledCourseSelectionResponseDto>>> GetEnrolledCoursesSelectionByStudentId([FromBody] DataIdRequestDto requestDto)
        {
            var courses = await _courseService.GetEnrolledCourseSelectionByStudentIdAsync(requestDto);
            return StatusCode((int)courses.StatusCode, courses);
        }

        [HttpPost("getEnrolledCourseDetailsWithEnrolledTutorial")]
        public async Task<ActionResult<GetEnrolledCourseDetailWithEnrolledTutorialResponseDto>> GetEnrolledCourseDetailsWithEnrolledTutorial([FromBody] DataIdRequestDto requestDto)
        {
            var courseDetails = await _courseService.GetCourseDetailsWithEnrolledTutorialAsync(requestDto);
            return StatusCode((int)courseDetails.StatusCode, courseDetails);
        }
        #endregion

        

    }
}