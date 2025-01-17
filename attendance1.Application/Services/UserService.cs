using attendance1.Application.Common.Enum;
using attendance1.Application.Common.Logging;
using attendance1.Application.Common.Response;
using attendance1.Application.DTOs.Common;
using attendance1.Application.Interfaces;
using attendance1.Domain.Entities;
using attendance1.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net;

namespace attendance1.Application.Services
{
    public class UserService : BaseService, IUserService
    {
        private readonly IValidateService _validateService;
        private readonly IUserRepository _userRepository;

        public UserService(ILogger<UserService> logger, IValidateService validateService, IUserRepository userRepository, LogContext logContext) 
            : base(logger, logContext)
        {
            _validateService = validateService ?? throw new ArgumentNullException(nameof(validateService));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        }

        public async Task<Result<bool>> CreateMultipleStudentAccountsAsync(List<CreateAccountRequestDto> requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    var existedStudentIds = await _userRepository.GetAllExistedStudentIdAsync();
                    
                    var newStudents = requestDto.Where(student => !existedStudentIds.Contains(student.CampusId))
                        .ToList();
                    var accountToCreate = newStudents.Select(student => new UserDetail
                    {
                        StudentId = student.CampusId,
                        UserName = student.Name,
                        Email = student.Email,
                        UserPassword = BCrypt.Net.BCrypt.HashPassword(student.Password),
                        AccRole = AccRoleEnum.Student.ToString()
                    }).ToList();

                    return await _userRepository.CreateMultipleUserAsync(accountToCreate);
                },
                "Failed to create student account"
            );
        }

        public async Task<Result<ViewProfileResponseDto>> ViewProfileAsync(DataIdRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateUserAsync(requestDto.IdInInteger ?? 0))
                        throw new KeyNotFoundException("User not found");

                    var user = await _userRepository.GetUserByCampusIdAsync(requestDto.IdInInteger ?? 0, requestDto.IdInString ?? string.Empty);
                    return new ViewProfileResponseDto
                    {
                        Name = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        CampusId = user.StudentId ?? user.LecturerId ?? string.Empty
                    };
                },
                "Failed to view profile"
            );
        }

        public async Task<Result<bool>> EditProfileAsync(EditProfileRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateUserAsync(requestDto.UserId))
                        throw new KeyNotFoundException("User not found");
                   
                    var user = new UserDetail
                    {
                        UserId = requestDto.UserId,
                        UserName = requestDto.Name,
                        Email = requestDto.Email,
                        AccRole = requestDto.Role.ToString(),
                        StudentId = requestDto.Role == AccRoleEnum.Student ? requestDto.CampusId : null,
                        LecturerId = requestDto.Role != AccRoleEnum.Student ? requestDto.CampusId : null,
                    };
                    return await _userRepository.EditUserAsync(user);
                },
                "Failed to edit profile"
            );
        }

        public async Task<Result<bool>> ChangePasswordAsync(EditPasswordRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (!await _validateService.ValidateUserAsync(requestDto.UserId))
                        throw new KeyNotFoundException("User not found");

                    if (!_validateService.ValidatePasswordAsync(requestDto.OldPassword, requestDto.NewPassword))
                        throw new InvalidOperationException("Invalid password");
                    var isOldPasswordCorrect = await _validateService.ValidateOldPasswordCorrectAsync(requestDto.UserId, requestDto.OldPassword);
                    if (!isOldPasswordCorrect)
                        throw new InvalidOperationException("Old password is incorrect");

                    var newPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.NewPassword);
                    return await _userRepository.ChangeUserPasswordAsync(requestDto.UserId, newPassword);
                },
                "Failed to change password"
            );
        }
    }
}