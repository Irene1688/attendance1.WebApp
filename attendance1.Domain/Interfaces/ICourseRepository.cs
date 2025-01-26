using attendance1.Domain.Entities;

namespace attendance1.Domain.Interfaces
{
    public interface ICourseRepository
    {
        #region validate
        Task<bool> HasCourseExistedAsync(int courseId);
        Task<bool> HasTutorialExistedAsync(int tutorialId, int courseId);
        Task<bool> HasTutorialExistedAsync(int tutorialId);
        Task<bool> HasStudentEnrolledInCourseAsync(string studentId, int courseId);
        Task<bool> HasStudentEnrolledInTutorialAsync(string studentId,int courseId, int tutorialId);
        Task<bool> HasLecturerPermittedToAccessCourseAsync(string lecturerId, int userId, int courseId);
        #endregion

        #region course CRUD
        Task<int> GetTotalCourseAsync(string searchTerm = "", Dictionary<string, object>? filters = null);
        Task<List<Course>> GetActiveCourseSelectionByLecturerIdAsync(string lecturerId);
        Task<Course> GetCourseDetailsAsync(int courseId);
        Task<int> GetProgrammeIdOfCourseAsync(int courseId);
        Task<int> CreateNewCourseAsync(Course course, CourseSemester semester, List<Tutorial> tutorials);
        Task<bool> EditCourseAsync(Course course, CourseSemester semester);
        Task<bool> EditCourseTutorialsAsync(int courseId, List<Tutorial> tutorials);
        Task<bool> DeleteCourseAsync(int courseId);
        Task<bool> MultipleDeleteCourseAsync(List<int> courseIds);
        Task<List<Course>> GetAllCourseAsync(
            int pageNumber = 1, 
            int pageSize = 15, 
            string searchTerm = "", 
            string orderBy = "coursename", 
            bool isAscending = true, 
            Dictionary<string, object>? filters = null);
        Task<List<Course>> GetCoursesByLecturerIdAsync(string lectureId);
        Task<List<Course>> GetCoursesByMultipleLecturerIdAsync(List<string> lecturerIds);
        Task<List<Course>> GetEnrollmentCoursesByStudentIdAsync(string studentId);
        Task<List<Course>> GetEnrollmentCoursesByMultipleStudentIdAsync(List<string> studentIds);
        Task<Course> GetCourseDetailsWithStudentsAndTutorialsAsync(int courseId);
        #endregion

        #region tutorial CRUD
        Task<List<Tutorial>> GetCourseTutorialsAsync(int courseId);
        Task<string> GetTutorialNameByTutorialIdAsync(int tutorialId);
        Task<bool> CreateNewTutorialAsync(Tutorial tutorial);
        Task<bool> EditTutorialAsync(Tutorial tutorial);
        Task<bool> DeleteTutorialAsync(int tutorialId);
        #endregion
        
        #region student CRUD    
        Task<int> GetTotalEnrolledStudentsAsync(int courseId, string searchTerm = "");
        Task<List<EnrolledStudent>> GetEnrolledStudentsAsync(
            int courseId, 
            int pageNumber = 1, 
            int pageSize = 15,
            string searchTerm = "", 
            string orderBy = "studentid", 
            bool isAscending = true);
        Task<List<EnrolledStudent>> GetEnrolledStudentsAsync(int courseId);
        Task<List<UserDetail>> GetAvailableStudentsAsync(int programmeId, int courseId);
        Task<bool> AddStudentsToCourseByUserIdAsync(int courseId, int tutorialId, List<int> studentUserIds);
        Task<bool> AddSingleStudentToCourseAsync(EnrolledStudent student);
        Task<bool> AddMultipleStudentsToCourseAsync(List<EnrolledStudent> students);
        Task<bool> AddStudentToClassAsync(int courseId, List<EnrolledStudent> students);
        Task<bool> AddStudentToTutorialAsync(int tutorialId, int courseId, List<string> studentIdList);
        Task<bool> RemoveStudentFromClassAsync(int courseId, List<string> studentIdList);
        Task<bool> RemoveStudentFromTutorialAsync(int tutorialId, int courseId, List<string> studentIdList);
        #endregion
       
        
        
        
    }
}
