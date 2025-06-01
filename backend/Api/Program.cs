using Application.Interfaces.IUnitOfWork;
using Application.Services.ISpaceServices;
/*using Application.Services.Payments;*/
using Application.Services.Spaces;
using Microsoft.EntityFrameworkCore;
using Persistence.Database;
using Persistence.UnitOfWork;
using Application.Services.SpaceEquipments;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Application.Services.Auth;
using Application.Services.Equipments;
using Application.Services.Memberships;
using Application.Services.IUserServices;
using Application.Services.Users;
using Application.Services.Reservations;
using Application.Services.ReservationEquipments;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",policy =>
            {
                policy.WithOrigins("http://localhost:5173", "http://localhost:5176") // frontend Vite port
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
        });

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        }).AddApplicationPart(typeof(Api.Membership.MembershipController).Assembly); 


        builder.Services.AddEndpointsApiExplorer();

        // Add your existing services
        builder.Services.AddScoped<ISpaceService, SpaceService>();
        builder.Services.AddScoped<IMembershipService, MembershipService>();
        /*builder.Services.AddScoped<IPaymentService, PaymentService>();*/
        builder.Services.AddScoped<ISpaceEquipmentService, SpaceEquipmentService>();
        builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IEquipmentService, EquipmentService>();
        builder.Services.AddScoped<IReservationsService, ReservationService>();
        builder.Services.AddScoped<IReservationEquipmentService, ReservationEquipmentService>();

        builder.Services.AddScoped<IUserService, UserService>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(o =>
        {
            var jwtKey = builder.Configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT Key not configured");

            o.TokenValidationParameters = new TokenValidationParameters
            {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero // Corrected spelling from 'ClockSkeW'
            };

            // Configure JWT events to handle role claims
            o.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    var claims = context.Principal.Claims;
                    var userId = claims.FirstOrDefault(c => c.Type == "userId")?.Value;
                    var tokenVersionClaim = claims.FirstOrDefault(c => c.Type == "tokenVersion")?.Value;

                    if (userId != null && tokenVersionClaim != null)
                    {
                        // Get the user service from DI
                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        var user = await userService.GetUserByIdAsync(userId);

                        if (user == null || user.TokenVersion.ToString() != tokenVersionClaim)
                        {
                            // Token is no longer valid
                            context.Fail("Token is no longer valid due to role or security change.");
                            return;
                        }
                    }

                    // Existing role claim logic
                    var roleClaim = claims.FirstOrDefault(c => c.Type == "role");
                    if (roleClaim != null)
                    {
                        var identity = context.Principal.Identity as ClaimsIdentity;
                        if (identity != null)
                        {
                            if (Enum.TryParse<Role>(roleClaim.Value, out var role))
                            {
                                identity.AddClaim(new Claim(ClaimTypes.Role, role.ToString()));
                                identity.AddClaim(new Claim("RoleDisplayName", role.GetType()
                                    .GetField(role.ToString())
                                    ?.GetCustomAttributes(typeof(DisplayAttribute), false)
                                    .FirstOrDefault() is DisplayAttribute attr ? attr.Name : role.ToString()));
                            }
                        }
                    }
                }
            };
        });

        // Configure Authorization
        builder.Services.AddAuthorization(options =>
        {
            // Get all roles from the enum
            var roles = Enum.GetValues(typeof(Role)).Cast<Role>();

            // Create a policy for each role
            foreach (var role in roles)
            {
                var roleName = role.ToString();
                options.AddPolicy(roleName, policy =>
                    policy.RequireRole(roleName));
            }

            // Create combined policies
            options.AddPolicy("StaffOrSuperAdmin", policy =>
                policy.RequireRole(Role.Staff.ToString(), Role.SuperAdmin.ToString()));

            options.AddPolicy("UserOrStaffOrSuperAdmin", policy =>
                policy.RequireRole(Role.User.ToString(), Role.Staff.ToString(), Role.SuperAdmin.ToString()));
        });

        // Configure Swagger with JWT support
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
            c.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["controller"]}_{e.ActionDescriptor.RouteValues["action"]}");
        

            // Add JWT Authentication to Swagger
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                            {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                            }
                    },
                    Array.Empty<string>()
                }
            });
        });

        // Database configuration
        builder.Services.AddDbContext<DatabaseService>(options =>
            options.UseMySql(
                builder.Configuration.GetConnectionString("DefaultConnection"),
                new MySqlServerVersion(new Version(8, 0, 21)) // Specify your MySQL server version
        ));

        var app = builder.Build();

        // Configure the HTTP request pipeline
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            c.RoutePrefix = "swagger"; // Access Swagger UI at /swagger
        });

        //app.UseHttpsRedirection();
        app.UseStaticFiles();

        // Add Authentication & Authorization middleware
        // NOTE: The order is important - Authentication must come before Authorization
        app.UseCors("AllowFrontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.Run();
    }
}