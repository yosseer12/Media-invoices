using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MediaInvoicesAPI.Models;

public partial class Synchronisation
{
    public long IdSynchronisation { get; set; }

    public DateOnly DateSynchronisation { get; set; }

    public string? Statut { get; set; }

    public virtual ICollection<LogSynchronisation> LogSynchronisations { get; set; } = new List<LogSynchronisation>();
}
