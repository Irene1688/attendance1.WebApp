var builder = WebApplication.CreateBuilder(args);

// for docker to listen on all addresses
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // listen port 5000
});

// Add services to the container
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddLoggingServices();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("AdminAndLecturer", policy => policy.RequireRole("Admin", "Lecturer"));
    options.AddPolicy("AllLoginedUser", policy => policy.RequireRole("Admin", "Lecturer", "Student"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
    options.AddPolicy("LecturerOnly", policy => policy.RequireRole("Lecturer"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // 在开发环境中禁用 HTTPS 重定向
    // app.UseHttpsRedirection();
}

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.UseLogContext();

app.MapControllers();

app.Run();
