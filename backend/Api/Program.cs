using Microsoft.EntityFrameworkCore;
using Persistence.Database;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "My API V1",
                Version = "v1"
            });
        });

        builder.Services.AddDbContext<DatabaseService>(options =>
            options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

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
