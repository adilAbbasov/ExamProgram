using System.ComponentModel.DataAnnotations;

namespace ExamProgram.Api.Dtos;

public class ExamCreateDto
{
    [Required, StringLength(3, MinimumLength = 3)]
    public string LessonCode { get; set; } = string.Empty;

    [Range(1, 99999)]
    public int StudentNumber { get; set; }

    public DateTime ExamDate { get; set; }

    [Range(1, 5)]
    public byte Score { get; set; }
}

public class ExamUpdateDto
{
    public DateTime ExamDate { get; set; }

    [Range(1, 5)]
    public byte Score { get; set; }
}

public class ExamReadDto
{
    public int ExamId { get; set; }
    public string LessonCode { get; set; } = string.Empty;
    public string LessonName { get; set; } = string.Empty;
    public int StudentNumber { get; set; }
    public string StudentFullName { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public byte Score { get; set; }
}
