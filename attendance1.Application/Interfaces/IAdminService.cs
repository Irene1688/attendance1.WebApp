using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Admin;
using attendance1.Application.DTOs.Common;

namespace attendance1.Application.Interfaces
{
    public interface IAdminService
    {
        Task<Result<AllTotalCountResponseDto>> GetAllTotalCountAsync();
        #region programme CRUD
        Task<Result<bool>> CreateNewProgrammeAsync(CreateProgrammeRequestDto requestDto);
        Task<Result<PaginatedResult<GetProgrammeResponseDto>>> GetAllProgrammeAsync(PaginatedRequestDto requestDto);
        Task<Result<bool>> EditProgrammeAsync(EditProgrammeRequestDto requestDto);
        Task<Result<bool>> DeleteProgrammeAsync(DeleteRequestDto requestDto);
        #endregion

        #region User Create & Edit (include Lecturer and Student)
        Task<Result<bool>> CreateNewUserAsync(CreateAccountRequestDto requestDto);
        Task<Result<bool>> EditUserAsync(EditAccountRequestDto requestDto);
        Task<Result<bool>> DeleteUserAsync(DeleteRequestDto requestDto);
        #endregion

        #region View Lecturer & Student
        Task<Result<PaginatedResult<GetLecturerResponseDto>>> GetAllLecturerWithClassAsync(PaginatedRequestDto requestDto);
        Task<Result<PaginatedResult<GetStudentResponseDto>>> GetAllStudentWithClassAsync(PaginatedRequestDto requestDto);
        #endregion

        #region Class CRUD
        Task<Result<bool>> CreateNewCourseAsync(CreateCourseRequestDto requestDto);
        Task<Result<PaginatedResult<GetCourseResponseDto>>> GetAllCourseAsync(PaginatedRequestDto requestDto);
        Task<Result<bool>> EditCourseAsync(EditCourseRequestDto requestDto);
        Task<Result<bool>> DeleteCourseAsync(DeleteRequestDto requestDto);
        #endregion

        
    }
}