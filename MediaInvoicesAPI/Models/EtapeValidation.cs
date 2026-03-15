using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediaInvoicesAPI.Models;

public class EtapeValidation
{
    [Key]
    public int IdEtape { get; set; }

    public int IdWorkflow { get; set; }

    [MaxLength(50)]
    public string? Statut { get; set; }

    [MaxLength(50)]
    public string? Type { get; set; }

    public int? IdArchivage { get; set; }
    public DateTime? DateArchivage { get; set; }
    public bool ArchivageLegal { get; set; } = false;

    // 🔹 Navigation
    [ForeignKey("IdWorkflow")]
    public WorkflowValidation IdWorkflowNavigation { get; set; } = null!;
}