export interface Exam {
  examId: number;
  lessonCode: string;
  lessonName: string;
  studentNumber: number;
  studentFullName: string;
  examDate: string;
  score: number;
}

export interface ExamCreate {
  lessonCode: string;
  studentNumber: number;
  examDate: string;
  score: number;
}

export interface ExamUpdate {
  examDate: string;
  score: number;
}
