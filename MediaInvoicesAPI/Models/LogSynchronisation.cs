using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class LogSynchronisation
{
    [Key]
    public int IdLogSync { get; set; }

    public DateTime DateLog { get; set; }

    [Required]
    public string Message { get; set; } = null!;

    public int IdSynchronisation { get; set; }

    // 🔹 Navigation
    [ForeignKey("IdSynchronisation")]
    public Synchronisation IdSynchronisationNavigation { get; set; } = null!;
}