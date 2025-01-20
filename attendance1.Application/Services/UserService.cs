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

        public async Task<Result<ViewProfileResponseDto>> ViewProfileAsync(ViewProfileRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (string.IsNullOrEmpty(requestDto.CampusId))
                        throw new InvalidOperationException("Campus ID is required");

                    var user = await _userRepository.GetUserByCampusIdAsync(requestDto.Role.ToString(), requestDto.CampusId);
                    if (user == null)
                        throw new KeyNotFoundException("User not found");

                    return new ViewProfileResponseDto
                    {
                        Name = user.UserName ?? string.Empty,
                        Role = user.AccRole ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        CampusId = user.StudentId ?? user.LecturerId ?? string.Empty,
                        ProgrammeName = user.Programme?.ProgrammeName ?? string.Empty
                    };
                },
                "Failed to view profile"
            );
        }

        public async Task<Result<bool>> EditProfileWithPasswordAsync(EditProfileWithPasswordRequestDto requestDto)
        {
            return await ExecuteAsync(
                async () =>
                {
                    if (string.IsNullOrEmpty(requestDto.CampusId))
                        throw new InvalidOperationException("Campus ID is required");

                    var userToEdit = await _userRepository.GetUserByCampusIdAsync(requestDto.Role.ToString(), requestDto.CampusId);
                    if (userToEdit == null)
                        throw new KeyNotFoundException("User not found");
                    var userNewData = new UserDetail();

                    if (string.IsNullOrEmpty(requestDto.CurrentPassword) && string.IsNullOrEmpty(requestDto.NewPassword)) 
                    {
                        userNewData = new UserDetail
                        {
                            UserId = userToEdit.UserId,
                            UserName = requestDto.Name,
                            Email = requestDto.Email,
                        };
                    }
                    else
                    {
                        var isOldPasswordCorrect = await _validateService.ValidateOldPasswordCorrectAsync(userToEdit.UserId, requestDto.CurrentPassword);
                        if (!isOldPasswordCorrect)
                            throw new InvalidOperationException("Current password is incorrect");

                        userNewData = new UserDetail
                        {
                            UserId = userToEdit.UserId,
                            UserName = requestDto.Name,
                            Email = requestDto.Email,
                            UserPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.NewPassword),
                        };
                    }
                    
                    return await _userRepository.EditUserWithPasswordAsync(userNewData);
                },
                "Failed to edit profile"
            );
        }

        // public async Task<Result<bool>> EditProfileAsync(EditProfileRequestDto requestDto)
        // {
        //     return await ExecuteAsync(
        //         async () =>
        //         {
        //             if (!await _validateService.ValidateUserAsync(requestDto.UserId))
        //                 throw new KeyNotFoundException("User not found");
                   
        //             var user = new UserDetail
        //             {
        //                 UserId = requestDto.UserId,
        //                 UserName = requestDto.Name,
        //                 Email = requestDto.Email,
        //                 AccRole = requestDto.Role.ToString(),
        //                 StudentId = requestDto.Role == AccRoleEnum.Student ? requestDto.CampusId : null,
        //                 LecturerId = requestDto.Role != AccRoleEnum.Student ? requestDto.CampusId : null,
        //             };
        //             return await _userRepository.EditUserAsync(user);
        //         },
        //         "Failed to edit profile"
        //     );
        // }

        // public async Task<Result<bool>> ChangePasswordAsync(EditPasswordRequestDto requestDto)
        // {
        //     return await ExecuteAsync(
        //         async () =>
        //         {
        //             if (!await _validateService.ValidateUserAsync(requestDto.UserId))
        //                 throw new KeyNotFoundException("User not found");

        //             if (!_validateService.ValidatePasswordAsync(requestDto.OldPassword, requestDto.NewPassword))
        //                 throw new InvalidOperationException("Invalid password");
        //             var isOldPasswordCorrect = await _validateService.ValidateOldPasswordCorrectAsync(requestDto.UserId, requestDto.OldPassword);
        //             if (!isOldPasswordCorrect)
        //                 throw new InvalidOperationException("Old password is incorrect");

        //             var newPassword = BCrypt.Net.BCrypt.HashPassword(requestDto.NewPassword);
        //             return await _userRepository.ChangeUserPasswordAsync(requestDto.UserId, newPassword);
        //         },
        //         "Failed to change password"
        //     );
        // }
    }
}