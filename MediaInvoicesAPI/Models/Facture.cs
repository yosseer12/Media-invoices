using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class Facture
{
    [Key]
    public int IdFacture { get; set; }

    [Required]
    [MaxLength(50)]
    public string NumeroFacture { get; set; } = null!;

    public DateTime? DateFacture { get; set; }
    public DateTime? DateReception { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MontantHt { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MontantTva { get; set; }

    [Column(TypeName = "decimal(19,2)")]
    public decimal MontantTtc { get; set; }

    public int IdUtilisateur { get; set; }
    public int StatutId { get; set; }

    // 🔹 Navigation properties
    [ForeignKey("IdUtilisateur")]
    public Utilisateur IdUtilisateurNavigation { get; set; } = null!;

    [ForeignKey("StatutId")]
    public StatutFacture Statut { get; set; } = null!;

    public ICollection<ResultatOCR> ResultatsOCR { get; set; } = new List<ResultatOCR>();
    public ICollection<HistoriqueModification> HistoriqueModifications { get; set; } = new List<HistoriqueModification>();
}