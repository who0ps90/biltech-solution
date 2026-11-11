import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Uses public settings only. Never fetches or prints private credentials or rows.
const local=fs.existsSync('.env.local')?fs.readFileSync('.env.local','utf8'):'';
const setting=name=>process.env[name]||local.split(/\r?\n/).find(line=>line.startsWith(name+'='))?.slice(name.length+1);
const url=setting('VITE_SUPABASE_URL');
const key=setting('VITE_SUPABASE_PUBLISHABLE_KEY');
const skip=!url||!key;

for(const table of ['admins','enquiries','invoices','enquiry_limits']){
  test(`public key cannot read ${table}`,{skip},async()=>{
    const response=await fetch(`${url}/rest/v1/${table}?select=*&limit=1`,{
      headers:{apikey:key},signal:AbortSignal.timeout(15000)
    });
    assert.ok([401,403].includes(response.status),`Expected access denial, received HTTP ${response.status}`);
  });
}
test('public key cannot invoke enquiry-saving RPC',{skip},async()=>{
  const response=await fetch(`${url}/rest/v1/rpc/accept_enquiry`,{
    method:'POST',headers:{apikey:key,'Content-Type':'application/json'},
    body:JSON.stringify({payload:{},bucket:'public-access-verification'}),
    signal:AbortSignal.timeout(15000)
  });
  assert.ok([401,403].includes(response.status),`Expected access denial, received HTTP ${response.status}`);
});
