import importlib.util, json, pathlib, re, collections
root=pathlib.Path('/mnt/data/work144')
spec=importlib.util.spec_from_file_location('author_data',root/'author_data.py'); mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
# Additional distinct works by established authors. Titles are editorial candidates, not popularity-verified.
extra={
'İmam Gazâlî':['el-İktisâd fi’l-İtikâd','el-Mustasfâ','el-Maksadü’l-Esnâ','Cevâhirü’l-Kur’ân','el-Kıstâsü’l-Müstakîm','Faysalü’t-Tefrika'],
'İbn Arabî':['Ankâü Muğrib','İnşâü’d-Devâir','Kitâbü’l-İsrâ','Mevâkiu’n-Nücûm'],
'Ferîdüddin Attâr':['Musîbetnâme','Pendnâme','Hüsrevnâme','Muhtarnâme'],
'Nurettin Topçu':['İradenin Davası','Kültür ve Medeniyet','Mevlâna ve Tasavvuf','Bergson','Millet Mistikleri'],
'Orhan Pamuk':['Kırmızı Saçlı Kadın','Kafamda Bir Tuhaflık','Veba Geceleri','Öteki Renkler','İstanbul: Hatıralar ve Şehir','Manzaradan Parçalar'],
'Yaşar Kemal':['Ölmez Otu','Demirciler Çarşısı Cinayeti','Yusufçuk Yusuf','Yılanı Öldürseler','Fırat Suyu Kan Akıyor Baksana','Kuşlar da Gitti'],
'Sabahattin Ali':['Yeni Dünya','Sırça Köşk','Markopaşa Yazıları','Bütün Şiirleri'],
'Ahmet Hamdi Tanpınar':['Yaşadığım Gibi','Edebiyat Üzerine Makaleler','XIX. Asır Türk Edebiyatı Tarihi','Şiirler'],
'Peyami Safa':['Cingöz Recai','Mahşer','Canan','Biz İnsanlar','Şimşek'],
'Reşat Nuri Güntekin':['Akşam Güneşi','Eski Hastalık','Damga','Bir Kadın Düşmanı','Son Sığınak'],
'Oğuz Atay':['Oyunlarla Yaşayanlar','Eylembilim'],
'İskender Pala':['İki Dirhem Bir Çekirdek','Kahve Molası','Mihmandar','Karun ve Anarşist','Aşkname'],
'Dostoyevski':['Öteki','Ezilenler','Ebedî Koca','Bir Yufka Yürekli','Stepançikovo Köyü','Bir Yazarın Günlüğü'],
'Tolstoy':['Gençlik','İtiraflarım','Sanat Nedir?','Tanrı İçimizdedir','Efendi ile Uşağı','Kazaklar'],
'Victor Hugo':['Sefiller (Roman)'],
'Charles Dickens':['Nicholas Nickleby','Antikacı Dükkânı','Dombey ve Oğlu','Martin Chuzzlewit','Müşterek Dostumuz'],
'Stefan Zweig':['Dünün Dünyası','Montaigne','Marie Antoinette','Joseph Fouché','Macellan','İnsanlığın Yıldızının Parladığı Anlar'],
'Franz Kafka':['Bir Açlık Sanatçısı','Taşrada Düğün Hazırlıkları','Çin Seddi'],
'George Orwell':['Papazın Kızı','Wigan İskelesi Yolu','Neden Yazıyorum','Balinanın Karnında'],
'Albert Camus':['İlk Adam','Sürgün ve Krallık','Caligula','Tersi ve Yüzü','Düğün'],
'Hermann Hesse':['Peter Camenzind','Rosshalde','Knulp','Doğu Yolculuğu'],
'Jack London':['Kızıl Veba','Ay Vadisi','Adem’den Önce','Uçurum İnsanları','Büyük Evdeki Küçük Hanım'],
'Jules Verne':['Dünyanın Ucundaki Fener','İki Yıl Okul Tatili','On Beş Yaşında Bir Kaptan','Buzlar Arasında Bir Kış','Balonla Beş Hafta'],
'Agatha Christie':['Cinayet Alfabesi','Ölüm Oyunu','Briç Masasında Cinayet','Ölüm Adası','Üç Perdelik Cinayet','Kütüphanedeki Ceset'],
'Necip Fazıl Kısakürek':['Sahte Kahramanlar','Halkadan Pırıltılar','İman ve Aksiyon','Batı Tefekkürü ve İslam Tasavvufu','Büyük Doğu’ya Doğru','Esselâm'],
'Sezai Karakoç':['Edebiyat Yazıları I','Edebiyat Yazıları II','Fizikötesi Açısından Ufuklar ve Daha Ötesi','Çağ ve İlham','İslam Toplumunun Ekonomik Strüktürü'],
'Cemil Meriç':['Sosyoloji Notları ve Konferanslar','Saint-Simon İlk Sosyolog İlk Sosyalist','Işık Doğudan Gelir','Kültürden İrfana'],
'İsmet Özel':['Taşları Yemek Yasak','Zor Zamanda Konuşmak','Waldo Sen Neden Burada Değilsin','Tahrir Vazifeleri'],
'Platon':['Gorgias','Phaidros','Kriton','Menon','Protagoras','Theaitetos'],
'Aristoteles':['Retorik','Poetika','Fizik','Ruh Üzerine','Kategoriler'],
'Descartes':['Aklın Yönetimi İçin Kurallar','Dünyâ ya da Işık Üzerine İnceleme'],
'Friedrich Nietzsche':['Şen Bilim','İnsanca Pek İnsanca','Deccal','Ecce Homo','Tragedyanın Doğuşu'],
'Bertrand Russell':['Neden Hristiyan Değilim','Evlilik ve Ahlak','İktidar','İnsanlığın Yarını Var mı?'],
'Karl Popper':['Varsayımlar ve Çürütmeler','Nesnel Bilgi','Daha İyi Bir Dünya Arayışı'],
'İlber Ortaylı':['Osmanlı Barışı','Tarihin İzinde','Gazi Mustafa Kemal Atatürk','İnsan Geleceğini Nasıl Kurar?','Cumhuriyet’in İlk Sabahı'],
'Halil İnalcık':['Osmanlılar','Kuruluş Dönemi Osmanlı Sultanları','Rönesans Avrupası','Osmanlı Tarihinde İslamiyet ve Devlet'],
'Eric Hobsbawm':['Milletler ve Milliyetçilik','Eşkıyalar','Devrimciler','Sanayi ve İmparatorluk'],
'Yuval Noah Harari':['Sapiens: Grafik Tarih 1','Sapiens: Grafik Tarih 2'],
'Amin Maalouf':['Baldassare’nin Yolculuğu','Beatrice’den Sonra Birinci Yüzyıl','Çivisi Çıkmış Dünya','Empedokles’in Dostları'],
'Sigmund Freud':['Totem ve Tabu','Ben ve İd','Cinsellik Üzerine Üç Deneme','Musa ve Tektanrıcılık'],
'Carl Gustav Jung':['Kırmızı Kitap','Psikolojik Tipler','Bilinç ve Bilinçdışı','Modern İnsan Ruhunu Arıyor'],
'Erich Fromm':['Kendini Savunan İnsan','İtaatsizlik Üzerine','İnsan Olmak Üzerine','Sağlıklı Toplum'],
'Oliver Sacks':['Mars’ta Bir Antropolog','Renkleri Duyan Adam','Halüsinasyonlar','Görünür Dünya'],
'Richard Feynman':['Feynman Fizik Dersleri','Fizik Yasaları Üzerine','Eminim Şaka Yapıyorsunuz Bay Feynman','Başkalarının Ne Düşündüğünden Sana Ne'],
'Carl Sagan':['Kozmos','Soluk Mavi Nokta','Cennetin Ejderleri','Karanlık Bir Dünyada Bilimin Mum Işığı','Mesaj'],
'Stephen Hawking':['Zamanın Kısa Tarihi','Ceviz Kabuğundaki Evren','Büyük Tasarım','Kara Delikler ve Bebek Evrenler'],
'Isaac Asimov':['Vakıf','Vakıf ve İmparatorluk','İkinci Vakıf','Ben Robot','Çelik Mağaralar','Güneşin Tanrıları'],
}
entries=[]
for cat,raw in mod.D.items():
 for line in raw.splitlines():
  a,*books=line.split('|')
  existing={re.sub(r'[^\w]','',b).casefold() for b in books}
  for b in extra.get(a,[]):
   norm=re.sub(r'[^\w]','',b).casefold()
   if norm not in existing:books.append(b);existing.add(norm)
  entries.append({'category':cat,'author':a,'books':books})
assert len(entries)==144
p=root/'src/components/CurriculumJourneyView.tsx';s=p.read_text()
start=s.index('const AUTHOR_CATALOGUE: AuthorEntry[] = ')
end=s.index(';\nconst CATEGORY_NAMES',start)
s=s[:start]+'const AUTHOR_CATALOGUE: AuthorEntry[] = '+json.dumps(entries,ensure_ascii=False,indent=2)+s[end:]
# Ensure author cycle: a writer may contribute at most 4 in any appearance; if fewer, fill other weeks.
# Position counter should follow actual picked works; old duplicate skipping can stall. Track used by (author,title), not globally by title.
s=s.replace("const usedTitles = new Set<string>();", "const usedTitles = new Set<string>();")
s=s.replace("const normalized = (title: string) => title.toLocaleLowerCase('tr-TR').replace(/[^\\p{L}\\p{N}]/gu, '');", "const normalized = (title: string) => title.toLocaleLowerCase('tr-TR').replace(/[^\\p{L}\\p{N}]/gu, '');")
s=s.replace("const position = authorPositions.get(candidate.author) || 0;\n      const available = candidate.books.slice(position)\n        .filter(t => !usedTitles.has(normalized(t)) && !picks.some(p => normalized(p.title) === normalized(t)));", "const position = authorPositions.get(candidate.author) || 0;\n      const available = candidate.books.slice(position)\n        .filter(t => !usedTitles.has(normalized(t)) && !picks.some(p => normalized(p.title) === normalized(t)));")
# avoid premature cycling of an already-selected author within the same month
s=s.replace("const candidate = pool[(preferredIndex + offset) % pool.length];\n      const position", "const candidate = pool[(preferredIndex + offset) % pool.length];\n      if (participatingAuthors.includes(candidate.author)) continue;\n      const position")
p.write_text(s)
(root/'144_YAZAR_GENISLETILMIS_KATALOG.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2))
# Simulate exact TS selection logic
used=set(); pos={};months=[]; total=0
cats=list(mod.D)
for y in range(1,41):
 for m,cat in enumerate(cats):
  pool=entries[m*12:(m+1)*12]; picks=[]
  for off in range(12):
   cand=pool[((y-1)%12+off)%12];a=cand['author'];start=pos.get(a,0)
   available=[t for t in cand['books'][start:] if re.sub(r'[^\w]','',t).casefold() not in used and t not in picks]
   selected=available[:4-len(picks)]
   for t in selected: picks.append(t);used.add(re.sub(r'[^\w]','',t).casefold())
   if selected:pos[a]=start+len(selected)
   if len(picks)==4:break
  months.append(len(picks));total+=len(picks)
report={'authors':len(entries),'categories':len(cats),'catalogue_titles':sum(len(e['books']) for e in entries),'unique_title_assignments':total,'complete_months':months.count(4),'partial_months':sum(0<n<4 for n in months),'empty_months':months.count(0),'months':480,'yearly_book_counts':[sum(months[i:i+12]) for i in range(0,480,12)]}
(root/'KATALOG_KONTROL.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(report)
