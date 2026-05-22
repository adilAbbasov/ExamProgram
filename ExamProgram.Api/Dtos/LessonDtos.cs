using System.ComponentModel.DataAnnotations;

namespace ExamProgram.Api.Dtos;

public class LessonCreateDto
{
    [Required, StringLength(3, MinimumLength = 3)]
    public string LessonCode { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string LessonName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }

    [Required, StringLength(20)]
    public string TeacherFirstName { get; set; } = string.Empty;

    [Required, StringLength(20)]
    public string TeacherLastName { get; set; } = string.Empty;
}

public class LessonUpdateDto
{
    [Required, StringLength(30)]
    public string LessonName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }

    [Required, StringLength(20)]
    public string TeacherFirstName { get; set; } = string.Empty;

    [Required, StringLength(20)]
    public string TeacherLastName { get; set; } = string.Empty;
}
