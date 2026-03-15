using Microsoft.AspNetCore.Mvc;
using MediaInvoicesAPI.Data;
using MediaInvoicesAPI.Models;

namespace MediaInvoicesAPI.Controllers
{
    [ApiController]
    [Route("api/utilisateurs")]
    public class UtilisateurController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UtilisateurController(AppDbContext context)
        {
            _context = context;
        }

        // GET tous les utilisateurs
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Utilisateurs.ToList();
            return Ok(users);
        }

        // GET utilisateur par id
        [HttpGet("{id}")]
        public IActionResult GetUser(long id)
        {
            var user = _context.Utilisateurs.Find(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST ajouter utilisateur (admin)
        [HttpPost]
        public IActionResult AddUser([FromBody] Utilisateur user)
        {
            _context.Utilisateurs.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }

        // PUT modifier utilisateur
        [HttpPut("{id}")]
        public IActionResult UpdateUser(long id, [FromBody] Utilisateur updatedUser)
        {
            var user = _context.Utilisateurs.Find(id);

            if (user == null)
                return NotFound();

            user.Nom = updatedUser.Nom;
            user.Prenom = updatedUser.Prenom;
            user.Email = updatedUser.Email;
            user.Login = updatedUser.Login;
            user.MotDePasse = updatedUser.MotDePasse;
            user.Role = updatedUser.Role;

            _context.SaveChanges();

            return Ok(user);
        }

        // DELETE supprimer utilisateur
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(long id)
        {
            var user = _context.Utilisateurs.Find(id);

            if (user == null)
                return NotFound();

            _context.Utilisateurs.Remove(user);
            _context.SaveChanges();

            return Ok();
        }
    }
}