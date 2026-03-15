using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MediaInvoicesAPI.Models;

public partial class Utilisateur
{
    [Key]
    public long IdUtilisateur { get; set; }

    public string Nom { get; set; } = null!;

    public string? Prenom { get; set; }

    public string? Email { get; set; }

    public string Login { get; set; } = null!;

    public string MotDePasse { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime? DateCreation { get; set; }

    public bool? Actif { get; set; }

    public virtual ICollection<Facture> Factures { get; set; } = new List<Facture>();

    public virtual ICollection<LogSysteme> LogSystemes { get; set; } = new List<LogSysteme>();
}
