# V21 – Atomik bulut kaydı güvenlik geliştirmesi

Önce mevcut uygulamadan JSON yedeği alın. Supabase SQL Editor içinde SUPABASE_V21_GUVENLI_ESITLEME.sql çalıştırın. Mevcut SUPABASE_KURULUM.sql içindeki kullanıcıya özel RLS politikalarının daha önce kurulmuş olması gerekir. Sonra kaynak projeyi Netlify GitHub build ile yayınlayın.

## Gerçekte yapılan
- Önceki sürümdeki zaman damgasına dayalı PATCH işlemi yerine tek bir SQL fonksiyonuyla atomik compare-and-swap yazma işlemi eklendi.
- Aynı anda iki cihazdan gelen yazıların birbirini sessizce ezmesi engellendi.
- Private storage bucket ve kullanıcı klasörü RLS kuralları sağlandı.

## Henüz eksik / test edilemedi
- Otomatik arka plan senkronizasyonu, kayıt bazlı tombstone/silme, PDF/EPUB dosyalarını başka cihazda signed URL ile açma, cihaz yerel blob verilerinin taşınması, şiir ve okuyucu son konumlarının eksiksiz senkronizasyonu.
- Üretim derlemesi doğrulanamadı: bu ortamda node_modules bağımlılıkları kurulu değildi; npm ci başarısız oldu.
- Canlı Supabase oturumu, SQL ve RLS test edilmedi.
Bu paket tüm istenen özellikleri tamamlayan nihai sürüm değildir. Çalışan sürümü değiştirmeden önce test ortamında deneyin.
