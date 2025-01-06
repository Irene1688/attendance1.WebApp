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
        #endregion

        #region course CRUD
        Task<int> GetTotalCourseAsync();
        Task<Course> GetCourseDetailsAsync(int courseId);
        Task<int> CreateNewCourseAsync(Course course, CourseSemester semester, List<Tutorial> tutorials, List<EnrolledStudent> students);
        Task<bool> EditCourseAsync(Course course, CourseSemester semester);
        Task<bool> EditCourseWithTutorialsAsync(Course course, CourseSemester semester, List<Tutorial> tutorials);
        Task<bool> DeleteCourseAsync(int courseId);
        Task<List<Course>> GetAllCourseAsync(int pageNumber = 1, int pageSize = 15);
        Task<List<Course>> GetCoursesByLecturerIdAsync(string lectureId);
        Task<List<Course>> GetCoursesByMultipleLecturerIdAsync(List<string> lecturerIds);
        Task<List<Course>> GetEnrollmentCoursesByStudentIdAsync(string studentId);
        Task<List<Course>> GetEnrollmentCoursesByMultipleStudentIdAsync(List<string> studentIds);
        Task<Course> GetCourseDetailsWithStudentsAndTutorialsAsync(int courseId);
        #endregion

        #region tutorial CRUD
        Task<string> GetTutorialNameByTutorialIdAsync(int tutorialId);
        Task<bool> CreateNewTutorialAsync(Tutorial tutorial);
        Task<bool> EditTutorialAsync(Tutorial tutorial);
        Task<bool> DeleteTutorialAsync(int tutorialId);
        #endregion
        
        #region student CRUD    
        Task<bool> AddStudentToClassAsync(int courseId, List<EnrolledStudent> students);
        Task<bool> AddStudentToTutorialAsync(int tutorialId, int courseId, List<string> studentIdList);
        Task<bool> RemoveStudentFromClassAsync(int courseId, List<string> studentIdList);
        Task<bool> RemoveStudentFromTutorialAsync(int tutorialId, int courseId, List<string> studentIdList);
        #endregion
       
    }
}
