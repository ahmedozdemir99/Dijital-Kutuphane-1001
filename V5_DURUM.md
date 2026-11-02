# V5 — Gerçek durum

- Şiir kataloğu: 256 kayıt. Son 5 şiir **özgün yeni metindir**, tarihî şairlere atfedilmemiştir. Önceki 251 kaydın kaynak/telif doğrulaması yapılmamıştır.
- Yanlış yönlendiren yağmur ortam sesi bağlantısı bir şiir kaydından kaldırıldı.
- 40 yıllık katalog: 480 ay, 1024 öneri kaydı, 16 kategori başlığı. Kategori eşlemeleri ve bibliyografik bilgiler uzman doğrulaması gerektirir.
- Kitap kapakları: bütün 1024 eserin gerçek kapağı doğrulanmamıştır; kapaksız kayıtlar olabilir.
- Supabase çift yönlü eşitleme: çalışır uçtan uca uygulama olarak doğrulanmadı; yapılandırma ve canlı test gerekli.
- Kur'an PDF: kod var; Android/iOS cihaz testi yapılmadı.
- Derleme: npm install --offline başarısız oldu (npm önbelleğinde @tailwindcss/vite yok); üretim derlemesi **başarılı olarak doğrulanmadı**.
- Eski veriler silinmedi; önceki sürümün yedeğini koruyun.
- Bu kaynak ZIP'ini doğrudan Netlify Drop'a yüklemek yerine GitHub üzerinden Netlify build ile yayımlayın. Başarılı derleme ve cihaz testinden önce eski çalışan sürümü değiştirmeyin.
