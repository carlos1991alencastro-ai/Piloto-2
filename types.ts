
export interface Lesson {
  id: string;
  title: string;
  driveId: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Note {
  id: string;
  text: string;
  lessonTitle: string;
  date: string;
}

export type ViewState = 'WELCOME' | 'HOME' | 'MODULES' | 'NOTES' | 'PROFILE' | 'READER';

export interface ReadingProgress {
  lessonId: string;
  page?: number;
  scrollPosition?: number;
  lastRead: string;
}
