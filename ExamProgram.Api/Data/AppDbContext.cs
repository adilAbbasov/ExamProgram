using ExamProgram.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamProgram.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Exam> Exams => Set<Exam>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lesson>(e =>
        {
            e.ToTable("Lessons");
            e.Property(p => p.LessonName).HasColumnType("nvarchar(30)");
            e.Property(p => p.TeacherFirstName).HasColumnType("nvarchar(20)");
            e.Property(p => p.TeacherLastName).HasColumnType("nvarchar(20)");
        });

        modelBuilder.Entity<Student>(e =>
        {
            e.ToTable("Students");
            e.Property(p => p.StudentNumber).ValueGeneratedNever();
            e.Property(p => p.FirstName).HasColumnType("nvarchar(30)");
            e.Property(p => p.LastName).HasColumnType("nvarchar(30)");
        });

        modelBuilder.Entity<Exam>(e =>
        {
            e.ToTable("Exams");

            e.HasOne(x => x.Lesson)
                .WithMany(l => l.Exams)
                .HasForeignKey(x => x.LessonCode)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Student)
                .WithMany(s => s.Exams)
                .HasForeignKey(x => x.StudentNumber)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => new { x.LessonCode, x.StudentNumber, x.ExamDate })
                .IsUnique()
                .HasDatabaseName("UQ_Exams_Unique");
        });
    }
}
