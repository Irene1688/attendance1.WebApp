using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace attendance1.Infrastructure.Persistence.Contexts;

// This class is used by EF Core tools (like migrations) at design time
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        
        //optionsBuilder.UseSqlServer("Data Source=127.0.0.1,1434;Initial Catalog=StudentAttendanceSystem;User ID=sa;Password=yourStrong(!)Password;Encrypt=False;TrustServerCertificate=True");
        optionsBuilder.UseSqlServer("Data Source=IRENE\\SQLEXPRESS;Initial Catalog=StudentAttendanceSystem;User ID=irene;Password=Root-123;Encrypt=False;TrustServerCertificate=True");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}