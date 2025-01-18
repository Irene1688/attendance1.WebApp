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
        
        // Use your development connection string here
        optionsBuilder.UseSqlServer("Data Source=IRENE\\SQLEXPRESS;Initial Catalog=StudentAttendanceSystem;User ID=irene;Password=Root-123;Encrypt=False;Trust Server Certificate=True;");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}