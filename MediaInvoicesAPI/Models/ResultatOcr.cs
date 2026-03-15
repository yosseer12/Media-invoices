using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class ResultatOCR
{
    [Key]
    public int IdResultat { get; set; }

    public DateTime DateAnalyse { get; set; }

    public int IdFacture { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal TauxConfiance { get; set; }

    // 🔹 Navigation
    [ForeignKey("IdFacture")]
    public Facture IdFactureNavigation { get; set; } = null!;
}