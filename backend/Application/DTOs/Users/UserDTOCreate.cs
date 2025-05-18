namespace Application.DTOs.Users;
    using System.ComponentModel.DataAnnotations;
using Domain.Enums; 


public class UserDTOCreate
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; }

    [Required]
    [MaxLength(50)]
    public string UserName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }

    [Required]
    [EnumDataType(typeof(Role))] // works only if Role is an enum
    public string Role { get; set; }
}


