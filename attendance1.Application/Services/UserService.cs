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
    }
}