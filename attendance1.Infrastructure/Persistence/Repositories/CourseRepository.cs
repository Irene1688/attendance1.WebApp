using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Application.DTOs.Common;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class CourseRepository : BaseRepository, ICourseRepository
    {
        //private readonly ApplicationDbContext _database;

        public CourseRepository(ILogger<CourseRepository> logger, ApplicationDbContext database)
            : base(logger, database)
        {
            //_database = database ?? throw new ArgumentNullException(nameof(database));
        }

        #region validate
        public async Task<bool> HasCourseExistedAsync(int courseId)
        {
            var isCourseExisted = await _database.Courses
                .AnyAsync(c => c.CourseId == courseId && c.IsDeleted == false);
            return isCourseExisted;
        }

        public async Task<bool> HasTutorialExistedAsync(int tutorialId, int courseId)
        {
            var isTutorialExisted = await _database.Tutorials
                .AnyAsync(t => t.TutorialId == tutorialId 
                && t.CourseId == courseId 
                && t.IsDeleted == false);
            return isTutorialExisted;
        }

        public async Task<bool> HasTutorialExistedAsync(int tutorialId)
        {
            var isTutorialExisted = await _database.Tutorials
                .AnyAsync(t => t.TutorialId == tutorialId 
                && t.IsDeleted == false);
            return isTutorialExisted;
        }
        
        public async Task<bool> HasStudentEnrolledInCourseAsync(string studentId, int courseId)
        {
            var isStudentEnrolled = await _database.EnrolledStudents
                .AnyAsync(s => s.StudentId == studentId 
                    && s.CourseId == courseId 
                    && s.IsDeleted == false);
            return isStudentEnrolled;
        }

        public async Task<bool> HasStudentEnrolledInTutorialAsync(string studentId, int courseId, int tutorialId)
        {
            var isStudentEnrolled = await _database.EnrolledStudents
                .AnyAsync(s => s.StudentId == studentId 
                    && s.CourseId == courseId 
                    && s.TutorialId == tutorialId 
                    && s.IsDeleted == false);
            return isStudentEnrolled;
        }
        #endregion

        #region course CRUD
        public async Task<Course> GetCourseDetailsAsync(int courseId)
        {
            var course = await _database.Courses
                .Where(c => c.CourseId == courseId && c.IsDeleted == false)
                .Include(c => c.Programme)
                .Include(c => c.Semester)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (course == null)
                throw new Exception("Class not found");

            return course;
        }

        public async Task<int> CreateNewCourseAsync(Course course, CourseSemester semester, List<Tutorial> tutorials, List<EnrolledStudent> students)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.CourseSemesters.AddAsync(semester);
                await _database.SaveChangesAsync();

                course.SemesterId = semester.SemesterId;
                await _database.Courses.AddAsync(course);
                await _database.SaveChangesAsync();
                
                tutorials.ForEach(t => t.CourseId = course.CourseId);
                await _database.Tutorials.AddRangeAsync(tutorials);
                await _database.SaveChangesAsync();

                if (students.Count > 0)
                {
                    students.ForEach(s => s.CourseId = course.CourseId);
                    await _database.EnrolledStudents.AddRangeAsync(students);
                    await _database.SaveChangesAsync();
                }

                return course.CourseId;
            });
        }

        public async Task<bool> EditCourseAsync(Course course, CourseSemester semester)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var courseToEdit = await _database.Courses
                    .Where(c => c.CourseId == course.CourseId 
                        && c.IsDeleted == false)
                    .FirstOrDefaultAsync();

                if (courseToEdit == null)
                    throw new Exception("Class not found");

                courseToEdit.CourseCode = course.CourseCode;
                courseToEdit.CourseName = course.CourseName;
                courseToEdit.CourseSession = course.CourseSession;
                courseToEdit.ClassDay = course.ClassDay;
                courseToEdit.ProgrammeId = course.ProgrammeId;
                courseToEdit.LecturerId = course.LecturerId;
                await _database.SaveChangesAsync();

                var semesterToEdit = await _database.CourseSemesters
                    .Where(s => s.SemesterId == semester.SemesterId 
                        && s.IsDeleted == false)
                    .FirstOrDefaultAsync();

                if (semesterToEdit == null)
                    throw new Exception("Start date or end date not found");

                semesterToEdit.StartWeek = semester.StartWeek;
                semesterToEdit.EndWeek = semester.EndWeek;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> EditCourseWithTutorialsAsync(Course course, CourseSemester semester, List<Tutorial> tutorials)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var isCourseEdited = await EditCourseAsync(course, semester);
                if (!isCourseEdited)
                    throw new Exception("Failed to edit course");

                var tutorialsToEdit = await _database.Tutorials
                    .Where(t => t.CourseId == course.CourseId 
                        && t.IsDeleted == false)
                    .ToListAsync();

                if (tutorialsToEdit == null)
                    throw new Exception("Tutorial not found");

                tutorialsToEdit.ForEach(tutorial =>
                {
                    var correspondingInputTutorial = tutorials.FirstOrDefault(t => t.TutorialId == tutorial.TutorialId);
                    if (correspondingInputTutorial != null)
                    {
                        tutorial.TutorialName = correspondingInputTutorial.TutorialName;
                        tutorial.TutorialClassDay = correspondingInputTutorial.TutorialClassDay;
                    }
                });
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> DeleteCourseAsync(int courseId)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var course = await _database.Courses
                    .Where(c => c.CourseId == courseId && c.IsDeleted == false)
                    .Include(c => c.Semester)
                    .Include(c => c.EnrolledStudents)
                    .Include(c => c.Tutorials)
                    .FirstOrDefaultAsync();

                if (course == null)
                    throw new Exception("Class not found");

                course.IsDeleted = true;
                course.Semester.IsDeleted = true;
                foreach (var tutorial in course.Tutorials)
                {
                    tutorial.IsDeleted = true;
                }
                foreach (var student in course.EnrolledStudents)
                {
                    student.IsDeleted = true;
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<List<Course>> GetAllCourseAsync(int pageNumber = 1, int pageSize = 15)
        {
            var courses = await _database.Courses
                .Where(c => c.IsDeleted == false)
                .OrderBy(c => c.CourseName)
                .Include(c => c.Programme)
                .Include(c => c.Semester.EndWeek)
                .Include(c => c.Tutorials)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();
            return courses;
        }

        public async Task<Course> GetCourseDetailsWithStudentsAndTutorialsAsync(int courseId)
        {
            var course = await _database.Courses
                .Where(c => c.CourseId == courseId && c.IsDeleted == false)
                .Include(c => c.Programme)
                .Include(c => c.Semester)
                .Include(c => c.EnrolledStudents)
                .Include(c => c.Tutorials)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (course == null)
                throw new Exception("Class not found");

            return course;
        }

        public async Task<List<Course>> GetCoursesByLecturerIdAsync(string lectureId)
        {
            var courses = await _database.Courses
                .Where(c => c.LecturerId == lectureId && c.IsDeleted == false)
                .AsNoTracking()
                .ToListAsync();
            return courses;
        }
        
        public async Task<List<Course>> GetCoursesByMultipleLecturerIdAsync(List<string> lecturerIds)
        {
            var courses = await _database.Courses
                .Where(c => lecturerIds.Contains(c.LecturerId) 
                    && c.IsDeleted == false)
                .Include(c => c.Semester.EndWeek)
                .Include(c => c.EnrolledStudents.Count)
                .AsNoTracking()
                .ToListAsync();
            return courses;
        }

        public async Task<List<Course>> GetEnrollmentCoursesByStudentIdAsync(string studentId)
        {
            var courses = await _database.EnrolledStudents
                .Where(s => s.StudentId == studentId 
                    && s.IsDeleted == false)
                .Select(s => s.Course)
                .AsNoTracking()
                .ToListAsync();
            return courses;
        }
        
        public async Task<List<Course>> GetEnrollmentCoursesByMultipleStudentIdAsync(List<string> studentIds)
        {
            var courses = await _database.Courses
                .Include(c => c.EnrolledStudents)
                .Include(c => c.Semester.EndWeek)
                .Include(c => c.Tutorials)
                .Where(c => c.EnrolledStudents.Any(s => studentIds.Contains(s.StudentId)) 
                    && c.IsDeleted == false)
                .AsNoTracking()
                .ToListAsync();
            return courses;
        }
        #endregion
        
        #region tutorial CRUD
        public async Task<string> GetTutorialNameByTutorialIdAsync(int tutorialId)
        {
            var tutorialName = await _database.Tutorials
                .Where(t => t.TutorialId == tutorialId 
                    && t.IsDeleted == false)
                .Select(t => t.TutorialName)
                .FirstOrDefaultAsync();

            if (tutorialName == null)
                throw new Exception("Tutorial not found");

            return tutorialName;
        }
        
        public async Task<bool> CreateNewTutorialAsync(Tutorial tutorial)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.Tutorials.AddAsync(tutorial);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> EditTutorialAsync(Tutorial tutorial)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var tutorialToEdit = await _database.Tutorials
                    .FirstOrDefaultAsync(t => t.TutorialId == tutorial.TutorialId 
                        && t.IsDeleted == false);

                if (tutorialToEdit == null)
                    throw new Exception("Tutorial not found");

                tutorialToEdit.TutorialName = tutorial.TutorialName;
                tutorialToEdit.TutorialClassDay = tutorial.TutorialClassDay;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> DeleteTutorialAsync(int tutorialId)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var tutorial = await _database.Tutorials
                    .Where(t => t.TutorialId == tutorialId && t.IsDeleted == false)
                    .FirstOrDefaultAsync();

                if (tutorial == null)
                    throw new Exception("Tutorial not found");

                tutorial.IsDeleted = true;
                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion

        #region student CRUD
        public async Task<bool> AddStudentToClassAsync(int courseId, List<EnrolledStudent> students)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.EnrolledStudents.AddRangeAsync(students);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> AddStudentToTutorialAsync(int tutorialId, int courseId, List<string> studentIdList)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var students = await _database.EnrolledStudents
                    .Where(s => s.CourseId == courseId && 
                        !studentIdList.Any(studentId => studentId.Equals(s.StudentId, StringComparison.OrdinalIgnoreCase)))
                    .ToListAsync();

                foreach (var student in students)
                {
                    student.TutorialId = tutorialId;
                }

                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> RemoveStudentFromClassAsync(int courseId, List<string> studentIdList)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var students = await _database.EnrolledStudents
                    .Where(s => s.CourseId == courseId 
                        && studentIdList.Contains(s.StudentId))
                    .ToListAsync();
                foreach (var student in students)
                {
                    student.IsDeleted = true;
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> RemoveStudentFromTutorialAsync(int tutorialId, int courseId, List<string> studentIdList)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var students = await _database.EnrolledStudents
                    .Where(s => s.CourseId == courseId 
                        && s.TutorialId == tutorialId 
                        && studentIdList.Contains(s.StudentId))
                    .ToListAsync();
                foreach (var student in students)
                {
                    student.TutorialId = 0;
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }
        #endregion
    }
}
