using Microsoft.EntityFrameworkCore;
using Domain.Users;
using Domain.Equipments;
using Domain.ReservationEquipments;
using Domain.Memberships;
using Domain.Spaces;
using Domain.SpaceEquipments;
using Domain.Reservations;



namespace Persistence.Database
{
    public class DatabaseService : DbContext
    {

        public DatabaseService(DbContextOptions<DatabaseService> options) : base(options)
        {

        }

        public void Save()
        {
            SaveChanges();
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<ReservationEquipment> ReservationEquipments { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Space> Spaces { get; set; }
        public DbSet<SpaceEquipment> SpaceEquipments { get; set; }
        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        { 

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ReservationEquipment>()
                .HasKey(sc => new { sc.ReservationId, sc.EquipmentId});

            modelBuilder.Entity<ReservationEquipment>()
                .HasOne(sc => sc.Reservation)
                .WithMany(s => s.ReservationEquipment)
                .HasForeignKey(sc => sc.ReservationId);

            modelBuilder.Entity<ReservationEquipment>()
                .HasOne(sc => sc.Equipment)
                .WithMany(c => c.ReservationEquipment)
                .HasForeignKey(sc => sc.EquipmentId);

            modelBuilder.Entity<SpaceEquipment>()
                .HasKey(sc => new { sc.SpaceId, sc.EquipmentId });

            modelBuilder.Entity<SpaceEquipment>()
                .HasOne(sc => sc.Space)
                .WithMany(s => s.SpaceEquipment)
                .HasForeignKey(sc => sc.SpaceId);

            modelBuilder.Entity<SpaceEquipment>()
                .HasOne(sc => sc.Equipment)
                .WithMany(c => c.SpaceEquipment)
                .HasForeignKey(sc => sc.EquipmentId);
        }
    }
}
