using Application.Interfaces.IUnitOfWork;
using Application.Services.ISpaceServices;
using Application.Services.Payments;
using Application.Services.Memberships;
using Application.Services.Spaces;
using Microsoft.EntityFrameworkCore;
using Persistence.Database;
using Persistence.UnitOfWork;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddScoped<ISpaceService, SpaceService>();
        builder.Services.AddScoped<IMembershipService, MembershipService>();
        builder.Services.AddScoped<IPaymentService, PaymentService>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "My API V1",
                Version = "v1"
            });
        });

        builder.Services.AddDbContext<DatabaseService>(options =>
            options.UseMySql(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                new MySqlServerVersion(new Version(8, 0, 21)) // Specify your MySQL server version
            ));

        var app = builder.Build();

        // Enable Swagger always
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            c.RoutePrefix = "swagger"; // Access Swagger UI at /swagger
        });

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}
