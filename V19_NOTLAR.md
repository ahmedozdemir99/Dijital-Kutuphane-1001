# V19 – Güvenli dosya yükleme aşaması
- Kapak, PDF ve EPUB veri URI dosyaları özel Supabase Storage alanına aktarılır.
- Eski blob: bağlantıları taşınamaz; bunlar için kullanıcı dosyayı yeniden seçmelidir.
- Storage nesne yolu buluta kaydedilir; bu sürümde özel nesnelerin okuyucu içinde kimlik doğrulamalı indirilmesi **henüz uygulanmamıştır**.
- Otomatik arka plan eşitlemesi, alan bazlı çakışma çözümü, silme senkronizasyonu **henüz uygulanmamıştır**.
- Bu paket eksiksiz çift yönlü eşitleme olarak kabul edilmemelidir.
- SQL dosyasını çalıştırmadan dosya yüklemeyi denemeyin.
