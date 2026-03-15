using Microsoft.AspNetCore.Mvc;
using MediaInvoicesAPI.Data;
using MediaInvoicesAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MediaInvoicesAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Utilisateurs
                .FirstOrDefault(u => u.Email == request.Email && u.MotDePasse == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });
            }

            return Ok(new
            {
                id = user.IdUtilisateur,
                nom = user.Nom,
                email = user.Email,
                role = user.Role
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
public string Password { get; set; } = "";

}
}