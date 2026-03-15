using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;       // pour [Key], [Required]
using System.ComponentModel.DataAnnotations.Schema; // pour [ForeignKey]
using Microsoft.EntityFrameworkCore;
namespace MediaInvoicesAPI.Models;

public partial class MediaInvoicesContext : DbContext
{
    public MediaInvoicesContext()
    {
    }

    public MediaInvoicesContext(DbContextOptions<MediaInvoicesContext> options)
        : base(options)
    {
    }
public DbSet<Utilisateur> Utilisateurs { get; set; }
public DbSet<StatutFacture> StatutFactures { get; set; }
public DbSet<Facture> Factures { get; set; }
public DbSet<WorkflowValidation> WorkflowValidations { get; set; }
public DbSet<EtapeValidation> EtapesValidation { get; set; }
public DbSet<HistoriqueModification> HistoriqueModifications { get; set; }
public DbSet<ResultatOCR> ResultatsOCR { get; set; }
public DbSet<LogSysteme> LogsSysteme { get; set; }
public DbSet<Synchronisation> Synchronisations { get; set; }
public DbSet<LogSynchronisation> LogsSynchronisation { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=DESKTOP-8PE20M4;Database=MediaInvoices;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EtapeValidation>(entity =>
        {
            entity.HasKey(e => e.IdEtape).HasName("PK__EtapeVal__C587A24B7E37561C");

            entity.ToTable("EtapeValidation");

            entity.Property(e => e.IdEtape).HasColumnName("idEtape");
            entity.Property(e => e.ArchivageLegal)
                .HasDefaultValue(false)
                .HasColumnName("archivageLegal");
            entity.Property(e => e.DateArchivage).HasColumnName("dateArchivage");
            entity.Property(e => e.IdArchivage).HasColumnName("idArchivage");
            entity.Property(e => e.IdWorkflow).HasColumnName("idWorkflow");
            entity.Property(e => e.Ordre).HasColumnName("ordre");
            entity.Property(e => e.Statut)
                .HasMaxLength(50)
                .HasColumnName("statut");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");

            entity.HasOne(d => d.IdWorkflowNavigation).WithMany(p => p.EtapeValidations)
                .HasForeignKey(d => d.IdWorkflow)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__EtapeVali__idWor__5DCAEF64");
        });

        modelBuilder.Entity<Facture>(entity =>
        {
            entity.HasKey(e => e.IdFacture).HasName("PK__Facture__3CD5687A9A5AAF72");

            entity.ToTable("Facture");

            entity.HasIndex(e => e.NumeroFacture, "UQ__Facture__16B1D02D3F3C9116").IsUnique();

            entity.Property(e => e.IdFacture).HasColumnName("idFacture");
            entity.Property(e => e.DateFacture).HasColumnName("dateFacture");
            entity.Property(e => e.DateReception).HasColumnName("dateReception");
            entity.Property(e => e.Devise)
                .HasMaxLength(10)
                .HasDefaultValue("TND")
                .HasColumnName("devise");
            entity.Property(e => e.IdUtilisateur).HasColumnName("idUtilisateur");
            entity.Property(e => e.MontantHt)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("montantHt");
            entity.Property(e => e.MontantTtc)
                .HasComputedColumnSql("([montantHt]+[montantTva])", true)
                .HasColumnType("decimal(19, 2)")
                .HasColumnName("montantTTC");
            entity.Property(e => e.MontantTva)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("montantTva");
            entity.Property(e => e.NumeroFacture)
                .HasMaxLength(50)
                .HasColumnName("numeroFacture");
            entity.Property(e => e.StatutId).HasColumnName("statutId");

            entity.HasOne(d => d.IdUtilisateurNavigation).WithMany(p => p.Factures)
                .HasForeignKey(d => d.IdUtilisateur)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facture__idUtili__5812160E");

            entity.HasOne(d => d.Statut).WithMany(p => p.Factures)
                .HasForeignKey(d => d.StatutId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facture__statutI__571DF1D5");
        });

        modelBuilder.Entity<HistoriqueModification>(entity =>
        {
            entity.HasKey(e => e.IdHistorique).HasName("PK__Historiq__D733FADA3A2E32F8");

            entity.ToTable("HistoriqueModification");

            entity.Property(e => e.IdHistorique).HasColumnName("idHistorique");
            entity.Property(e => e.AncienneValeur)
                .HasMaxLength(255)
                .HasColumnName("ancienneValeur");
            entity.Property(e => e.ChampModifie)
                .HasMaxLength(100)
                .HasColumnName("champModifie");
            entity.Property(e => e.DateModification).HasColumnName("dateModification");
            entity.Property(e => e.IdFacture).HasColumnName("idFacture");
            entity.Property(e => e.NouvelleValeur)
                .HasMaxLength(255)
                .HasColumnName("nouvelleValeur");

            entity.HasOne(d => d.IdFactureNavigation).WithMany(p => p.HistoriqueModifications)
                .HasForeignKey(d => d.IdFacture)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Historiqu__idFac__60A75C0F");
        });

        modelBuilder.Entity<LogSynchronisation>(entity =>
        {
            entity.HasKey(e => e.IdLogSync).HasName("PK__LogSynch__C0259B1FBD28BC4B");

            entity.ToTable("LogSynchronisation");

            entity.Property(e => e.IdLogSync).HasColumnName("idLogSync");
            entity.Property(e => e.DateLog).HasColumnName("dateLog");
            entity.Property(e => e.IdSynchronisation).HasColumnName("idSynchronisation");
            entity.Property(e => e.Message).HasColumnName("message");

            entity.HasOne(d => d.IdSynchronisationNavigation).WithMany(p => p.LogSynchronisations)
                .HasForeignKey(d => d.IdSynchronisation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LogSynchr__idSyn__6B24EA82");
        });

        modelBuilder.Entity<LogSysteme>(entity =>
        {
            entity.HasKey(e => e.IdLogSysteme).HasName("PK__LogSyste__EA79E609C3C5B0BA");

            entity.ToTable("LogSysteme");

            entity.Property(e => e.IdLogSysteme).HasColumnName("idLogSysteme");
            entity.Property(e => e.Action)
                .HasMaxLength(100)
                .HasColumnName("action");
            entity.Property(e => e.Commentaire).HasColumnName("commentaire");
            entity.Property(e => e.DateAction).HasColumnName("dateAction");
            entity.Property(e => e.IdUtilisateur).HasColumnName("idUtilisateur");

            entity.HasOne(d => d.IdUtilisateurNavigation).WithMany(p => p.LogSystemes)
                .HasForeignKey(d => d.IdUtilisateur)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LogSystem__idUti__66603565");
        });

        modelBuilder.Entity<ResultatOCR>(entity =>
        {
            entity.HasKey(e => e.IdResultat).HasName("PK__Resultat__18392FD46D786391");

            entity.ToTable("ResultatOCR");

            entity.Property(e => e.IdResultat).HasColumnName("idResultat");
            entity.Property(e => e.DateAnalyse).HasColumnName("dateAnalyse");
            entity.Property(e => e.IdFacture).HasColumnName("idFacture");
            entity.Property(e => e.TauxConfiance)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("tauxConfiance");

            entity.HasOne(d => d.IdFactureNavigation).WithMany(p => p.ResultatOcrs)
                .HasForeignKey(d => d.IdFacture)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ResultatO__idFac__6383C8BA");
        });

        modelBuilder.Entity<StatutFacture>(entity =>
        {
            entity.HasKey(e => e.IdStatut).HasName("PK__StatutFa__01936F7B80849ACF");

            entity.ToTable("StatutFacture");

            entity.HasIndex(e => e.Libelle, "UQ__StatutFa__DB6DF88562E8F99A").IsUnique();

            entity.Property(e => e.IdStatut).HasColumnName("idStatut");
            entity.Property(e => e.Libelle)
                .HasMaxLength(50)
                .HasColumnName("libelle");
        });

        modelBuilder.Entity<Synchronisation>(entity =>
        {
            entity.HasKey(e => e.IdSynchronisation).HasName("PK__Synchron__8F66E1ED0E637F65");

            entity.ToTable("Synchronisation");

            entity.Property(e => e.IdSynchronisation).HasColumnName("idSynchronisation");
            entity.Property(e => e.DateSynchronisation).HasColumnName("dateSynchronisation");
            entity.Property(e => e.Statut)
                .HasMaxLength(50)
                .HasColumnName("statut");
        });

        modelBuilder.Entity<Utilisateur>(entity =>
        {
            entity.HasKey(e => e.IdUtilisateur).HasName("PK__utilisat__5366DB19F462E471");

            entity.ToTable("utilisateur");

            entity.HasIndex(e => e.Login, "UQ__utilisat__7838F272C35098C6").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__utilisat__AB6E6164BEF52781").IsUnique();

            entity.Property(e => e.IdUtilisateur).HasColumnName("idUtilisateur");
            entity.Property(e => e.Actif)
                .HasDefaultValue(true)
                .HasColumnName("actif");
            entity.Property(e => e.DateCreation)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("dateCreation");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.Login)
                .HasMaxLength(50)
                .HasColumnName("login");
            entity.Property(e => e.MotDePasse)
                .HasMaxLength(255)
                .HasColumnName("motDePasse");
            entity.Property(e => e.Nom)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nom");
            entity.Property(e => e.Prenom)
                .HasMaxLength(100)
                .HasColumnName("prenom");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasColumnName("role");
        });

        modelBuilder.Entity<WorkflowValidation>(entity =>
        {
            entity.HasKey(e => e.IdWorkflow).HasName("PK__Workflow__2E3B18B5B65AF53C");

            entity.ToTable("WorkflowValidation");

            entity.Property(e => e.IdWorkflow).HasColumnName("idWorkflow");
            entity.Property(e => e.Nom)
                .HasMaxLength(100)
                .HasColumnName("nom");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
