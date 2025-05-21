namespace Application.DTOs.Users;
    using System.ComponentModel.DataAnnotations;
using Domain.Enums; 


public class UserDTOCreate
{
    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string UserName { get; set; }

    [EmailAddress]
    public string Email { get; set; }

    public string Password { get; set; }

    public Role Role { get; set; }
}


