USE ExamProgramDB;
GO

INSERT INTO Lessons (LessonCode, LessonName, Grade, TeacherFirstName, TeacherLastName) VALUES
('MTH', N'Riyaziyyat',        9,  N'Aysel',  N'Quliyeva'),
('PHY', N'Fizika',             9,  N'Rauf',   N'Məmmədov'),
('CHM', N'Kimya',              10, N'Leyla',  N'Hüseynova'),
('HST', N'Tarix',              10, N'Elnur',  N'Əliyev'),
('ENG', N'İngilis dili',       11, N'Nigar',  N'Kərimova');
GO

INSERT INTO Students (StudentNumber, FirstName, LastName, Grade) VALUES
(1001, N'Cavid',   N'Hüseynov',  9),
(1002, N'Ayşən',   N'Rzayeva',   9),
(1003, N'Tural',   N'Bayramov',  10),
(1004, N'Səbinə',  N'Cəfərova',  10),
(1005, N'Nihad',   N'Abbasov',   11);
GO

INSERT INTO Exams (LessonCode, StudentNumber, ExamDate, Score) VALUES
('MTH', 1001, '2026-05-12', 5),
('PHY', 1001, '2026-05-14', 4),
('MTH', 1002, '2026-05-12', 3),
('CHM', 1003, '2026-05-15', 5),
('HST', 1004, '2026-05-16', 4),
('ENG', 1005, '2026-05-17', 5);
GO
