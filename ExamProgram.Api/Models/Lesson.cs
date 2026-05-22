using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ExamProgram.Api.Models;

public class Lesson
{
    [Key]
    [Column(TypeName = "char(3)")]
    [StringLength(3, MinimumLength = 3)]
    public string LessonCode { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string LessonName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }

    [Required]
    [StringLength(20)]
    public string TeacherFirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string TeacherLastName { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}
