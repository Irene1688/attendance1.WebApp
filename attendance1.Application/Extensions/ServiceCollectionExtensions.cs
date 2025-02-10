namespace attendance1.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ILectureService, LectureService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IValidateService, ValidateService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IAttendanceService, AttendanceService>();
            services.AddScoped<IProgrammeService, ProgrammeService>();

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>() 
                ?? throw new InvalidOperationException("Jwt settings not configured");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true,
                    RequireSignedTokens = true
                };

                options.Events = new JwtBearerEvents
                {
                    OnChallenge = async context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        var result = JsonSerializer.Serialize(new
                        {
                            status = 401,
                            message = "You are not logged in or your login has expired"
                        });
                        await context.Response.WriteAsync(result);
                    },
                    OnForbidden = async context =>
                    {
                        context.Response.StatusCode = 403;
                        context.Response.Headers.Append("Forbidden", "true");
                        context.Response.ContentType = "application/json";
                        var result = JsonSerializer.Serialize(new
                        {
                            status = 403,
                            message = "You do not have permission to access this resource"
                        });
                        await context.Response.WriteAsync(result);
                    },
                    OnAuthenticationFailed = async context =>
                    {
                        if (context.Exception is SecurityTokenExpiredException tokenException)
                        {
                            context.Response.Headers.Append("Token-Expired", "true");
                            context.Response.StatusCode = 401;
                            var result = JsonSerializer.Serialize(new
                            {
                                status = 401,
                                message = "Token has expired",
                            });
                            await context.Response.WriteAsync(result);
                        }
                    }
                };
            });

            return services;
        }

        public static IServiceCollection AddLoggingServices(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<LogContext>();

            return services;
        }
    }
} 