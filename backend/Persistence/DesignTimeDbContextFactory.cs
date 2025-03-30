using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Persistence.Database;
using System.IO;

namespace Persistence
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DatabaseService>
    {
        public DatabaseService CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<DatabaseService>();

            var configurationPath = Path.Combine(Directory.GetCurrentDirectory(), "../Api");

            // Set up configuration for migrations
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(configurationPath)  // This sets the base path for your configuration
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new DatabaseService(optionsBuilder.Options);

        }
    }
}