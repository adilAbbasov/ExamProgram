using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamProgram.Api.Models;

public class Exam
{
    [Key]
    public int ExamId { get; set; }

    [Required]
    [Column(TypeName = "char(3)")]
    [StringLength(3, MinimumLength = 3)]
    public string LessonCode { get; set; } = string.Empty;

    [Required]
    [Range(1, 99999)]
    public int StudentNumber { get; set; }

    [Column(TypeName = "date")]
    public DateTime ExamDate { get; set; }

    [Range(1, 5)]
    public byte Score { get; set; }

    [JsonIgnore]
    public Lesson? Lesson { get; set; }

    [JsonIgnore]
    public Student? Student { get; set; }
}
