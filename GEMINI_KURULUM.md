# Gemini destekli kapak arama — V11

- Netlify → Site configuration → Environment variables → `GEMINI_API_KEY` ekleyin. Anahtarı hiçbir zaman `VITE_` önekiyle veya `src/` içine koymayın.
- İsteğe bağlı `GEMINI_MODEL` (varsayılan `gemini-2.5-flash`). Kota ve fiyatlar Google hesabınıza bağlıdır.
- Netlify build: `npm run build`, publish: `dist`. `netlify/functions/ai-cover.mjs` otomatik sunucu fonksiyonudur.
- Profil → **Gemini ile kapakları tamamla** düğmesini kullanın. Gemini bibliyografik adları normalize eder, Google Books'tan yalnızca yüksek güvenli eşleşmeler kaydedilir.
- Google Görseller API'si bu sürüme dahil **değildir**. Google Programmable Search Engine kullanmak için ayrı API anahtarı ve arama motoru kimliği gerekir.
- Google AI Studio statik önizlemesi Netlify fonksiyonlarını çalıştırmaz; Gemini düğmesi için eşdeğer sunucu/ara katman gerekir. Normal Google Books/Open Library araması orada çalışabilir.
- Kişisel kütüphane kapaklarını tarar; 1024 öneri kitabının tamamı için henüz toplu tarama yoktur.
- Anahtarı sohbet içinde paylaşmayın. Kullanım kotalarına dikkat edin.
