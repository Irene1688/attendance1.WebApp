using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Common;

namespace attendance1.Application.Interfaces
{
    public interface IUserService
    {
        Task<Result<bool>> CreateMultipleStudentAccountsAsync(List<CreateAccountRequestDto> requestDto);
        Task<Result<ViewProfileResponseDto>> ViewProfileAsync(DataIdRequestDto requestDto);
        Task<Result<bool>> EditProfileAsync(EditProfileRequestDto requestDto);
        Task<Result<bool>> ChangePasswordAsync(EditPasswordRequestDto requestDto);
    }
}