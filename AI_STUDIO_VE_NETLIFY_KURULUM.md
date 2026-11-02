# Dijital Kütüphanem — Google AI Studio ve Netlify

## Tek kaynak, iki platform
Bu proje React 18 + TypeScript + Vite 6'dır. Dosyaları proje köküne çıkarın. ZIP dosyasını `public` altına koymayın.

### Google AI Studio (Build)
1. AI Studio Build çalışma alanında mevcut projeyi içe aktarabileceğiniz bir dosya yükleme / kod düzenleme yöntemi varsa proje klasörünü aktarın.
2. Kaynak yapısını (`src`, `public`, `package.json`, `vite.config.ts`) koruyun. AI Studio sürümünüz ZIP içe aktarmayı desteklemiyorsa, ZIP'i yalnızca sohbet mesajına göndermek projeyi otomatik yayımlamaz.
3. Talimat olarak `AI_STUDIO_PROMPT.txt` içeriğini kullanın.
4. Ortamın sunduğu önizleme/yayın seçeneğini kullanın. Üretim derlemesi `npm run build` komutudur.

### Netlify
1. ZIP'i açın; kök dizin içeriğini GitHub deposuna yükleyin.
2. Netlify'da GitHub deposunu bağlayın. Build komutu: `npm run build`. Publish directory: `dist`.
3. `netlify.toml` SPA yönlendirmesini içerir.
4. Görüntüyü kapatan rozetin kaynağı Netlify'ın dağıtım ayarları, siteye gömülü üçüncü taraf kod veya başka bir katman olabilir. Bu ZIP herhangi bir Netlify rozetini kendisi eklemez; platformun eklediği katmanları koddan kaldırmayı garanti etmez.

### Gizlilik
- Eski AI Studio ekran görüntüleri, video kayıtları ve kişisel JSON yedeği `public/assets/aistudio` klasöründen çıkarıldı.
- Kullanıcıya ait kitaplar ve okumalar uygulama verisinden otomatik silinmez; cihazdaki IndexedDB bu ZIP'in içinde bulunmaz.
- `VITE_` ile başlayan ortam değişkenleri istemciye açıktır. Supabase service-role anahtarını bu alana koymayın.
- Supabase canlı eşitleme ve tüm gerçek kitap kapaklarının doğrulanması henüz tamamlanmış değildir.

### Test sınırı
ZIP bütünlüğü doğrulanmıştır. Bu pakette üretim derlemesi veya telefon tarayıcısı testi yapılmış değildir. Eski çalışan sürüm ve JSON yedeklerini koruyun.
