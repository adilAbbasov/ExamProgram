using ExamProgram.Api.Data;
using ExamProgram.Api.Dtos;
using ExamProgram.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamProgram.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetAll()
    {
        return await _db.Students.AsNoTracking().OrderBy(x => x.StudentNumber).ToListAsync();
    }

    [HttpGet("{number:int}")]
    public async Task<ActionResult<Student>> GetByNumber(int number)
    {
        var student = await _db.Students.FindAsync(number);
        return student is null ? NotFound() : student;
    }

    [HttpPost]
    public async Task<ActionResult<Student>> Create(StudentCreateDto dto)
    {
        if (await _db.Students.AnyAsync(x => x.StudentNumber == dto.StudentNumber))
            return Conflict($"Student with number '{dto.StudentNumber}' already exists.");

        var student = new Student
        {
            StudentNumber = dto.StudentNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Grade = dto.Grade
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetByNumber), new { number = student.StudentNumber }, student);
    }

    [HttpPut("{number:int}")]
    public async Task<IActionResult> Update(int number, StudentUpdateDto dto)
    {
        var student = await _db.Students.FindAsync(number);
        if (student is null) return NotFound();

        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.Grade = dto.Grade;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{number:int}")]
    public async Task<IActionResult> Delete(int number)
    {
        var student = await _db.Students.FindAsync(number);
        if (student is null) return NotFound();

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
