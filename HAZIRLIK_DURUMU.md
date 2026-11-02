# Dijital Kütüphanem – geliştirme durumu

Bu ZIP, yüklenen orijinal React/TypeScript/Vite projesinin korunmuş ve kısmen geliştirilmiş kaynak paketidir; tam kabul testinden geçmiş sürüm değildir.

## Uygulanan
- Şiir paylaşım penceresine gerçek PNG poster indirme işlemi eklendi. Uzun şiirler poster boyutuna göre kısaltılır.
- Netlify build ve SPA yönlendirme yapılandırması eklendi.
- 40 yıllık 1024 öneri kataloğu `public/data/40-yillik-1024-oneri.json` içinde paketlendi; mevcut ekranda bu dosyanın tam entegrasyonu ayrıca gereklidir.
- 2 kişisel JSON yedeği `kullanici_yedegi` içinde korundu. Güvenlik için otomatik olarak mevcut kullanıcı verisinin üzerine yazılmaz.

## Henüz doğrulanmamış / eksik
- 16 kategori: mevcut öneri dosyasında 12 kategori var. 16'ya yeniden sınıflama ve 40 yıla dengeli dağılım yapılmadı.
- Son yedekte 251 şiir var; 256 gerçek, izinli şiir doğrulanıp eklenmedi.
- 1024 eserin tümünün gerçek baskı kapağı doğrulanıp indirilmedi.
- Supabase ile gerçek iki yönlü eşitleme, PWA, tüm okuyucu işlevleri ve cihazlar arası testler tamamlanmadı.
- `npm run build` bağımlılık kurulumu ortamda zaman aşımına uğradığı için doğrulanamadı.

## Kurulum
ZIP içeriğini tek proje klasörüne çıkarın. Node.js ortamında `npm install`, `npm run build` çalıştırın. Netlify: build command `npm run build`, publish `dist`. Yedekleri uygulamanın geri yükleme işlevi üzerinden dikkatlice birleştirin.
