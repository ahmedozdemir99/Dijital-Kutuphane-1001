# V9 — Dağıtım ve kapak uyumluluğu

- Önceki yedeklerde bulunan `/api/covers/proxy?url=...` biçimindeki kapak adresleri, Netlify ve AI Studio'nun statik yayınında bulunmayan API'ye yöneliyordu. Görüntüleyen bileşenlerde gerçek http(s) adresi çözümleniyor; kayıtlı kitap ve yedekler değiştirilmedi.
- Geçersiz/tehlikeli şemalı kapak adresleri görüntüleme aşamasında reddediliyor.
- PWA servis çalışanı önbellek sürümü v9 olarak güncellendi; eski statik önbelleğin kalması azaltıldı.
- Dış sitelerin görsel bağlantısını engellemesi veya silmesi halinde gerçek kapağın görüntüleneceği garanti edilemez.
- Supabase kimlik doğrulama/eşitleme için kullanıcı projesi ve güvenli yapılandırma gereklidir; tamamlanmış sayılmaz.
- Bu paket kaynak projedir; npm bağımlılıkları kurulup üretim derlemesi yapılmalıdır.
