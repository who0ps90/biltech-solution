import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd();
const files=['package.json','package-lock.json','index.html','vite.config.js','postcss.config.js','vercel.json','scripts/prerender.mjs'];
for(const directory of ['src','api','server','public']){
 const visit=relative=>{for(const item of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){const file=relative+'/'+item.name;if(item.isDirectory())visit(file);else if(file!=='public/assets/biltech-brand-board.png')files.push(file);}};
 visit(directory);
}
files.sort();
const manifest=files.map(file=>{const bytes=fs.readFileSync(path.join(root,file));return {file,size:bytes.length,sha:createHash('sha1').update(bytes).digest('hex')};});
if(process.argv[2]==='manifest')process.stdout.write(JSON.stringify(manifest));
else if(process.argv[2]==='chunk'){
 const index=Number(process.argv[3]),offset=Number(process.argv[4]);
 if(!Number.isSafeInteger(index)||!manifest[index]||!Number.isSafeInteger(offset)||offset<0)throw new Error('Invalid file chunk');
 const bytes=fs.readFileSync(path.join(root,manifest[index].file));
 process.stdout.write(bytes.subarray(offset,offset+16383).toString('base64'));
}else throw new Error('Use manifest or chunk');
