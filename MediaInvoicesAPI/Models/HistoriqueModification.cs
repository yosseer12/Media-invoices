using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class HistoriqueModification
{
    [Key]
    public int IdHistorique { get; set; }

    [MaxLength(100)]
    public string ChampModifie { get; set; } = null!;

    [MaxLength(255)]
    public string AncienneValeur { get; set; } = null!;

    [MaxLength(255)]
    public string NouvelleValeur { get; set; } = null!;

    public DateTime DateModification { get; set; }

    public int IdFacture { get; set; }

    // 🔹 Navigation
    [ForeignKey("IdFacture")]
    public Facture IdFactureNavigation { get; set; } = null!;
}