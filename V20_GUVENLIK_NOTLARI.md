# V20 — Veri kaybını önleyen güvenlik düzeltmeleri

Bu sürüm **tam otomatik eşitleme değildir**. V19'un veri kaybına neden olabilecek üç davranışı düzeltildi:

1. Tarayıcıya özel `blob:` dosya bağlantıları bulut eşitlemesi sırasında sessizce silinmez; eşitleme hata vererek durur.
2. Farklı cihazlarda okuma sayfaları farklıysa, geçerli zaman damgası olmadan yüksek sayfa doğru kabul edilmez; çakışma bildirilir.
3. Yerel dosya bağlantısıyla bulut dosya bağlantısı çakışıyorsa kayıt sessizce değiştirilmez.

## Gerçek otomatik eşitleme için kalan gereksinimler
- Her kayıt için sürüm / updated_at / tombstone ve sunucu tarafı çakışma çözümü
- Kullanıcı oturumunun güvenli yenilenmesi ve cihazlar arasında otomatik tetikleme
- PDF/EPUB ve kapakların kalıcı dosya içeriği olarak yüklenip diğer cihazda güvenli indirilmesi
- Okuyucunun son sayfayı her değişiklikte kalıcı kaydetmesi
- Ağ kesintisi, eşzamanlı düzenleme ve silme senaryoları için uçtan uca test

**Canlı Supabase ile doğrulanmadı. Önce JSON yedeği alın.**
