import fs from 'node:fs/promises';
import path from 'node:path';
import {render,meta} from '../.ssr/entry-server.js';
import {config} from '../src/config/config.js';
import content from '../src/data/content.json' with {type:'json'};
const origin=new URL(config.origin).origin;
const preview=process.env.VERCEL_ENV==='preview';
if(!origin.startsWith('https://'))throw new Error('Production origin must use HTTPS.');
const template=await fs.readFile('dist/index.html','utf8');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const absolute=route=>origin+(route==='/'?'/':route+'/');
const organization={'@type':'Organization','@id':origin+'/#organization',name:'Biltech Solution',description:'Website, Google Business Profile and WhatsApp services for local businesses.',url:origin+'/',logo:origin+'/assets/biltech-logo.webp',telephone:'+'+config.whatsapp,email:'hello@biltech.com',areaServed:{'@type':'Place',name:'Penang, Malaysia'}};
const website={'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Biltech Solution',inLanguage:'en-MY',publisher:{'@id':organization['@id']}};
for(const [route,[title,description]] of Object.entries(meta)){
 const url=absolute(route),fullTitle=title+' | Biltech Solution';
 const graph=[organization,website,{'@type':'WebPage','@id':url+'#webpage',url,name:fullTitle,description,inLanguage:'en-MY',isPartOf:{'@id':website['@id']}}];
 if(route!=='/'){
  const crumbs=[{name:'Home',item:absolute('/')}];
  if(route.startsWith('/services/'))crumbs.push({name:'Services',item:absolute('/services')});
  crumbs.push({name:title,item:url});
  graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});
  graph[2].breadcrumb={'@id':url+'#breadcrumbs'};
 }
 const service=content.services.find(s=>route==='/services/'+s.key);
 if(service)graph.push({'@type':'Service','@id':url+'#service',name:service.name,serviceType:service.name,description:service.desc,url,provider:{'@id':organization['@id']},areaServed:{'@type':'Place',name:'Penang, Malaysia'}});
 const schema={'@context':'https://schema.org','@graph':graph};
 const social=origin+'/assets/social-card.jpg';
 const head=(preview?'<meta name="robots" content="noindex,nofollow">':'')+`<meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(url)}"><meta property="og:title" content="${escape(fullTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Biltech Solution"><meta property="og:locale" content="en_MY"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${social}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Biltech Solution logo"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(fullTitle)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${social}"><meta name="twitter:image:alt" content="Biltech Solution logo"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
 const html=template.replace('<title>Biltech Solution</title>',`<title>${escape(fullTitle)}</title>`).replace('<!--metadata-->',head).replace('<!--app-->',render(route));
 const output=route==='/'?'dist/index.html':path.join('dist',route.slice(1),'index.html');
 await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,html);
}
await fs.writeFile('dist/404.html',template.replace('<title>Biltech Solution</title>','<title>Page not found | Biltech Solution</title>').replace('<!--metadata-->','<meta name="robots" content="noindex"><meta name="description" content="This page could not be found. Return to Biltech Solution.">').replace('<!--app-->',render('/404')));
await fs.writeFile('dist/robots.txt',preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(meta).map(p=>`<url><loc>${escape(absolute(p))}</loc></url>`).join('')+'</urlset>');
await fs.rm('dist/assets/biltech-brand-board.png',{force:true});
console.log(`Prerendered ${Object.keys(meta).length} pages and 404 with social metadata and JSON-LD.`);

for(const route of ['admin','payment']){const html=template.replace('<!--metadata-->','<meta name="robots" content="noindex,nofollow">').replace('<!--app-->','');await fs.mkdir('dist/'+route,{recursive:true});await fs.writeFile('dist/'+route+'/index.html',html);}
