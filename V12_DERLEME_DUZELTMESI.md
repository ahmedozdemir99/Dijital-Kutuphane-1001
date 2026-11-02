# V12 Netlify derleme düzeltmesi

Netlify kaydındaki `src/main.tsx(12,17): TS2339 Property env does not exist on type ImportMeta` hatasını çözmek için `src/vite-env.d.ts` eklendi. Bu dosya `vite/client` tiplerini TypeScript projesine tanıtır.

Netlify: `npm run build`, yayın dizini `dist`, fonksiyonlar `netlify/functions`. Gemini anahtarını yalnızca Netlify ortam değişkenlerinde tutun.

Bu ZIP dosyasının bütünlüğü doğrulanmıştır. Gerçek npm/Netlify derlemesi bu ortamda henüz doğrulanmamıştır.
