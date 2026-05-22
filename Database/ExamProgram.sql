IF DB_ID('ExamProgramDB') IS NOT NULL
BEGIN
    ALTER DATABASE ExamProgramDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ExamProgramDB;
END
GO

CREATE DATABASE ExamProgramDB;
GO

USE ExamProgramDB;
GO

CREATE TABLE Lessons (
    LessonCode       CHAR(3)        NOT NULL,
    LessonName       NVARCHAR(30)   NOT NULL,
    Grade            SMALLINT       NOT NULL,
    TeacherFirstName NVARCHAR(20)   NOT NULL,
    TeacherLastName  NVARCHAR(20)   NOT NULL,
    CONSTRAINT PK_Lessons PRIMARY KEY (LessonCode),
    CONSTRAINT CK_Lessons_Grade CHECK (Grade BETWEEN 1 AND 12)
);
GO

CREATE TABLE Students (
    StudentNumber INT           NOT NULL,
    FirstName     NVARCHAR(30)  NOT NULL,
    LastName      NVARCHAR(30)  NOT NULL,
    Grade         SMALLINT      NOT NULL,
    CONSTRAINT PK_Students PRIMARY KEY (StudentNumber),
    CONSTRAINT CK_Students_Grade  CHECK (Grade BETWEEN 1 AND 12),
    CONSTRAINT CK_Students_Number CHECK (StudentNumber BETWEEN 1 AND 99999)
);
GO

CREATE TABLE Exams (
    ExamId        INT IDENTITY(1,1) NOT NULL,
    LessonCode    CHAR(3)           NOT NULL,
    StudentNumber INT               NOT NULL,
    ExamDate      DATE              NOT NULL,
    Score         TINYINT           NOT NULL,
    CONSTRAINT PK_Exams PRIMARY KEY (ExamId),
    CONSTRAINT FK_Exams_Lessons  FOREIGN KEY (LessonCode)
        REFERENCES Lessons(LessonCode)  ON DELETE CASCADE,
    CONSTRAINT FK_Exams_Students FOREIGN KEY (StudentNumber)
        REFERENCES Students(StudentNumber) ON DELETE CASCADE,
    CONSTRAINT CK_Exams_Score CHECK (Score BETWEEN 1 AND 5),
    CONSTRAINT UQ_Exams_Unique UNIQUE (LessonCode, StudentNumber, ExamDate)
);
GO

CREATE INDEX IX_Exams_LessonCode    ON Exams(LessonCode);
CREATE INDEX IX_Exams_StudentNumber ON Exams(StudentNumber);
CREATE INDEX IX_Exams_ExamDate      ON Exams(ExamDate);
GO
