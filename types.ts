export type ReadingStatus = 'reading' | 'completed' | 'want_to_read' | 'abandoned';

export type BookFormat = 'physical' | 'ebook' | 'audiobook' | 'pdf' | 'epub';

export type CurriculumVolumeType = 'single' | 'multi';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string; // e.g. "Klasik Roman", or discipline: "Tefsir ve Kur’an İlimleri"
  pageCount: number;
  currentPage: number;
  status: ReadingStatus;
  format: BookFormat;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  coverUrl?: string; // base64 or URL
  coverSource?: string;
  rating?: number; // 1 to 5
  startDate?: string;
  finishDate?: string; // YYYY-MM-DD
  finishedAtEstimated?: boolean; // True if estimated, false if exact
  notes?: string;
  shelf?: string;
  isFavorite?: boolean;
  addedAt: string;
  
  // E-reader attachments
  pdfUrl?: string; // Blob URL or Supabase Storage URL
  pdfFileName?: string;
  pdfFileSize?: number;
  epubUrl?: string;
  epubFileName?: string;
  epubFileSize?: number;
  lastReadPage?: number;
  lastReadAt?: string;

  // İlim Yolculuğum curriculum fields
  isCuratedCurriculum?: boolean;
  curriculumDiscipline?: string;
  curriculumVolumeType?: CurriculumVolumeType; // 'single' (20 sf) or 'multi' (20 sf)
  volumeInfo?: string;
  programWeek?: number;
  programMonth?: number;
}

export interface Poem {
  id: string;
  title: string;
  poet: string;
  content: string;
  category: string;
  isFavorite?: boolean;
  addedAt: string;
  notes?: string;
  audioUrl?: string; // Real human recitation audio file or URL
  reciterName?: string; // Name of the real person reciter
}

export interface LoanRecord {
  id: string;
  bookId: string;
  borrowerName: string;
  borrowerContact?: string;
  borrowDate: string;
  dueDate?: string;
  isReturned: boolean;
  returnedDate?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  bookId?: string;
  bookTitle: string;
  author: string;
  quoteText: string;
  pageNumber?: number;
  tags?: string[];
  createdAt: string;
  isFavorite?: boolean;
  category?: string;
  notes?: string;
  // Personalization & styling fields
  fontFamily?: 'serif' | 'sans' | 'mono' | 'handwriting';
  isBold?: boolean;
  isItalic?: boolean;
  textColor?: string;
  highlightColor?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  date: string;
  durationMinutes: number;
  pagesRead: number;
}

export interface ReadingGoal {
  year: number;
  targetBooks: number;
  targetPages?: number;
  dailyGoalSingleVolume?: number; // 20 pages default
  dailyGoalMultiVolume?: number; // 20 pages default
  totalDailyGoal?: number; // 40 pages default
}

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  locationText?: string;
  birthDate?: string;
  motto?: string;
  memberSince?: string;
  avatarUrl?: string;
  readingGoal?: number;
}

export interface BackupValidationResult {
  isValid: boolean;
  totalBooks: number;
  newBooksCount: number;
  duplicateBooksCount: number;
  quotesCount: number;
  loansCount: number;
  poemsCount: number;
  errors: string[];
  warnings: string[];
  previewSample: {
    title: string;
    author: string;
    status: string;
    year?: string;
    hasCover: boolean;
  }[];
}

export interface LibriSyncBackupFormat {
  version: string;
  exportedAt: string;
  appName: string;
  profile?: UserProfile;
  books: Book[];
  poems?: Poem[];
  quotes: Quote[];
  loans: LoanRecord[];
  goal: ReadingGoal;
  // Raw backup compatibility keys
  library?: any[];
  reading?: Record<string, any>;
  meta?: Record<string, any>;
}

