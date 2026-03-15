using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class LogSysteme
{
    [Key]
    public int IdLogSysteme { get; set; }

    [Required]
    public string Action { get; set; } = null!;

    public string? Commentaire { get; set; }

    public DateTime DateAction { get; set; }

    public int IdUtilisateur { get; set; }

    // 🔹 Navigation
    [ForeignKey("IdUtilisateur")]
    public Utilisateur IdUtilisateurNavigation { get; set; } = null!;
}