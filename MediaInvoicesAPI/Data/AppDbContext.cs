using Microsoft.EntityFrameworkCore;
using MediaInvoicesAPI.Models;

namespace MediaInvoicesAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<StatutFacture> StatutFactures { get; set; }
        public DbSet<Facture> Factures { get; set; }
        public DbSet<WorkflowValidation> WorkflowValidations { get; set; }
        public DbSet<EtapeValidation> EtapeValidations { get; set; }
        public DbSet<HistoriqueModification> HistoriqueModifications { get; set; }
        public DbSet<ResultatOCR> ResultatOCRs { get; set; }
        public DbSet<LogSysteme> LogSystemes { get; set; }
        public DbSet<Synchronisation> Synchronisations { get; set; }
        public DbSet<LogSynchronisation> LogSynchronisations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Utilisateur
            modelBuilder.Entity<Utilisateur>()
                .HasKey(u => u.IdUtilisateur);
            modelBuilder.Entity<Utilisateur>()
                .HasIndex(u => u.Login)
                .IsUnique();

            // StatutFacture
            modelBuilder.Entity<StatutFacture>()
                .HasKey(s => s.IdStatut);

            // Facture
            modelBuilder.Entity<Facture>()
                .HasKey(f => f.IdFacture);
            modelBuilder.Entity<Facture>()
                .HasOne(f => f.Utilisateur)
                .WithMany()
                .HasForeignKey(f => f.IdUtilisateur);
            modelBuilder.Entity<Facture>()
                .HasOne(f => f.StatutFacture)
                .WithMany()
                .HasForeignKey(f => f.StatutId);

            // WorkflowValidation
            modelBuilder.Entity<WorkflowValidation>()
                .HasKey(w => w.IdWorkflow);

            // EtapeValidation
            modelBuilder.Entity<EtapeValidation>()
                .HasKey(e => e.IdEtape);
            modelBuilder.Entity<EtapeValidation>()
                .HasOne(e => e.WorkflowValidation)
                .WithMany()
                .HasForeignKey(e => e.IdWorkflow);

            // HistoriqueModification
            modelBuilder.Entity<HistoriqueModification>()
                .HasKey(h => h.IdHistorique);
            modelBuilder.Entity<HistoriqueModification>()
                .HasOne(h => h.Facture)
                .WithMany()
                .HasForeignKey(h => h.IdFacture);

            // ResultatOCR
           modelBuilder.Entity<ResultatOCR>(entity =>
{
    entity.HasKey(e => e.IdResultat);
    entity.ToTable("ResultatOCR");
    entity.Property(e => e.IdResultat).HasColumnName("idResultat");
    entity.Property(e => e.IdFacture).HasColumnName("idFacture");
    entity.Property(e => e.DateAnalyse).HasColumnName("dateAnalyse");
    entity.Property(e => e.TauxConfiance).HasColumnType("decimal(5, 2)").HasColumnName("tauxConfiance");

    entity.HasOne(d => d.Facture)              // ← utilise la propriété navigation correcte
          .WithMany(p => p.ResultatsOCR)
          .HasForeignKey(d => d.IdFacture)
          .OnDelete(DeleteBehavior.ClientSetNull)
          .HasConstraintName("FK__ResultatO__idFac__6383C8BA");
});
            // LogSysteme
            modelBuilder.Entity<LogSysteme>()
                .HasKey(l => l.IdLogSysteme);
            modelBuilder.Entity<LogSysteme>()
                .HasOne(l => l.Utilisateur)
                .WithMany()
                .HasForeignKey(l => l.IdUtilisateur);

            // Synchronisation
            modelBuilder.Entity<Synchronisation>()
                .HasKey(s => s.IdSynchronisation);

            // LogSynchronisation
            modelBuilder.Entity<LogSynchronisation>()
                .HasKey(ls => ls.IdLogSync);
            modelBuilder.Entity<LogSynchronisation>()
                .HasOne(ls => ls.Synchronisation)
                .WithMany()
                .HasForeignKey(ls => ls.IdSynchronisation);
        }
    }
}