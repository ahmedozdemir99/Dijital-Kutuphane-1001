# V13: Okunmuş kitapları kurtarma ve Gemini kapak araması

- Kaynak katalog: 409 kitap, bunların 304 tanesi `completed` durumunda.
- Profil ekranında, başlangıç kataloğundaki okunmuş kitaplar cihaz veritabanında yoksa isteğe bağlı "Eksik okunmuş kayıtları geri ekle" seçeneği görünür.
- Mevcut kayıtlar, durumlar, notlar ve kapaklar değiştirilmez; sadece eksik **ID**'ler eklenir. Daha önce bilerek silinmiş başlangıç kitapları da bu işlemle geri gelir.
- Kitaplar başka cihazda / farklı tarayıcıda kayıtlıysa otomatik eşitlenmez; ilgili cihazdan JSON yedeği aktarılmalıdır.
- Gemini kapak tarama: Profil > Kitap kapaklarını otomatik tamamla > Gemini ile kapakları tamamla. Netlify ortam değişkeni GEMINI_API_KEY gerektirir.
- Netlify fonksiyonu Google Books ile eşleştirir; doğrudan Google Görseller toplu indirme API'si değildir.
- ZIP yapısı kontrol edildi; canlı Gemini ve Netlify derleme testi bu ortamda yapılmadı.
