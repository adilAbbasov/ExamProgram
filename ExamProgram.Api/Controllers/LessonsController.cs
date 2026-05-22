using ExamProgram.Api.Data;
using ExamProgram.Api.Dtos;
using ExamProgram.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamProgram.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LessonsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lesson>>> GetAll()
    {
        return await _db.Lessons.AsNoTracking().OrderBy(x => x.LessonCode).ToListAsync();
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<Lesson>> GetByCode(string code)
    {
        var lesson = await _db.Lessons.FindAsync(code);
        return lesson is null ? NotFound() : lesson;
    }

    [HttpPost]
    public async Task<ActionResult<Lesson>> Create(LessonCreateDto dto)
    {
        if (await _db.Lessons.AnyAsync(x => x.LessonCode == dto.LessonCode))
            return Conflict($"Lesson with code '{dto.LessonCode}' already exists.");

        var lesson = new Lesson
        {
            LessonCode = dto.LessonCode,
            LessonName = dto.LessonName,
            Grade = dto.Grade,
            TeacherFirstName = dto.TeacherFirstName,
            TeacherLastName = dto.TeacherLastName
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByCode), new { code = lesson.LessonCode }, lesson);
    }

    [HttpPut("{code}")]
    public async Task<IActionResult> Update(string code, LessonUpdateDto dto)
    {
        var lesson = await _db.Lessons.FindAsync(code);
        if (lesson is null) return NotFound();

        lesson.LessonName = dto.LessonName;
        lesson.Grade = dto.Grade;
        lesson.TeacherFirstName = dto.TeacherFirstName;
        lesson.TeacherLastName = dto.TeacherLastName;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{code}")]
    public async Task<IActionResult> Delete(string code)
    {
        var lesson = await _db.Lessons.FindAsync(code);
        if (lesson is null) return NotFound();

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
