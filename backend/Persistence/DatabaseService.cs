using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Domain.Users;
using Domain.Equipments;
using Domain.ReservationEquipments;
using Domain.Memberships;
using Domain.Payments;
using Domain.Spaces;
using Domain.SpaceEquipments;
using Domain.Reservations;



namespace Persistence.Database
{
    public class DatabaseService : DbContext
    {
        private readonly IConfiguration _configuration;

        public DatabaseService(IConfiguration configuration)
        {
            _configuration = configuration;

            // Database.Migrate();

            //Database.EnsureCreated();
        }

        public void Save()
        {
            SaveChanges();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<ReservationEquipment> ReservationEquipments { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Space> Spaces { get; set; }
        public DbSet<SpaceEquipment> SpaceEquipments { get; set; }
        public DbSet<Reservation> Reservations { get; set; }


        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = _configuration.GetConnectionString("postgres");

            optionsBuilder.UseNpgsql(connectionString, b => b.MigrationsAssembly("Api"));
            // , b => b.MigrationsAssembly("EcommerceService")
        }*/
        
    }
}