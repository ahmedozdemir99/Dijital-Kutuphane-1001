import json,re,pathlib,collections,zipfile,shutil
root=pathlib.Path('/mnt/data/work144')
p=root/'144_YAZAR_GENISLETILMIS_KATALOG.json'; entries=json.loads(p.read_text())
new={
'Agatha Christie':'The Sittaford Mystery|The Seven Dials Mystery|The Big Four|The Murder on the Links|The Mystery of the Blue Train|The Labours of Hercules|Taken at the Flood|Dead Man’s Folly|The Adventure of the Christmas Pudding|The Thirteen Problems|Peril at End House|The Murder at the Vicarage|The Moving Finger|The Hollow|Five Little Pigs|A Murder Is Announced|The Mirror Crack’d from Side to Side|Crooked House|Endless Night|The Secret Adversary|The Man in the Brown Suit|Cards on the Table|Hercule Poirot’s Christmas|Death in the Clouds|After the Funeral|Evil Under the Sun|The Pale Horse|The Secret of Chimneys|Towards Zero|The Clocks',
'Jules Verne':'Michael Strogoff|The Mysterious Island|The Begum’s Fortune|The Steam House|The Adventures of Captain Hatteras|From the Earth to the Moon|Around the Moon|The Green Ray|The Floating City|The Carpathian Castle|The Master of the World|The Chancellor|The Survivors of the Chancellor|The Danube Pilot|The Secret of Wilhelm Storitz|The Village in the Treetops|The Underground City|A Drama in Livonia',
'Charles Dickens':'The Pickwick Papers|Hard Times|The Old Curiosity Shop|Barnaby Rudge|A Tale of Two Cities|Our Mutual Friend|The Mystery of Edwin Drood|American Notes|Pictures from Italy|Sketches by Boz|The Uncommercial Traveller|The Chimes|The Cricket on the Hearth|The Battle of Life',
'Isaac Asimov':'Foundation’s Edge|Foundation and Earth|Prelude to Foundation|Forward the Foundation|The Caves of Steel|The Naked Sun|The Robots of Dawn|Robots and Empire|The End of Eternity|The Gods Themselves|Nightfall|The Bicentennial Man|I, Robot|The Currents of Space|Pebble in the Sky|The Stars, Like Dust',
'Jack London':'The Call of the Wild|The Sea-Wolf|Burning Daylight|The Valley of the Moon|The Scarlet Plague|The Iron Heel|John Barleycorn|The Road|The Cruise of the Snark|The People of the Abyss|The Game|The Star Rover|The Little Lady of the Big House',
'Yaşar Kemal':'İnce Memed 2|İnce Memed 3|İnce Memed 4|Akçasazın Ağaları|Al Gözüm Seyreyle Salih|Hüyükteki Nar Ağacı|Çakırcalı Efe|Karıncanın Su İçtiği|Tanyeri Horozları|Tek Kanatlı Bir Kuş|Baldaki Tuz|Bu Diyar Baştan Başa',
'Halide Edib Adıvar':'Yeni Turan|Kalp Ağrısı|Zeyno’nun Oğlu|Son Eseri|Seviyye Talip|Raik’in Annesi|Mev’ut Hüküm|Hüküm Gecesi|Döner Ayna|Sonsuz Panayır',
'Kemal Tahir':'Kelleci Memet|Sağırdere|Körduman|Köyün Kamburu|Büyük Mal|Hür Şehrin İnsanları|Namusçular|Karılar Koğuşu|Bir Mülkiyet Kalesi|Yol Ayrımı',
'Orhan Pamuk':'Cevdet Bey ve Oğulları|Saf ve Düşünceli Romancı|Resimli İstanbul|Hatıraların Masumiyeti|Ben Bir Ağacım',
'Tolstoy':'Aile Mutluluğu|Polikuşka|Sergi Baba|Üç Ölüm|Diriliş|Karanlığın Gücü|Kafkas Tutsağı|İnsanlar Arasında|Sevastopol Hikâyeleri',
'Victor Hugo':'Hernani|Ruy Blas|Bir İdam Mahkûmunun Son Günü|Doksan Üç|Sefiller|Sonbahar Yaprakları|Cromwell|Lucrezia Borgia',
'George Orwell':'Coming Up for Air|Keep the Aspidistra Flying|Burmese Days|Homage to Catalonia|The Road to Wigan Pier|A Clergyman’s Daughter|Inside the Whale and Other Essays',
'Franz Kafka':'The Trial|The Castle|Amerika|The Metamorphosis|The Judgment|A Country Doctor|A Hunger Artist|Letters to Milena|Letters to Felice',
'Friedrich Nietzsche':'The Birth of Tragedy|Untimely Meditations|Daybreak|The Gay Science|On the Genealogy of Morality|The Case of Wagner|Nietzsche contra Wagner',
'Platon':'Parmenides|Sophist|Statesman|Laws|Philebus|Ion|Laches|Charmides|Euthyphro|Euthydemus',
'Aristoteles':'On the Heavens|On Generation and Corruption|Meteorology|History of Animals|On the Parts of Animals|On the Generation of Animals|On Memory and Recollection|On Dreams|On Interpretation',
'Bertrand Russell':'The Problems of Philosophy|The Conquest of Happiness|Human Knowledge: Its Scope and Limits|The Analysis of Mind|Introduction to Mathematical Philosophy|The Principles of Mathematics|Marriage and Morals|Authority and the Individual',
'Carl Sagan':'Cosmos|Contact|Pale Blue Dot|The Cosmic Connection|Intelligent Life in the Universe|Comet|The Varieties of Scientific Experience|Broca’s Brain|The Demon-Haunted World|Shadows of Forgotten Ancestors|The Dragons of Eden|Billions and Billions',
'Arthur Schopenhauer':'On the Fourfold Root of the Principle of Sufficient Reason|On the Will in Nature|The Two Fundamental Problems of Ethics|Parerga and Paralipomena',
'Stephen Hawking':'A Brief History of Time|The Universe in a Nutshell|Black Holes and Baby Universes|A Briefer History of Time|The Grand Design|My Brief History|Brief Answers to the Big Questions',
'Richard Feynman':'QED: The Strange Theory of Light and Matter|The Character of Physical Law|The Meaning of It All|Six Easy Pieces|Six Not-So-Easy Pieces|The Pleasure of Finding Things Out',
'Immanuel Kant':'Prolegomena to Any Future Metaphysics|Religion within the Bounds of Bare Reason|Perpetual Peace|Anthropology from a Pragmatic Point of View|The Metaphysics of Morals',
}
by={e['author']:e for e in entries};missing=[a for a in new if a not in by];print('missing authors',missing)
# Normalize transliterated titles only by exact normalized name. Mark additions as editorial candidates.
def norm(x):return re.sub(r'[^\w]','',x).casefold()
added=[]
for author,raw in new.items():
 if author not in by:continue
 e=by[author];existing={norm(t) for t in e['books']}
 for title in raw.split('|'):
  if norm(title) not in existing:
   e['books'].append(title);existing.add(norm(title));added.append((author,title))
# Keep current data structure, update TS literal.
s=(root/'src/components/CurriculumJourneyView.tsx').read_text();start=s.index('const AUTHOR_CATALOGUE: AuthorEntry[] = ');end=s.index(';\nconst CATEGORY_NAMES',start)
s=s[:start]+'const AUTHOR_CATALOGUE: AuthorEntry[] = '+json.dumps(entries,ensure_ascii=False,indent=2)+s[end:]
(root/'src/components/CurriculumJourneyView.tsx').write_text(s)
p.write_text(json.dumps(entries,ensure_ascii=False,indent=2))
# The app's scheduling algorithm is category-limited; calculate count of unique available works and allocated works, as earlier report.
used=set();pos={};monthly=[]
for year in range(1,41):
 for month in range(12):
  pool=entries[month*12:(month+1)*12];picks=[];participating=[]
  for offset in range(12):
   candidate=pool[((year-1)%12+offset)%12];author=candidate['author']
   if author in participating:continue
   position=pos.get(author,0)
   available=[t for t in candidate['books'][position:] if norm(t) not in used and norm(t) not in {norm(x) for x in picks}]
   selected=available[:4-len(picks)]
   for title in selected:picks.append(title);used.add(norm(title))
   if selected:pos[author]=position+len(selected);participating.append(author)
   if len(picks)==4:break
  monthly.append(len(picks))
report={'authors':len(entries),'categories':12,'added_candidate_titles':len(added),'catalogue_entries':sum(len(e['books']) for e in entries),'assigned_distinct_titles':sum(monthly),'full_months':monthly.count(4),'partial_months':sum(0<x<4 for x in monthly),'empty_months':monthly.count(0),'target_reached':sum(monthly)>=1000}
(root/'1000_ESER_KONTROL_RAPORU.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(root/'1000_ESER_EKLENEN_ADAYLAR.json').write_text(json.dumps([{'author':a,'title':t} for a,t in added],ensure_ascii=False,indent=2))
print(report)
