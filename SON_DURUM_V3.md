# Dijital Kütüphanem — V3 durum ve doğrulama

Bu paket önceki V2 kaynaklarının üzerine geliştirilmiştir; **tüm gereksinimleri tamamlanmış nihai sürüm değildir**.

## Gerçekten değiştirilenler
- 40 yıllık 1.024 eserlik katalog, İlim Yolculuğum sayfasına arama, 16 kategorilik sınıflandırma ve yıl/ay seçimiyle bağlandı.
- 16 kategori başlığı var; kaynak 12 kategoriden geldiği için bazı başlıklarda sıfır kayıt olabilir. Otomatik konu ayrımı uzman doğrulamasına muhtaçtır.
- 480 ayın 224'ünde yeni özgün öneri olmadığı açıkça gösterilir; öneriler okunmuş sayılmaz.
- Günlük okuma sayacının daha önce kayıt yokken 14+16 okunmuş sayfa göstermesi giderildi; sıfırdan başlar.
- Önceki sürümdeki şiir posteri PNG indirme ve Kur'an PDF okuyucu değişiklikleri korunmuştur.

## Henüz tamamlanmayanlar
- 256 gerçek ve telifçe uygun şiir; eldeki 251 şiirin kaynak ve izin doğrulaması.
- 1.024 eserin gerçek baskı kapaklarının tamamı; otomatik eşleşmelerin tek tek doğrulanması.
- Kişisel arşiv yedeklerinin güvenli birleşiminin cihaz üzerinde uçtan uca testi.
- Supabase kimlik doğrulama, gerçek çift yönlü eşitleme, çatışma çözümü ve RLS kurulumu.
- PWA çevrimdışı çalışma, PDF/EPUB ve Kur'an okuyucunun tüm cihaz testleri.
- Üretim derlemesi: npm install bu çalışma ortamında zaman aşımına uğradı; `npm run build` doğrulanamadı.

## Yayın
Netlify: `npm run build` ve `dist`. Önce `npm install` sonra `npm run build` ile derleme doğrulanmalıdır. ZIP içindeki kullanıcı yedekleri Git deposuna gönderilmemelidir. Var olan çalışan sürümü ve yedekleri silmeyin.
