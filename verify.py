from author_data import D
import re
pool=[[x.split('|') for x in raw.splitlines()] for raw in D.values()]
used=set(); pos={}; counts=[]; peryear=[]
for y in range(1,41):
 c=0
 for m,p in enumerate(pool):
  chosen=None
  for j in range(12):
   row=p[((y-1)%12+j)%12]; a=row[0]; k=pos.get(a,0)
   next=[x for x in row[1:][k:] if re.sub(r'\W','',x).casefold() not in used][:4]
   if len(next)==4:
    chosen=a;pos[a]=k+4
    for x in next:used.add(re.sub(r'\W','',x).casefold())
    break
  if chosen:c+=1
 counts.append(c)
 peryear.append(c)
print('144 authors:',sum(map(len,pool)))
print('first 12 years monthly completeness:',counts[:12])
print('all years:',counts)
print('complete months:',sum(counts),'of 480, unique titles:',len(used))
