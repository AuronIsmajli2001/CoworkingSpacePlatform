using Domain.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class RefreshToken
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; }
    [Required]

    public string Token { get; set; }
    public DateTime Created { get; set; }

    [Required]

    public DateTime Expires { get; set; }
    public DateTime? Revoked { get; set; }  // Null = still active

    [Required]
    [ForeignKey("UserId")]

    public string UserId { get; set; }
    public User User { get; set; }
}