using attendance1.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

public class DbContextFactory : IDbContextFactory<ApplicationDbContext>
{
    private readonly DbContextOptions<ApplicationDbContext> _options;

    public DbContextFactory(DbContextOptions<ApplicationDbContext> options)
    {
        _options = options;
    }

    public ApplicationDbContext CreateDbContext()
    {
        return new ApplicationDbContext(_options);
    }
} 