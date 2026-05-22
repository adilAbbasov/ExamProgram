using ExamProgram.Api.Data;
using ExamProgram.Api.Dtos;
using ExamProgram.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamProgram.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExamsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExamReadDto>>> GetAll()
    {
        return await _db.Exams
            .AsNoTracking()
            .Include(x => x.Lesson)
            .Include(x => x.Student)
            .OrderByDescending(x => x.ExamDate)
            .Select(x => new ExamReadDto
            {
                ExamId = x.ExamId,
                LessonCode = x.LessonCode,
                LessonName = x.Lesson!.LessonName,
                StudentNumber = x.StudentNumber,
                StudentFullName = x.Student!.FirstName + " " + x.Student.LastName,
                ExamDate = x.ExamDate,
                Score = x.Score
            })
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Exam>> GetById(int id)
    {
        var exam = await _db.Exams.FindAsync(id);
        return exam is null ? NotFound() : exam;
    }

    [HttpPost]
    public async Task<ActionResult<Exam>> Create(ExamCreateDto dto)
    {
        if (!await _db.Lessons.AnyAsync(x => x.LessonCode == dto.LessonCode))
            return BadRequest($"Lesson '{dto.LessonCode}' does not exist.");

        if (!await _db.Students.AnyAsync(x => x.StudentNumber == dto.StudentNumber))
            return BadRequest($"Student '{dto.StudentNumber}' does not exist.");

        var duplicate = await _db.Exams.AnyAsync(x =>
            x.LessonCode == dto.LessonCode &&
            x.StudentNumber == dto.StudentNumber &&
            x.ExamDate == dto.ExamDate.Date);

        if (duplicate)
            return Conflict("An exam already exists for this student, lesson, and date.");

        var exam = new Exam
        {
            LessonCode = dto.LessonCode,
            StudentNumber = dto.StudentNumber,
            ExamDate = dto.ExamDate.Date,
            Score = dto.Score
        };

        _db.Exams.Add(exam);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = exam.ExamId }, exam);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ExamUpdateDto dto)
    {
        var exam = await _db.Exams.FindAsync(id);
        if (exam is null) return NotFound();

        exam.ExamDate = dto.ExamDate.Date;
        exam.Score = dto.Score;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var exam = await _db.Exams.FindAsync(id);
        if (exam is null) return NotFound();

        _db.Exams.Remove(exam);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
