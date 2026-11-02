# Güvenlik ve test notları

- Kur'an PDF dosyası artık Base64 yerine IndexedDB'de ayrı Blob olarak tutulur; sayfa ilerlemesi ayrı kaydedilir.
- PDF.js worker dosyası CDN yerine paketle birlikte sunulur; çevrimdışı çalışmaya daha uygundur.
- Mobilde PDF canvas piksel yoğunluğu sınırlandırılarak bellek taşması riski azaltıldı.
- Önceden örnek olarak işaretlenmiş Kur'an yer imleri kaldırıldı (mevcut kullanıcı yer imleri korunur).
- Kişisel yedekler kaynak ZIP içinde korunur fakat .gitignore ile Git'e eklenmeleri engellenir; herkese açık repoya veya Netlify public klasörüne yüklemeyin.
- 16 kategori, 256 doğrulanmış şiir, tüm kitapların doğrulanmış kapakları ve Supabase eşitleme henüz tamamlanmadı.
- Gerçek telefon, üretim derlemesi ve çevrimdışı kullanım kabul testleri ayrıca gereklidir.
