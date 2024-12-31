using attendance1.Application.Interfaces;
using attendance1.Application.Services;
using attendance1.Domain.Interfaces;
using attendance1.Infrastructure.Persistence.Contexts;
using attendance1.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using attendance1.Application.Common.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using attendance1.WebApi.Middleware;
using attendance1.Application.Common.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// register repository
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IProgrammeRepository, ProgrammeRepository>();
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();

// register application services
builder.Services.AddScoped<ILectureService, LectureService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IValidateService, ValidateService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();

// configure database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlOptions => sqlOptions.EnableRetryOnFailure()));

// configure jwt
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() 
    ?? throw new InvalidOperationException("Jwt settings not configured");

builder.Services.AddAuthentication(options =>
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
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
            if (context.Exception is SecurityTokenExpiredException)
            {
                context.Response.Headers.Append("Token-Expired", "true");
                context.Response.StatusCode = 401;
                var result = JsonSerializer.Serialize(new
                {
                    status = 401,
                    message = "Token has expired"
                });
                await context.Response.WriteAsync(result);
            }
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
    options.AddPolicy("LecturerOnly", policy => policy.RequireRole("Lecturer"));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// for logging
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<LogContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseLogContext();

app.MapControllers();

app.Run();
