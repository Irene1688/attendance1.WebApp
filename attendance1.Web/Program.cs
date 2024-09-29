using attendance1.Web.Controllers;
using attendance1.Web.Services;
using attendance1.Web.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using attendance1.Web.Helpers;
using NLog.Web;
using Microsoft.AspNetCore.DataProtection;

var logger = NLog.LogManager.GetCurrentClassLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    var loggerFactory = LoggerFactory.Create(builder =>
    {
        //builder.ClearProviders(); // clear default asp.net configure, better is dont used
        builder.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
    });



    #region services region
    // Add services to the container.

    // using NLog to log exception and error
    builder.Host.UseNLog();

    // Configure Data Protection
    builder.Services.AddDataProtection()
        .PersistKeysToFileSystem(new DirectoryInfo(@"C:\IISWebsite\Student Attendance Management System\UserKeys")) // Specify your path
        .SetApplicationName("Student Attendance Management System"); // Set a unique application name if needed

    builder.Services.AddRazorPages();
    builder.Services.AddTransient<DatabaseContext>();
    builder.Services.AddControllersWithViews();

    // cookie services
    builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(options =>
        {
            options.LoginPath = "/Login";
            options.Cookie.Name = "AuthCookie";
            //options.ExpireTimeSpan = TimeSpan.FromDays(14); // effective in 14 days
            options.SlidingExpiration = true;
            options.AccessDeniedPath = "/Error/AccessDenied";
            options.Cookie.HttpOnly = true; // 使 Cookie 只通过 HTTP 传输
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = CookieSecurePolicy.None;
            options.Events = new CookieAuthenticationEvents
            {
                OnSigningIn = context =>
                {
                    // log login events
                    context.HttpContext.RequestServices.GetRequiredService<ILogger<AuthLoggingMiddleware>>()
                        .LogInformation("User is signing in: {User}", context.Principal.Identity.Name);
                    return Task.CompletedTask;
                },
                OnSignedIn = context =>
                {
                    // log login success event
                    context.HttpContext.RequestServices.GetRequiredService<ILogger<AuthLoggingMiddleware>>()
                        .LogInformation("User signed in successfully: {User}", context.Principal.Identity.Name);
                    return Task.CompletedTask;
                },
                OnValidatePrincipal = context =>
                {
                    // log validate event
                    context.HttpContext.RequestServices.GetRequiredService<ILogger<AuthLoggingMiddleware>>()
                        .LogInformation("Validating user: {User}", context.Principal.Identity.Name);
                    return Task.CompletedTask;
                }
            };

        });

    // configure session 
    builder.Services.AddDistributedMemoryCache(); // session need memory cache
    builder.Services.AddSession(options =>
    {
        options.IdleTimeout = TimeSpan.FromDays(14);// Session effective time
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;
    });

    // authrizate user login and account role
    builder.Services.AddAuthorization();

    // register injection: class controller will be used in view component
    builder.Services.AddScoped<MenuHelper>();
    builder.Services.AddScoped<ClassController>();
    builder.Services.AddScoped<AccountService>();
    builder.Services.AddScoped<ClassService>();
    builder.Services.AddScoped<AttendanceService>();
    builder.Services.AddScoped<DeviceService>();
    builder.Services.AddScoped<AdminService>();
    builder.Services.AddHttpContextAccessor();
    #endregion

    var app = builder.Build();
    Console.WriteLine("Application has started");
    Console.WriteLine(AppDomain.CurrentDomain.BaseDirectory);
    logger.Info("Application started");

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseStatusCodePagesWithReExecute("/Error/ErrorHandler", "?statusCode={0}");
    }
    else
    {
        app.UseExceptionHandler("/Error/ErrorHandler");
        app.UseStatusCodePagesWithReExecute("/Error/ErrorHandler", "?statusCode={0}");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }


    //app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseStaticFiles(new StaticFileOptions
    {
        ServeUnknownFileTypes = true,
        DefaultContentType = "application/json"
    });

    app.UseSession();
    app.UseMiddleware<AuthLoggingMiddleware>();

    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapRazorPages();
    app.MapControllers();
    app.MapDefaultControllerRoute();

    app.MapGet("/", context =>
    {
        context.Response.Redirect("/Account/CheckLogin");
        return Task.CompletedTask;
    });

    //test login
    //app.MapGet("/", context =>
    //{
    //    context.Response.Redirect("/Login");
    //    return Task.CompletedTask;
    //});

    app.Run();
}
catch (Exception exception)
{
    // NLog: catch setup errors
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit
    NLog.LogManager.Shutdown();
}

#region BackUp
//_ValidationScriptsPartial.cshtml
//< script src = "~/lib/jquery-validation/dist/jquery.validate.min.js" ></ script >
//< script src = "~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js" ></ script >
#endregion
