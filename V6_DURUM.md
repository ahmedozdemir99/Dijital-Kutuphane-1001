# V6 — Gerçekleşen ve bekleyen işler

## Yapılan
- Mevcut kullanıcı veritabanında daha önce yüklenmiş 251 şiir varsa, yeni paketle gelen eksik şiirler yalnızca ID bazında eklenir. Kullanıcının düzenlediği şiirler ve favoriler korunur.
- Kur’an okuyucunun PDF henüz açılmadan 604 sayfayı kesin belge sayısı gibi göstermesi düzeltildi. Gerçek PDF sayfa sayısı açılışta okunur.
- V5 kaynak kodu, kişisel veriler ve 40 yıllık katalog muhafaza edildi.

## Tamamlanmamış ve dış servis/cihaz gerektiren işler
- 1.024 eserin tamamının gerçek, doğru baskı kapağını doğrulamak ve kalıcı depolamak.
- Supabase projesi, kimlik doğrulama, RLS, bulut depolama ve güvenli iki yönlü senkronizasyon. Sadece URL/anahtar kaydetmek senkronizasyon değildir.
- Katalogdaki 16 kategoriye bibliyografik olarak doğru dağılım ve 480 ayın özgün kitaplarla doldurulması.
- Gerçek Android/iOS tarayıcı testleri.
- npm bağımlılık kurulumu zaman aşımına uğradığı için başarılı üretim derlemesi doğrulanamadı.

## Netlify
- GitHub bağlantılı dağıtımda `npm run build` ve `dist` kullanılır.
- Kaynak proje doğrudan derlenmiş `dist` paketi değildir.
