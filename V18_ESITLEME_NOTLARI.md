# V18 — Kitap, kapak ve okuma ilerlemesi eşitleme

Çift Yönlü Eşitle düğmesi aynı kimlikli kitapların kapak bağlantılarını, currentPage/lastReadPage, completed durumunu ve okuma tarihlerini birleştirir. Gerçek kapaklardan biri eksikse mevcut olanı korur. İki farklı gerçek kapak bulunduğunda kullanıcı verisini riske atmamak için eşitleme durur. İlerleme sayfası için daha ileri sayfa tercih edilir; geriye dönük kasıtlı sıfırlama otomatik yansıtılmaz. Farklı kimliklerle kaydedilen aynı kitaplar otomatik birleştirilmez.

Bu sürüm PDF/EPUB dosya içeriklerini Supabase Storage'a yüklemez. Kapakların URL'leri eşitlenir; geçici blob URL'leri cihazlar arasında çalışmaz. Yerel base64 kapaklar yedek boyutunu büyütebilir. İlk eşitlemeden önce JSON yedeği alın. SQL tablosu ve kullanıcı hesabı V16 kurulumuyla aynıdır.

Canlı Supabase ve Netlify dağıtımı test edilmemiştir; üretim derlemesi bu ortamda bağımlılıklar bulunmadığından doğrulanamadı.
