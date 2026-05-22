using System.ComponentModel.DataAnnotations;

namespace ExamProgram.Api.Dtos;

public class StudentCreateDto
{
    [Range(1, 99999)]
    public int StudentNumber { get; set; }

    [Required, StringLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string LastName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }
}

public class StudentUpdateDto
{
    [Required, StringLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string LastName { get; set; } = string.Empty;

    [Range(1, 12)]
    public short Grade { get; set; }
}
