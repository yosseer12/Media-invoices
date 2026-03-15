using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MediaInvoicesAPI.Models;

public partial class StatutFacture
{
    public int IdStatut { get; set; }

    public string Libelle { get; set; } = null!;

    public virtual ICollection<Facture> Factures { get; set; } = new List<Facture>();
}
