using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ExamProgram.Api.Models;

public class Student
{
    [Key]
    [Range(1, 99999)]
    public int StudentNumber { get; set; }

    [Required]
    [StringLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string LastName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }

    [JsonIgnore]
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}
