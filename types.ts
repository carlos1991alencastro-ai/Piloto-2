
export interface Lesson {
  id: string;
  title: string;
  driveId: string;
}

export interface MultimediaVideo {
  id: string;
  title: string;
  url: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: 'menu_book' | 'psychology' | 'construction' | 'biotech' | 'perm_media' | 'science'; 
  summaryNotebookUrl?: string;
  isMultimediaLibrary?: boolean;
  videos?: MultimediaVideo[];
}

export interface MultimediaItem {
  id: string;
  type: 'audio' | 'photo' | 'video';
  url: string; // Blob URL o Base64
  name: string;
  fecha: number;
}

export interface CarpetaApunte {
  id: string;
  nombre: string;
  contenido: string; 
  fecha: number;
  multimedia: MultimediaItem[];
  papeleraMultimedia: MultimediaItem[];
}

export type ViewState = 'WELCOME' | 'HOME' | 'MODULES' | 'NOTES' | 'PROFILE' | 'READER';

export interface ReadingProgress {
  lessonId: string;
  page?: number;
  scrollPosition?: number;
  lastRead: string;
}
