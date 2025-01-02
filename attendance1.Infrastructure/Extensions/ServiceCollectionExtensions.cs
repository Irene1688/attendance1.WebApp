using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using attendance1.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace attendance1.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // services.AddDbContext<ApplicationDbContext>(options =>
            //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), 
            //         sqlOptions => sqlOptions.EnableRetryOnFailure()));
            services.AddDbContextFactory<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions => sqlOptions.EnableRetryOnFailure()));

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IProgrammeRepository, ProgrammeRepository>();
            services.AddScoped<IAttendanceRepository, AttendanceRepository>();

            return services;
        }
    }
} 