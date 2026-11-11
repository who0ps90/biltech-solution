import test from 'node:test';
import assert from 'node:assert/strict';
import {validPhone, enquiryMessage, deliverEnquiry} from '../src/data/enquiry.js';

test('phone validation rejects punctuation-only and incomplete numbers', () => {
  for (const phone of ['-------', '       ', '+( )...', '123456', '123abc4567']) assert.equal(validPhone(phone), false, phone);
  for (const phone of ['+60 16-453 2818', '(04) 123 4567', '0123456789']) assert.equal(validPhone(phone), true, phone);
});

test('WhatsApp draft has real line breaks and preserves message punctuation', () => {
  const text = enquiryMessage({name:' QA Example ',business:'A & B',phone:'+60 123456789',email:' ',service:'Website',message:'First line\nSecond line: & ? #'});
  const link = new URL('https://wa.me/60164532818');
  link.searchParams.set('text',text);
  assert.equal(new URL(link).searchParams.get('text'), text);
  assert.ok(text.includes('\n\nName: QA Example\n'));
  assert.ok(text.includes('Email: Not supplied\n'));
  assert.ok(text.endsWith('First line\nSecond line: & ? #'));
  assert.equal(text.includes('\\n'),false);
});

test('delivery posts JSON and accepts an empty successful response', async () => {
  const data = {name:'QA Example',message:'Test only'};
  await deliverEnquiry('https://example.invalid/enquiry',data,async (url,options) => {
    assert.equal(url,'https://example.invalid/enquiry');
    assert.equal(options.method,'POST');
    assert.equal(options.headers['Content-Type'],'application/json');
    assert.deepEqual(JSON.parse(options.body),data);
    assert.ok(options.signal instanceof AbortSignal);
    return {ok:true};
  });
});

test('HTTP, network and timeout failures propagate instead of reporting success', async () => {
  await assert.rejects(deliverEnquiry('unused',{},async () => ({ok:false})),/Delivery failed/);
  for (const error of [new TypeError('Network failure'),new DOMException('Timed out','TimeoutError')]) {
    await assert.rejects(deliverEnquiry('unused',{},async () => {throw error}), error);
  }
});
