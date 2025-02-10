namespace attendance1.Application.Interfaces
{
    public interface IAdminService
    {
        /// <summary>
        /// Data for admin dashboard
        /// </summary>
        Task<Result<AllTotalCountResponseDto>> GetAllTotalCountAsync();
    }
}