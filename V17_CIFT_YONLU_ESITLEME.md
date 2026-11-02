# V17 Çift Yönlü Eşitleme
Profil > Güvenli eşitleme > Giriş Yap > Çift Yönlü Eşitle.

- Önce yerel JSON yedeğinizi indirin.
- Bulutta `SUPABASE_KURULUM.sql` ile oluşturulan `library_backups` tablosu gerekir.
- Kayıtlar ID bazında birleştirilir. Yerel ve bulut tarafında aynı ID farklı içerikteyse güvenlik için işlem durur; hiçbir kayıt otomatik ezilmez.
- Sunucu eşzamanlı değişmişse işlem durur.
- PDF/EPUB dosya içerikleri bu eşitlemeye dahil değildir.
- Bu sürümde eşitleme kullanıcı düğmesiyle başlatılır, arka planda otomatik eşitleme değildir.
- Bulut bağlantısı ve canlı üretim derlemesi bu ortamda test edilemedi.
