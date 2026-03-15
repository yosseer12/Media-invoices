using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MediaInvoicesAPI.Models;

public partial class WorkflowValidation
{
    public long IdWorkflow { get; set; }

    public string Nom { get; set; } = null!;

    public virtual ICollection<EtapeValidation> EtapeValidations { get; set; } = new List<EtapeValidation>();
}
