from pathlib import Path
from html.parser import HTMLParser
import json, re, xml.etree.ElementTree as ET
class Audit(HTMLParser):
 def __init__(self):
  super().__init__();self.tags=[];self.headings=[];self.jsonld=[];self.in_json=False;self.data_json='';self.title='';self.in_title=False
 def handle_starttag(self,t,a):
  a=dict(a);self.tags.append((t,a))
  if re.fullmatch(r'h[1-6]',t):self.headings.append(int(t[1]))
  if t=='title':self.in_title=True
  if t=='script' and a.get('type')=='application/ld+json':self.in_json=True;self.data_json=''
 def handle_data(self,d):
  if self.in_json:self.data_json+=d
  if self.in_title:self.title+=d
 def handle_endtag(self,t):
  if t=='title':self.in_title=False
  if t=='script' and self.in_json:self.jsonld.append(json.loads(self.data_json));self.in_json=False
results=[];titles=set();descs=set()
for p in sorted(Path('dist').rglob('*.html')):
 a=Audit();a.feed(p.read_text(encoding='utf-8'));route='/' if p==Path('dist/index.html') else '/'+p.parent.relative_to('dist').as_posix()+'/'
 issues=[];tags=a.tags;canonical=[d['href'] for t,d in tags if t=='link' and d.get('rel')=='canonical'];description=[d['content'] for t,d in tags if t=='meta' and d.get('name')=='description'];is404=p.name=='404.html'
 if a.headings.count(1)!=1:issues.append('H1 count')
 if any(y>x+1 for x,y in zip(a.headings,a.headings[1:])):issues.append('Heading level skip')
 if not is404:
  if len(canonical)!=1 or not canonical[0].endswith(route):issues.append('Canonical mismatch')
  if a.title in titles:issues.append('Duplicate title')
  if not description or description[0] in descs:issues.append('Missing/duplicate description')
  if not a.jsonld:issues.append('Missing JSON-LD')
  if not any(t=='meta' and d.get('property')=='og:image' for t,d in tags):issues.append('Missing social image')
  titles.add(a.title);descs.update(description)
 for t,d in tags:
  if t=='img' and (not all(k in d for k in ['alt','width','height'])):issues.append('Image missing alt/dimensions')
  if t in ['a','img','script','link']:
   target=d.get('href') or d.get('src') or ''
   if target.startswith('/') and not target.startswith('//'):
    asset=Path('dist')/target.split('#')[0].split('?')[0].lstrip('/');exists=asset.is_file() or (asset/'index.html').is_file()
    if not exists:issues.append('Broken local target: '+target)
 results.append({'file':str(p),'title':a.title,'descriptionLength':len(description[0]) if description else 0,'headings':a.headings,'canonical':canonical,'schemaTypes':[n['@type'] for s in a.jsonld for n in s.get('@graph',[])],'issues':issues})
sitemap=ET.parse('dist/sitemap.xml');assert len(sitemap.getroot())==9
Path('stage-9-static-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8');print(json.dumps(results,indent=2));assert all(not r['issues'] for r in results)
