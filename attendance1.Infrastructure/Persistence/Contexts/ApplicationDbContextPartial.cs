using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace attendance1.Infrastructure.Persistence.Contexts
{
    public partial class ApplicationDbContext
    {
        private readonly IConfiguration? _configuration;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        if (_configuration != null)
        //        {
        //            optionsBuilder
        //                .UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        //        }
        //        else
        //        {
        //            throw new InvalidOperationException("No configuration provided for ApplicationDbContext.");
        //        }
        //    }
        //}
    }
}
