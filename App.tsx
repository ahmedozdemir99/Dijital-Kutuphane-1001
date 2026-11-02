import React, { useState, useEffect, useMemo } from 'react';
import { Book, ReadingStatus, LoanRecord, Quote, ReadingGoal, Poem, UserProfile, BackupValidationResult } from './types';
import { 
  loadStoredBooks, saveStoredBooks, 
  loadStoredLoans, saveStoredLoans, 
  loadStoredQuotes, saveStoredQuotes, 
  loadStoredGoal, saveStoredGoal, 
  loadStoredPoems, saveStoredPoems,
  loadStoredProfile, saveStoredProfile,
  exportLibraryAsJson 
} from './utils/storage';
import { dbService } from './utils/db';
import { INITIAL_BOOKS } from './data/seedBooks';
import { searchBookCovers } from './utils/coverSearch';
import { validateAndParseBackup, createSafetyBackupSnapshot, getSafetyBackupSnapshot } from './utils/backupValidator';
import { BackupImportModal } from './components/BackupImportModal';
import { TodayView } from './components/TodayView';
import { ExploreView } from './components/ExploreView';
import { ArchiveView } from './components/ArchiveView';
import { ProfileView } from './components/ProfileView';
import { QuranReaderView } from './components/QuranReaderView';
import { Navbar, ActiveTab } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { NotificationModal, AppNotification } from './components/NotificationModal';
import { 
  Search, Filter, LayoutGrid, List, ArrowUpDown, 
  BookOpen, Plus, Heart, Sparkles, CheckCircle2, Bookmark,
  AlertCircle, AlertTriangle, X
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [exploreSubTab, setExploreSubTab] = useState<'curriculum' | 'recommendations' | 'poems' | 'quotes'>('curriculum');
  const [autoOpenPoemForm, setAutoOpenPoemForm] = useState(false);
  const [autoOpenQuoteForm, setAutoOpenQuoteForm] = useState(false);

  const handleOpenAddPoem = () => {
    setActiveTab('explore');
    setExploreSubTab('poems');
    setAutoOpenPoemForm(true);
  };

  const handleOpenAddQuote = () => {
    setActiveTab('explore');
    setExploreSubTab('quotes');
    setAutoOpenQuoteForm(true);
  };
  
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('librisync_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('librisync_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  
  // Data state
  const [books, setBooks] = useState<Book[]>(loadStoredBooks);
  const [poems, setPoems] = useState<Poem[]>(loadStoredPoems);
  const [loans, setLoans] = useState<LoanRecord[]>(loadStoredLoans);
  const [quotes, setQuotes] = useState<Quote[]>(loadStoredQuotes);
  const [goal, setGoal] = useState<ReadingGoal>(loadStoredGoal);
  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('librisync_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'notif-1',
        title: 'İlim Yolculuğuna Hoş Geldiniz',
        message: 'Bugün 40 sayfa (20 tek cilt + 20 çok cilt) okuma hedefiniz sizi bekliyor.',
        time: 'Bugün, 09:00',
        type: 'goal',
        isRead: false,
      },
      {
        id: 'notif-2',
        title: 'Haftanın Şiiri Önerisi',
        message: 'Mahrem ve Sır - Nurullah Genç şiirini okumayı ve tefekkür etmeyi unutmayın.',
        time: 'Dün',
        type: 'poem',
        isRead: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('librisync_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleTriggerTestNotification = () => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'Günlük Okuma Hatırlatıcısı',
      message: 'Kitaplarınız yarım kalmasın! Bugün henüz 40 sayfalık hedefinizi tamamlamadınız.',
      time: 'Şimdi',
      type: 'goal',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Test bildirimi başarıyla gönderildi!', 'success');

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Dijital Kütüphanem', {
        body: 'Kitaplarınız yarım kalmasın! Bugün henüz 40 sayfalık hedefinizi tamamlamadınız.',
        icon: '/favicon.ico',
      });
    }
  };

  // Backup Import & Validation state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importValidation, setImportValidation] = useState<BackupValidationResult | null>(null);
  const [pendingParsedData, setPendingParsedData] = useState<{
    books: Book[];
    poems: Poem[];
    quotes: Quote[];
    loans: LoanRecord[];
    goal?: ReadingGoal;
    profile?: UserProfile;
  } | null>(null);
  const [hasSafetySnapshot, setHasSafetySnapshot] = useState<boolean>(() => !!getSafetyBackupSnapshot());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 4000);
  };

  // Filter & Search state for Library
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedShelfFilter, setSelectedShelfFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'title_asc' | 'author_asc' | 'rating_desc' | 'progress_desc' | 'pages_desc'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBatchAutoCoverUpdate = async () => {
    setIsBatchUpdating(true);
    let updatedCount = 0;
    const newBooks = [...books];
    for (let i = 0; i < newBooks.length; i++) {
      const b = newBooks[i];
      if (!b.coverUrl || b.coverUrl.startsWith('data:image/svg+xml')) {
        try {
          const results = await searchBookCovers(b.title, b.title, b.author, b.genre);
          const realCover = results.find(r => r.source === 'google' || r.source === 'openlibrary');
          if (realCover) {
            newBooks[i] = { ...b, coverUrl: realCover.url };
            updatedCount++;
          }
        } catch (e) {
          // ignore
        }
      }
    }
    setBooks(newBooks);
    setIsBatchUpdating(false);
    showToast(`Toplu Kapak Taraması Tamamlandı! ${updatedCount} kitaba gerçek cilt kapağı giydirildi.`, 'success');
  };

  const handleToggleFavoritePoem = (poemId: string) => {
    setPoems((prev) =>
      prev.map((p) => (p.id === poemId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleAddPoem = (poemData: Omit<Poem, 'id' | 'addedAt'>) => {
    const newPoem: Poem = {
      ...poemData,
      id: 'poem-' + Date.now(),
      addedAt: new Date().toISOString(),
    };
    setPoems((prev) => [newPoem, ...prev]);
    showToast('Yeni şiir başarıyla külliyata eklendi.', 'success');
  };

  const handleEditPoem = (updatedPoem: Poem) => {
    setPoems((prev) =>
      prev.map((p) => (p.id === updatedPoem.id ? updatedPoem : p))
    );
    showToast('Şiir başarıyla güncellendi.', 'success');
  };

  const handleDeletePoem = (poemId: string) => {
    setPoems((prev) => prev.filter((p) => p.id !== poemId));
    showToast('Şiir silindi.', 'info');
  };

  // Hydration state to prevent initial mount overwrite
  const [isHydrated, setIsHydrated] = useState(false);

  // Initial IndexedDB hydration
  useEffect(() => {
    let isMounted = true;
    dbService.initDatabase().then((dbState) => {
      if (!isMounted) return;
      if (dbState.books && dbState.books.length > 0) {
        setBooks(dbState.books);
      }
      if (dbState.poems && dbState.poems.length > 0) {
        setPoems(dbState.poems);
      }
      if (dbState.quotes && dbState.quotes.length > 0) {
        setQuotes(dbState.quotes);
      }
      if (dbState.loans) {
        setLoans(dbState.loans);
      }
      if (dbState.goal) {
        setGoal(dbState.goal);
      }
      if (dbState.profile) {
        setProfile(dbState.profile);
      }
      setIsHydrated(true);
    }).catch(err => {
      console.warn('Database initialization warning:', err);
      setIsHydrated(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to persistence ONLY after hydration is complete
  useEffect(() => {
    if (!isHydrated) return;
    saveStoredBooks(books);
  }, [books, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveStoredPoems(poems);
  }, [poems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveStoredQuotes(quotes);
  }, [quotes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveStoredLoans(loans);
  }, [loans, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveStoredGoal(goal);
  }, [goal, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveStoredProfile(profile);
  }, [profile, isHydrated]);


  // Unique shelves list
  const existingShelves = useMemo(() => {
    const s = new Set<string>();
    books.forEach((b) => {
      if (b.shelf) s.add(b.shelf);
    });
    return Array.from(s);
  }, [books]);

  // Book Handlers
  const handleSaveBook = (bookData: Omit<Book, 'id' | 'addedAt'> | Book) => {
    if ('id' in bookData && bookData.id) {
      // Update existing
      setBooks((prev) =>
        prev.map((b) => (b.id === bookData.id ? (bookData as Book) : b))
      );
      if (selectedBookForDetail?.id === bookData.id) {
        setSelectedBookForDetail(bookData as Book);
      }
    } else {
      // Create new
      const newBook: Book = {
        ...bookData,
        id: 'book-' + Date.now(),
        addedAt: new Date().toISOString(),
      };
      setBooks((prev) => [newBook, ...prev]);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (selectedBookForDetail?.id === bookId) {
      setSelectedBookForDetail(null);
    }
  };

  const handleQuickProgress = (bookId: string, newPage: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const isFinished = newPage >= b.pageCount && b.pageCount > 0;
        return {
          ...b,
          currentPage: newPage,
          status: isFinished ? 'completed' : b.status === 'want_to_read' ? 'reading' : b.status,
          finishDate: isFinished && !b.finishDate ? new Date().toISOString().slice(0, 10) : b.finishDate,
        };
      })
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  const handleStatusChange = (bookId: string, status: ReadingStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        let newPage = b.currentPage;
        if (status === 'completed') newPage = b.pageCount;
        return {
          ...b,
          status,
          currentPage: newPage,
          finishDate: status === 'completed' && !b.finishDate ? new Date().toISOString().slice(0, 10) : b.finishDate,
        };
      })
    );
  };

  // Loans Handlers
  const handleAddLoan = (loanData: Omit<LoanRecord, 'id'>) => {
    const newLoan: LoanRecord = {
      ...loanData,
      id: 'loan-' + Date.now(),
    };
    setLoans((prev) => [newLoan, ...prev]);
  };

  const handleReturnLoan = (loanId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, isReturned: true, returnedDate: today } : l))
    );
  };

  const handleDeleteLoan = (loanId: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== loanId));
  };

  // Quotes Handlers
  const handleToggleFavoriteQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, isFavorite: !q.isFavorite } : q))
    );
  };

  const handleAddQuote = (quoteData: Omit<Quote, 'id' | 'createdAt'>) => {
    const newQuote: Quote = {
      ...quoteData,
      id: 'quote-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);
    showToast('Alıntı başarıyla kaydedildi.', 'success');
  };

  const handleEditQuote = (updatedQuote: Quote) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === updatedQuote.id ? updatedQuote : q))
    );
    showToast('Alıntı güncellendi.', 'success');
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    showToast('Alıntı silindi.', 'info');
  };

  // Import JSON backup with validation and preview
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = validateAndParseBackup(text, books);

        setImportValidation(result.validation);
        setPendingParsedData({
          books: result.normalizedBooks,
          poems: result.normalizedPoems,
          quotes: result.normalizedQuotes,
          loans: result.normalizedLoans,
          goal: result.normalizedGoal,
          profile: result.normalizedProfile,
        });
        setIsImportModalOpen(true);
      } catch (err: any) {
        showToast('Yedek dosyası okunamadı: ' + (err.message || 'Bilinmeyen hata'), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmMergeImport = () => {
    if (!pendingParsedData) return;

    // 1. Take safety snapshot
    createSafetyBackupSnapshot(books, poems, quotes, loans, goal, profile);
    setHasSafetySnapshot(true);

    // 2. Deduplicate books
    const existingIdSet = new Set(books.map((b) => b.id));
    const existingTitleAuthorSet = new Set(
      books.map((b) => (b.title || '').trim().toLowerCase() + '___' + (b.author || '').trim().toLowerCase())
    );

    const newBooksToAdd: Book[] = [];
    pendingParsedData.books.forEach((b) => {
      const key = (b.title || '').trim().toLowerCase() + '___' + (b.author || '').trim().toLowerCase();
      if (!existingIdSet.has(b.id) && !existingTitleAuthorSet.has(key)) {
        newBooksToAdd.push(b);
      }
    });

    setBooks((prev) => [...newBooksToAdd, ...prev]);

    // Merge quotes
    const existingQuoteTexts = new Set(quotes.map((q) => q.quoteText.trim()));
    const newQuotesToAdd = pendingParsedData.quotes.filter((q) => !existingQuoteTexts.has(q.quoteText.trim()));
    if (newQuotesToAdd.length > 0) {
      setQuotes((prev) => [...prev, ...newQuotesToAdd]);
    }

    // Merge poems
    const existingPoemTitles = new Set(poems.map((p) => p.title.trim().toLowerCase()));
    const newPoemsToAdd = pendingParsedData.poems.filter((p) => !existingPoemTitles.has(p.title.trim().toLowerCase()));
    if (newPoemsToAdd.length > 0) {
      setPoems((prev) => [...prev, ...newPoemsToAdd]);
    }

    setIsImportModalOpen(false);
    setPendingParsedData(null);
    setImportValidation(null);
    showToast(`Yedek başarıyla birleştirildi! ${newBooksToAdd.length} yeni kitap eklendi.`, 'success');
  };

  const handleConfirmReplaceImport = () => {
    if (!pendingParsedData) return;

    // 1. Take safety snapshot
    createSafetyBackupSnapshot(books, poems, quotes, loans, goal, profile);
    setHasSafetySnapshot(true);

    // 2. Replace state
    setBooks(pendingParsedData.books);
    if (pendingParsedData.poems.length > 0) {
      setPoems(pendingParsedData.poems);
    }
    if (pendingParsedData.quotes.length > 0) {
      setQuotes(pendingParsedData.quotes);
    }
    if (pendingParsedData.loans.length > 0) {
      setLoans(pendingParsedData.loans);
    }
    if (pendingParsedData.goal) {
      setGoal(pendingParsedData.goal);
    }
    if (pendingParsedData.profile) {
      setProfile(pendingParsedData.profile);
    }

    setIsImportModalOpen(false);
    setPendingParsedData(null);
    setImportValidation(null);
    showToast(`Yedek eksiksiz geri yüklendi! Toplam ${pendingParsedData.books.length} kitap kütüphaneye aktarıldı.`, 'success');
  };

  const handleRestoreSafetySnapshot = () => {
    const snapshot = getSafetyBackupSnapshot();
    if (!snapshot) {
      showToast('Kayıtlı güvenlik yedeği bulunamadı.', 'error');
      return;
    }
    setIsRestoreConfirmOpen(true);
  };

  const handleExecuteRestoreSnapshot = () => {
    const snapshot = getSafetyBackupSnapshot();
    if (!snapshot) {
      showToast('Kayıtlı güvenlik yedeği bulunamadı.', 'error');
      setIsRestoreConfirmOpen(false);
      return;
    }

    setBooks(snapshot.books);
    if (snapshot.poems) setPoems(snapshot.poems);
    if (snapshot.quotes) setQuotes(snapshot.quotes);
    if (snapshot.loans) setLoans(snapshot.loans);
    if (snapshot.goal) setGoal(snapshot.goal);
    if (snapshot.profile) setProfile(snapshot.profile);
    setIsRestoreConfirmOpen(false);
    setIsImportModalOpen(false);
    showToast('Güvenlik yedeği başarıyla geri yüklendi!', 'success');
  };


  // Filtered & Sorted books for Library Tab
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.genre?.toLowerCase().includes(q) ||
          book.isbn?.includes(q);

        // Status
        let matchesStatus = true;
        if (selectedStatusFilter === 'favorites') {
          matchesStatus = !!book.isFavorite;
        } else if (selectedStatusFilter === 'loaned') {
          matchesStatus = loans.some((l) => l.bookId === book.id && !l.isReturned);
        } else if (selectedStatusFilter !== 'all') {
          matchesStatus = book.status === selectedStatusFilter;
        }

        // Shelf
        const matchesShelf =
          selectedShelfFilter === 'all' || book.shelf === selectedShelfFilter;

        return matchesQuery && matchesStatus && matchesShelf;
      })
      .sort((a, b) => {
        if (sortBy === 'title_asc') return a.title.localeCompare(b.title, 'tr');
        if (sortBy === 'author_asc') return a.author.localeCompare(b.author, 'tr');
        if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'pages_desc') return b.pageCount - a.pageCount;
        if (sortBy === 'progress_desc') {
          const pA = a.pageCount > 0 ? a.currentPage / a.pageCount : 0;
          const pB = b.pageCount > 0 ? b.currentPage / b.pageCount : 0;
          return pB - pA;
        }
        // date_desc default
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
  }, [books, searchQuery, selectedStatusFilter, selectedShelfFilter, sortBy, loans]);

  // Currently reading books count
  const recoverableCompletedBooks = INITIAL_BOOKS.filter((b) => b.status === 'completed' && !books.some((existing) => existing.id === b.id));
  const recoverCompletedBooks = () => {
    if (!window.confirm(`${recoverableCompletedBooks.length} eksik okunmuş kitap eklenecek. Mevcut kitaplar değiştirilmeyecek. Devam edilsin mi?`)) return;
    const additions = recoverableCompletedBooks;
    setBooks((prev) => {
      const known = new Set(prev.map((b) => b.id));
      return [...prev, ...additions.filter((b) => !known.has(b.id))];
    });
    showToast(`${additions.length} okunmuş kitap geri eklendi.`, 'success');
  };
  const readingCount = books.filter((b) => b.status === 'reading').length;
  const completedCount = books.filter((b) => b.status === 'completed').length;
  const wantToReadCount = books.filter((b) => b.status === 'want_to_read').length;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0a0f1d] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex flex-col font-sans selection:bg-rose-900/20 selection:text-rose-800 transition-colors duration-200`}>
      {/* Hidden file input for backup imports triggered anywhere */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportBackup}
        className="hidden"
      />

      {/* Navigation Header & Mobile Bottom Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingBook(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenAddPoem={handleOpenAddPoem}
        onOpenAddQuote={handleOpenAddQuote}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.isRead).length}
        onExport={() => exportLibraryAsJson(books, quotes, loans, goal, poems, profile)}
        onImport={handleImportBackup}
        totalBooksCount={books.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {/* Tab 1: Bugün (Daily progress, 40-page goal, active reading, inspirations) */}
        {activeTab === 'today' && (
          <TodayView
            books={books}
            poems={poems}
            quotes={quotes}
            goal={goal}
            profile={profile}
            onQuickProgress={handleQuickProgress}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Tab: Kur'an-ı Kerim */}
        {activeTab === 'kuran' && <QuranReaderView />}

        {/* Tab 2: Kütüphanem (Main 304+ archive books, filters, search, shelves) */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Top Quick Status Pill Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  onClick={() => setSelectedStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStatusFilter === 'all'
                      ? 'bg-rose-700 text-white shadow-xs border border-rose-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Tümü ({books.length})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('reading')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStatusFilter === 'reading'
                      ? 'bg-rose-700 text-white shadow-xs border border-rose-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Okunuyor ({readingCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('completed')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStatusFilter === 'completed'
                      ? 'bg-sky-600 text-white shadow-xs border border-sky-500'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Okundu ({completedCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('want_to_read')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStatusFilter === 'want_to_read'
                      ? 'bg-sky-700 text-white shadow-xs border border-sky-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Okunacak ({wantToReadCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('favorites')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                    selectedStatusFilter === 'favorites'
                      ? 'bg-rose-600 text-white shadow-xs border border-rose-500'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className="w-3 h-3 fill-current" />
                  Favoriler
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('loaned')}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedStatusFilter === 'loaned'
                      ? 'bg-sky-900 text-sky-100 border border-sky-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Ödünçte Olanlar
                </button>
              </div>

              {/* View switch */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-rose-700 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                  title="Kart Görünümü"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-rose-900 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                  title="Liste Görünümü"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Batch Auto Cover Update Button */}
              <button
                onClick={handleBatchAutoCoverUpdate}
                disabled={isBatchUpdating}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isBatchUpdating ? 'Kapaklar Taranıyor...' : '✨ Toplu Kapakları Otomatik Giydir'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Kitap adı, yazar, tür veya ISBN ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 shadow-2xs"
                />
              </div>

              {/* Shelf Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedShelfFilter}
                  onChange={(e) => setSelectedShelfFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                >
                  <option value="all">Tüm Raflar</option>
                  {existingShelves.map((sh) => (
                    <option key={sh} value={sh}>
                      {sh}
                    </option>
                  ))}
                </select>

                {/* Sort Order */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                >
                  <option value="date_desc">Son Eklenen</option>
                  <option value="title_asc">Kitap Adı (A-Z)</option>
                  <option value="author_asc">Yazar Adı (A-Z)</option>
                  <option value="rating_desc">En Yüksek Puan</option>
                  <option value="progress_desc">Okuma İlerlemesi</option>
                  <option value="pages_desc">Sayfa Sayısı</option>
                </select>
              </div>
            </div>

            {/* Books Display */}
            {filteredBooks.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center max-w-lg mx-auto mt-6">
                <BookOpen className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                <h3 className="font-serif-literary text-lg font-bold text-stone-800 dark:text-stone-200">
                  Kitap Bulunamadı
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {searchQuery || selectedStatusFilter !== 'all' || selectedShelfFilter !== 'all'
                    ? 'Arama ve filtre kriterlerinize uygun kitap bulunamadı.'
                    : 'Kütüphanenizde henüz kitap bulunmuyor.'}
                </p>
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setIsAddEditModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  İlk Kitabınızı Ekleyin
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={(b) => setSelectedBookForDetail(b)}
                    onQuickProgress={handleQuickProgress}
                    onToggleFavorite={handleToggleFavorite}
                    onStatusChange={handleStatusChange}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={(b) => setSelectedBookForDetail(b)}
                    onQuickProgress={handleQuickProgress}
                    onToggleFavorite={handleToggleFavorite}
                    onStatusChange={handleStatusChange}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Keşfet (İlim Yolculuğum 4 yıllık müfredat, 16 Disiplin Önerileri, Şiir Deryası, Alıntılar) */}
        {activeTab === 'explore' && (
          <ExploreView
            books={books}
            poems={poems}
            quotes={quotes}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
            onAddBook={handleSaveBook}
            onToggleFavoritePoem={handleToggleFavoritePoem}
            onToggleFavoriteQuote={handleToggleFavoriteQuote}
            onAddQuote={handleAddQuote}
            onEditQuote={handleEditQuote}
            onDeleteQuote={handleDeleteQuote}
            onAddPoem={handleAddPoem}
            onEditPoem={handleEditPoem}
            onDeletePoem={handleDeletePoem}
            activeSubTab={exploreSubTab}
            onSubTabChange={(st) => setExploreSubTab(st)}
            autoOpenPoemForm={autoOpenPoemForm}
            autoOpenQuoteForm={autoOpenQuoteForm}
            onResetAutoOpen={() => {
              setAutoOpenPoemForm(false);
              setAutoOpenQuoteForm(false);
            }}
          />
        )}

        {/* Tab 4: Arşiv (2021-2026 Yıl -> Ay -> Kitaplar Hiyerarşisi & İstatistikler) */}
        {activeTab === 'archive' && (
          <ArchiveView
            books={books}
            onSelectBook={(b) => setSelectedBookForDetail(b)}
          />
        )}

        {/* Tab 5: Profil (Ahmet / Münzevi, Okuma Özeti, Güvenli Yedekleme & Bulut Eşitleme) */}
        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            books={books}
            poems={poems}
            quotes={quotes}
            loans={loans}
            goal={goal}
            onUpdateProfile={setProfile}
            onMergeCloudData={(data) => { setBooks(data.books); setPoems(data.poems); setQuotes(data.quotes); setLoans(data.loans); }}
            onBulkUpdateCovers={(updates) => setBooks(prev => prev.map(book => {
              const update = updates.find(item => item.id === book.id);
              return update ? { ...book, coverUrl: update.coverUrl, coverSource: update.coverSource } : book;
            }))}
            onRecoverCompletedBooks={recoverCompletedBooks}
            recoverableCompletedCount={recoverableCompletedBooks.length}
            onImportBackupClick={() => hiddenFileInputRef.current?.click()}
            onRestoreSnapshot={handleRestoreSafetySnapshot}
            hasSafetySnapshot={hasSafetySnapshot}
          />
        )}
      </main>

      {/* Modals */}
      <BookDetailModal
        book={selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onEdit={(book) => {
          setSelectedBookForDetail(null);
          setEditingBook(book);
          setIsAddEditModalOpen(true);
        }}
        onDelete={handleDeleteBook}
        onUpdateBook={(updated) => {
          handleSaveBook(updated);
          setSelectedBookForDetail(updated);
        }}
        onLendBook={(_book) => {
          setSelectedBookForDetail(null);
          setSelectedStatusFilter('loaned');
          setActiveTab('library');
        }}
        onAddQuoteForBook={(_book) => {
          handleOpenAddQuote();
        }}
        onAddQuote={handleAddQuote}
        activeLoan={loans.find((l) => l.bookId === selectedBookForDetail?.id && !l.isReturned)}
        bookQuotes={quotes.filter((q) => q.bookId === selectedBookForDetail?.id || q.bookTitle === selectedBookForDetail?.title)}
      />

      <BookFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        editingBook={editingBook}
        existingShelves={existingShelves}
      />

      <BackupImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setPendingParsedData(null);
          setImportValidation(null);
        }}
        validation={importValidation}
        onConfirmMerge={handleConfirmMergeImport}
        onConfirmReplace={handleConfirmReplaceImport}
        onRestoreSnapshot={handleRestoreSafetySnapshot}
        hasSafetySnapshot={hasSafetySnapshot}
      />

      {/* Safety Snapshot Restore Confirmation Dialog */}
      {isRestoreConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-literary text-base font-bold text-stone-900 dark:text-stone-100">
                  Güvenlik Yedeğini Geri Yükle
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Önceki durum geri yüklenecektir
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Önceki güvenlik yedeğini geri yüklemek istediğinize emin misiniz? Mevcut kütüphane verileriniz, son yedek anındaki haline dönecektir.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRestoreConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteRestoreSnapshot}
                className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Evet, Geri Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onClearAll={handleClearAllNotifications}
        onTriggerTestNotification={handleTriggerTestNotification}
      />

      {/* Floating In-App Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700'
                : toast.type === 'info'
                ? 'bg-stone-900/95 text-white border-stone-700'
                : 'bg-emerald-900/95 text-white border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-stone-300 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
