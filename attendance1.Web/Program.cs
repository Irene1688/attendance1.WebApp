using attendance1.Web.Controllers;
using attendance1.Web.Services;
using attendance1.Web.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using attendance1.Web.Helpers;
using DeviceDetectorNET.Parser.Device;
using Microsoft.AspNetCore.Builder;
using Microsoft.CodeAnalysis.Scripting;
using NLog;
using NLog.Web;
using System;

//var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
var logger = NLog.LogManager.GetCurrentClassLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    var loggerFactory = LoggerFactory.Create(builder =>
    {
        //builder.ClearProviders(); // clear default asp.net configure, better is no used
        builder.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
    });

    #region services region
    // Add services to the container.
    
    // using NLog to log exception and error
    builder.Host.UseNLog();

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

    app.UseHttpsRedirection();
    app.UseStaticFiles();
    app.UseStaticFiles(new StaticFileOptions
    {
        ServeUnknownFileTypes = true,
        DefaultContentType = "application/json"
    });

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

#region [to do list]
//1. authorization 要根据情况做好重定向(403/access denied) v
//2. 可能需要做全局授权
//3. 禁止返回到登录页面 v
//4. 做login的alert和 v
//5. logout功能 (要禁止backward) v
//5. 做header footer 前端 v
//6. 清楚cookie的按钮 -> logout v
//7. 确保remember me的功能有效
//8. 重新登录，刷掉里面的cookie，添加lecturerId
//9. 测试功能，list出class v
//10. 换成view，重新做authorized v
//11. 如果add class的programme换成admin加的话，后端逻辑就不是保存programme进入数据库，而是获取id，存入数据库,
//    admin那边的就要限制，不能有重复的programme v
//12. add class时，如果已经insert了一些东西然后出现报错返回，返回之前要把insert的东西discard v
//13. add class的message display v
//14. indexLec的modal标题和功能测试(generate code) v
//15. testing temp data can pass or not (add class success message) v
//16. 优化add class
//17. 试试看app js和query能不能用外部引入 v
//18. 给classDay做限制，星期一开始 v
//19， close modal要清楚填的数据
//20. 给弹窗自定义css
//21. 给数据库的device table做限制，不要重复的数据插入，不要有冗余 v
//22. add student attendance single student再烤炉要不要让deiceId allow null (db table) v
//23. 给dropdown menu添加间距
//24. 给manifest加截图
//25. device service 分离 v
//26. student id if null required login again v
//27. 给js check pattern重写，源码在AdminPage.js
//28. edit-profile: password安全新不高
//29. class attendance page的change status modal关了之后数据initial

#endregion

#region BackUp
//_ValidationScriptsPartial.cshtml
//< script src = "~/lib/jquery-validation/dist/jquery.validate.min.js" ></ script >
//< script src = "~/lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js" ></ script >
#endregion
