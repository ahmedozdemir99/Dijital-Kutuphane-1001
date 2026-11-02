# Kütüphanem V16

- Kapak yönetimi Profil'de açılır panel hâline getirildi; tarama mevcut kapakları korur. Google Books için ikinci, daha geniş arama eklendi.
- Supabase e-posta/şifre oturumu ve **elle bulut JSON yedeği yükleme/indirme** eklendi. Bu otomatik çift yönlü eşitleme değildir. İndirme yerel kayıtları değiştirmez.
- Supabase SQL Editor'de `SUPABASE_KURULUM.sql` çalıştırılmalıdır. Supabase Auth e-posta sağlayıcısı açık olmalıdır.
- Netlify Environment Variables içinde `GEMINI_API_KEY` tanımlanmalı ve yeniden deploy edilmelidir. Anahtar ZIP içine konulmaz. API kotası ve doğrulaması canlı ortamda test edilmelidir.
- PDF/EPUB dosyaları bulut JSON yedeğiyle otomatik depolanmaz. Mevcut cihaz yedeğini ayrıca saklayın.
- Bu paket Netlify GitHub build içindir: `npm run build`, publish `dist`, functions `netlify/functions`.
