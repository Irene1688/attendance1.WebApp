using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using attendance1.Application.Extensions;
using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Enum;

namespace attendance1.Infrastructure.Persistence.Repositories
{
    public class CourseRepository : BaseRepository, ICourseRepository
    {
        //private readonly ApplicationDbContext _database;

        public CourseRepository(ILogger<CourseRepository> logger, 
            IDbContextFactory<ApplicationDbContext> contextFactory, 
            LogContext logContext)
            : base(logger, contextFactory, logContext)
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

        public async Task<bool> HasLecturerPermittedToAccessCourseAsync(string lecturerId, int userId, int courseId)
        {
            var isPermitted = await _database.Courses
                .AnyAsync(c => 
                    c.UserId == userId && 
                    c.LecturerId == lecturerId && 
                    c.CourseId == courseId && 
                    c.IsDeleted == false);
            return isPermitted;
        }
        #endregion

        #region course CRUD
        public async Task<int> GetTotalCourseAsync(string searchTerm = "", Dictionary<string, object>? filters = null)
        {
            var query = _database.Courses
                .Where(c => c.IsDeleted == false)
                .AsNoTracking();

            // 搜索
            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    EF.Functions.Collate(p.CourseName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.CourseCode ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.CourseSession ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.Programme.ProgrammeName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(p.User.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            // 筛选
            if (filters != null)
            {
                // 按项目筛选
                if (filters.TryGetValue("programmeId", out var programmeIdObj) && 
                    programmeIdObj is int programmeId && 
                    programmeId > 0)
                {
                    query = query.Where(c => c.ProgrammeId == programmeId);
                }

                // 按讲师筛选
                if (filters.TryGetValue("lecturerUserId", out var lecturerIdObj) && 
                    lecturerIdObj is int userId && 
                    userId > 0)
                {
                    query = query.Where(c => c.UserId == userId);
                }

                // 按状态筛选
                if (filters.TryGetValue("status", out var statusObj) && 
                    statusObj is string status && 
                    !string.IsNullOrEmpty(status))
                {
                    var today = DateOnly.FromDateTime(DateTime.Now);
                    var isActive = status.ToUpper() == "ACTIVE";
                    query = isActive
                        ? query.Where(c => c.Semester.EndWeek > today)
                        : query.Where(c => c.Semester.EndWeek <= today);
                }

                // 按学期筛选
                if (filters.TryGetValue("session", out var sessionObj) && 
                    sessionObj is string session && 
                    !string.IsNullOrEmpty(session))
                {
                    query = query.Where(c => c.CourseSession == session);
                }
            }

            return await query.CountAsync();
        }

        public async Task<List<Course>> GetActiveCourseSelectionByLecturerIdAsync(string lecturerId)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Where(c => 
                    c.LecturerId == lecturerId && 
                    c.IsDeleted == false &&
                    c.Semester.EndWeek >= DateOnly.FromDateTime(DateTime.Now))
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<Course> GetCourseDetailsAsync(int courseId)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Where(c => c.CourseId == courseId && c.IsDeleted == false)
                .Include(c => c.Programme)
                .Include(c => c.User)
                .Include(c => c.Semester)
                .Include(c => c.Tutorials)
                .Include(c => c.EnrolledStudents)
                .AsNoTracking()
                .FirstOrDefaultAsync());
        }

        public async Task<int> CreateNewCourseAsync(Course course, CourseSemester semester, List<Tutorial> tutorials)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var lectureId = await _database.UserDetails
                    .Where(u => 
                        u.UserId == course.UserId &&
                        u.AccRole == AccRoleEnum.Lecturer.ToString() &&
                        u.IsDeleted == false)
                    .Select(u => u.LecturerId)
                    .FirstOrDefaultAsync();

                if (lectureId == null)
                    throw new KeyNotFoundException("Lecturer not found");

                await _database.CourseSemesters.AddAsync(semester);
                await _database.SaveChangesAsync();

                course.SemesterId = semester.SemesterId;
                course.LecturerId = lectureId;
                await _database.Courses.AddAsync(course);
                await _database.SaveChangesAsync();
                
                tutorials.ForEach(t => t.CourseId = course.CourseId);
                await _database.Tutorials.AddRangeAsync(tutorials);
                await _database.SaveChangesAsync();

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
                    .Where(s => 
                        s.SemesterId == courseToEdit.SemesterId &&
                        s.IsDeleted == false)
                    .FirstOrDefaultAsync();

                if (semesterToEdit == null)
                    throw new Exception("Start date or end date not found");

                semesterToEdit.StartWeek = semester.StartWeek;
                semesterToEdit.EndWeek = semester.EndWeek;
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> EditCourseTutorialsAsync(int courseId, List<Tutorial> tutorials)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                // var isCourseEdited = await EditCourseAsync(course, semester);
                // if (!isCourseEdited)
                //     throw new Exception("Failed to edit course");

                var tutorialsToEdit = await _database.Tutorials
                    .Where(t => t.CourseId == courseId 
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
                    .FirstOrDefaultAsync();
                    // .Include(c => c.EnrolledStudents)
                    // .Include(c => c.Tutorials)
                    

                if (course == null)
                    throw new Exception("Class not found");

                course.IsDeleted = true;
                course.Semester.IsDeleted = true;
                // foreach (var tutorial in course.Tutorials)
                // {
                //     tutorial.IsDeleted = true;
                // }
                // foreach (var student in course.EnrolledStudents)
                // {
                //     student.IsDeleted = true;
                // }
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> MultipleDeleteCourseAsync(List<int> courseIds)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var coursesToDelete = await _database.Courses
                    .Where(c => 
                        courseIds.Contains(c.CourseId) && 
                        c.IsDeleted == false)
                    .Include(c => c.Semester)
                    .ToListAsync();

                foreach (var course in coursesToDelete)
                {
                    course.IsDeleted = true;
                    course.Semester.IsDeleted = true;
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<List<Course>> GetAllCourseAsync(
            int pageNumber, 
            int pageSize, 
            string searchTerm = "", 
            string? orderBy = null,
            bool isAscending = true,
            Dictionary<string, object>? filters = null)
        {
            try 
            {
                var query = _database.Courses
                    .Include(c => c.Programme)
                    .Include(c => c.Semester)
                    .Include(c => c.Tutorials)
                    .Include(c => c.EnrolledStudents)
                    .Include(c => c.User)
                    .Where(c => c.IsDeleted == false);

                // 搜索
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    query = query.Where(p =>
                        EF.Functions.Collate(p.CourseName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                        EF.Functions.Collate(p.CourseCode ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                        EF.Functions.Collate(p.CourseSession ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                        EF.Functions.Collate(p.Programme.ProgrammeName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                        EF.Functions.Collate(p.User.UserName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
                }

                // 筛选
                if (filters != null)
                {
                    // 按项目筛选
                    if (filters.TryGetValue("programmeId", out var programmeIdObj) && 
                        programmeIdObj is int programmeId && 
                        programmeId > 0)
                    {
                        query = query.Where(c => c.ProgrammeId == programmeId);
                    }

                    // 按讲师筛选
                    if (filters.TryGetValue("lecturerUserId", out var lecturerIdObj) && 
                        lecturerIdObj is int userId && 
                        userId > 0)
                    {
                        query = query.Where(c => c.UserId == userId);
                    }

                    // 按状态筛选
                    if (filters.TryGetValue("status", out var statusObj) && 
                        statusObj is string status && 
                        !string.IsNullOrEmpty(status))
                    {
                        var today = DateOnly.FromDateTime(DateTime.Now);
                        var isActive = status.ToUpper() == "ACTIVE";
                        query = isActive
                            ? query.Where(c => c.Semester.EndWeek > today)
                            : query.Where(c => c.Semester.EndWeek <= today);
                    }

                    // 按学期筛选
                    if (filters.TryGetValue("session", out var sessionObj) && 
                        sessionObj is string session && 
                        !string.IsNullOrEmpty(session))
                    {
                        query = query.Where(c => c.CourseSession == session);
                    }
                }

                // 排序
                query = (orderBy?.ToLower()) switch
                {
                    "coursecode" => isAscending 
                        ? query.OrderBy(c => c.CourseCode) 
                        : query.OrderByDescending(c => c.CourseCode),
                    "coursename" => isAscending 
                        ? query.OrderBy(c => c.CourseName) 
                        : query.OrderByDescending(c => c.CourseName),
                    "programmename" => isAscending 
                        ? query.OrderBy(c => c.Programme.ProgrammeName) 
                        : query.OrderByDescending(c => c.Programme.ProgrammeName),
                    "coursesession" => isAscending 
                        ? query.OrderBy(c => c.CourseSession) 
                        : query.OrderByDescending(c => c.CourseSession),
                    "status" => isAscending 
                        ? query.OrderBy(c => c.Semester.EndWeek) 
                        : query.OrderByDescending(c => c.Semester.EndWeek),
                    _ => query.OrderBy(c => c.CourseCode)
                };

                // 分页
                return await ExecuteGetAsync(async () => await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync());
                // return await query
                //     .Skip((pageNumber - 1) * pageSize)
                //     .Take(pageSize)
                //     .AsNoTracking()
                //     .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllCourseAsync: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<int> GetProgrammeIdOfCourseAsync(int courseId)
        {
            return await _database.Courses
                .Where(c => 
                    c.CourseId == courseId && 
                    c.IsDeleted == false)
                .Select(c => c.ProgrammeId)
                .FirstOrDefaultAsync();
        }

        public async Task<Course> GetCourseDetailsWithStudentsAndTutorialsAsync(int courseId)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Where(c => c.CourseId == courseId && c.IsDeleted == false)
                .Include(c => c.Programme)
                .Include(c => c.Semester)
                .Include(c => c.EnrolledStudents)
                .Include(c => c.Tutorials)
                .AsNoTracking()
                .FirstOrDefaultAsync());
        }

        public async Task<List<Course>> GetCoursesByLecturerIdAsync(string lectureId)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Where(c => 
                    c.LecturerId == lectureId && 
                    c.IsDeleted == false)
                .Include(c => c.Tutorials)
                .Include(c => c.Semester)
                .AsNoTracking()
                .ToListAsync());
        }
        
        public async Task<List<Course>> GetCoursesByMultipleLecturerIdAsync(List<string> lecturerIds)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Where(c => lecturerIds.Contains(c.LecturerId) 
                    && c.IsDeleted == false)
                .Include(c => c.Semester)
                .Include(c => c.EnrolledStudents)
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<List<Course>> GetEnrollmentCoursesByStudentIdAsync(string studentId)
        {
            return await ExecuteGetAsync(async () => await _database.EnrolledStudents
                .Where(s => s.StudentId == studentId 
                    && s.IsDeleted == false)
                .Include(s => s.Course)
                .Include(s => s.Course.Semester)
                .Include(s => s.Course.User)
                .Include(s => s.Course.Tutorials)
                .Select(s => s.Course)
                .AsNoTracking()
                .ToListAsync());
        }
        
        public async Task<List<Course>> GetEnrollmentCoursesByMultipleStudentIdAsync(List<string> studentIds)
        {
            return await ExecuteGetAsync(async () => await _database.Courses
                .Include(c => c.EnrolledStudents)
                .Include(c => c.Semester)
                .Include(c => c.Tutorials)
                .Where(c => c.EnrolledStudents.Any(s => studentIds.Contains(s.StudentId)) 
                    && c.IsDeleted == false)
                .AsNoTracking()
                .ToListAsync());
        }
        #endregion
        
        #region tutorial CRUD
        public async Task<List<Tutorial>> GetCourseTutorialsAsync(int courseId)
        {
            return await ExecuteGetAsync(async () =>
            {
                return await _database.Tutorials
                    .Where(t => t.CourseId == courseId && t.IsDeleted == false)
                    .OrderBy(t => t.TutorialName)
                    .AsNoTracking()
                    .ToListAsync();
            });
        }

        public async Task<string> GetTutorialNameByTutorialIdAsync(int tutorialId)
        {
            return await ExecuteGetAsync(async () =>
            {
                if (tutorialId <= 0)
                    return "No tutorial session.";

                var tutorialName = await _database.Tutorials
                    .Where(t => t.TutorialId == tutorialId 
                        && t.IsDeleted == false)
                    .Select(t => t.TutorialName)
                    .FirstOrDefaultAsync();
                return tutorialName;
            });
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
        public async Task<int> GetTotalEnrolledStudentsAsync(int courseId, string searchTerm = "")
        {
            var query = _database.EnrolledStudents
                .Include(s => s.Tutorial)
                .Where(s => 
                    s.CourseId == courseId && 
                    s.IsDeleted == false)
                .AsNoTracking();

            // 搜索
            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(s =>
                    EF.Functions.Collate(s.StudentId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(s.StudentName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(s.Tutorial.TutorialName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }
    
            return await query.CountAsync();
        }

        public async Task<List<EnrolledStudent>> GetEnrolledStudentsAsync(
            int courseId, 
            int pageNumber = 1, 
            int pageSize = 15,
            string searchTerm = "", 
            string orderBy = "studentid", 
            bool isAscending = true)
        {
            var query = _database.EnrolledStudents
                .Include(s => s.Tutorial)
                .Where(s => 
                    s.CourseId == courseId && 
                    s.IsDeleted == false);

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(s =>
                    EF.Functions.Collate(s.StudentId ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(s.StudentName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm) ||
                    EF.Functions.Collate(s.Tutorial.TutorialName ?? string.Empty, "SQL_Latin1_General_CP1_CI_AS").Contains(searchTerm));
            }

            query = (orderBy?.ToLower()) switch
            {
                "studentid" => isAscending 
                    ? query.OrderBy(c => c.StudentId) 
                    : query.OrderByDescending(c => c.StudentId),
                "studentname" => isAscending 
                    ? query.OrderBy(c => c.StudentName) 
                    : query.OrderByDescending(c => c.StudentName),
                "tutorialname" => isAscending 
                    ? query.OrderBy(c => c.Tutorial.TutorialName) 
                    : query.OrderByDescending(c => c.Tutorial.TutorialName),
                _ => query.OrderBy(c => c.StudentId)
            };

            return await ExecuteGetAsync(async () => await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync());
        }

        public async Task<List<EnrolledStudent>> GetEnrolledStudentsAsync(int courseId)
        {
            return await ExecuteGetAsync(async () =>
            {
                return await _database.EnrolledStudents
                    .Where(s => 
                        s.CourseId == courseId && 
                        s.IsDeleted == false)
                    .Include(s => s.Tutorial)
                    .AsNoTracking()
                    .ToListAsync();
            });
        }

        public async Task<List<UserDetail>> GetAvailableStudentsAsync(int programmeId, int courseId)
        {
            return await ExecuteGetAsync(async () => 
            {
                var studentsInProgramme = await _database.UserDetails
                    .Where(u => 
                        u.ProgrammeId == programmeId && 
                        u.AccRole == AccRoleEnum.Student.ToString() &&
                        u.IsDeleted == false)
                    .AsNoTracking()
                    .ToListAsync();

                var studentsInCourse = await _database.EnrolledStudents
                    .Where(s => 
                        s.CourseId == courseId && 
                        s.IsDeleted == false)
                    .AsNoTracking()
                    .ToListAsync();

                var availableStudents = studentsInProgramme
                    .Where(s => 
                        !studentsInCourse.Any(sc => sc.StudentId == s.StudentId))
                    .ToList();
                return availableStudents;
            });
        }

        public async Task<bool> AddStudentsToCourseByUserIdAsync(int courseId, int tutorialId, List<int> studentUserIds)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                var students = await _database.UserDetails
                    .Where(u => 
                        studentUserIds.Contains(u.UserId) && 
                        u.IsDeleted == false && 
                        u.AccRole == AccRoleEnum.Student.ToString())
                    .ToListAsync();
                foreach (var student in students)
                {
                    await _database.EnrolledStudents.AddAsync(new EnrolledStudent
                    {
                        CourseId = courseId,
                        TutorialId = tutorialId,
                        StudentId = student.StudentId ?? string.Empty,
                        StudentName = student.UserName ?? string.Empty,
                        IsDeleted = false
                    });
                }
                await _database.SaveChangesAsync();
                return true;
            });
        }   

        public async Task<bool> AddSingleStudentToCourseAsync(EnrolledStudent student)
        {
            return await ExecuteWithTransactionAsync(async () => 
            {
                await _database.EnrolledStudents.AddAsync(student);
                await _database.SaveChangesAsync();
                return true;
            });
        }

        public async Task<bool> AddMultipleStudentsToCourseAsync(List<EnrolledStudent> students)
        {
            return await ExecuteWithTransactionAsync(async () =>
            {
                await _database.EnrolledStudents.AddRangeAsync(students);
                await _database.SaveChangesAsync();
                return true;
            });
        }

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

        #region student fetch tutorial
        public async Task<List<Tutorial>> GetTutorialsByStudentIdAsync(string studentId)
        {
            return await ExecuteGetAsync(async () => 
                await _database.EnrolledStudents
                    .Where(s => 
                        s.StudentId == studentId && 
                        s.IsDeleted == false)
                    .Include(s => s.Tutorial)
                    .Select(s => s.Tutorial)
                    .AsNoTracking()
                    .ToListAsync());
        }
        #endregion
    }
}
