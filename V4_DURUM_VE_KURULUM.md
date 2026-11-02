# V4 — Durum ve kurulum

## Bu sürümde yapılanlar
- PWA manifest, ikon ve servis çalışanı eklendi. Servis çalışanı yalnızca aynı kökendeki uygulama kabuğu ve statik varlıkları önbelleğe alır; kişisel PDF/EPUB ve API yanıtlarını önbelleğe almaz. İlk çevrimdışı kullanım için uygulama en az bir kez çevrimiçi açılmalıdır.
- Supabase ayar ekranının gerçek eşitleme yapıyormuş gibi görünmesi engellendi. Bağlantı bilgisi kaydetmek, iki yönlü eşitleme değildir.
- Koyu tema giriş alanları, yer tutucu yazılar ve klavye odağı için erişilebilirlik düzenlemeleri eklendi.
- Önceki V3 katalog, şiir, poster ve Kur'an okuyucu kodları korundu.

## Doğrulanmamış / eksik
- Kaynakta 251 şiir var; 256 sayısına ulaşmak için telif ve eser doğrulaması yapılmış 5 şiir gereklidir. Sayıyı doldurmak amacıyla uydurma şiir eklenmedi.
- 1024 eserin tüm gerçek baskı kapakları tek tek doğrulanmadı. Yer tutucu tipografik kapak, gerçek baskı kapağı değildir.
- 16 kategoriye dağıtımın doğruluğu ve 40 yılın 480 ayının tamamında özgün eser bulunması garanti edilmez.
- Gerçek Supabase Auth, RLS, çatışma çözümü ve iki cihaz eşitlemesi kurulmadı; kullanıcı Supabase projesi ve güvenli kurulum gerektirir.
- Uçtan uca Android/iOS testi ve üretim derlemesi doğrulanamadı (npm bağımlılık indirmesi bu ortamda zaman aşımına uğradı).

## Netlify
Kaynak klasörü kökünden `npm install` ve `npm run build`; yayın klasörü `dist`. Netlify Git deposu üzerinden otomatik derleyebilir. Bu ZIP'i doğrudan statik site olarak sürükleyip bırakmak React kaynak kodunu derlemez.

## Veri güvenliği
Kişisel JSON yedekleri yayın paketine eklenmedi. Eski yedekleri ayrı ve güvenli saklayın. Mevcut uygulamanın üzerine test etmeden geçmeyin.
