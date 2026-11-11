export function validPhone(value) {
  const phone = value.trim();
  return /^[+0-9() .-]{7,25}$/.test(phone) && (phone.match(/[0-9]/g) || []).length >= 7;
}

export function enquiryMessage(data) {
  return [
    'Hi Biltech, I would like some advice.',
    '',
    `Name: ${data.name.trim()}`,
    `Business: ${data.business.trim()}`,
    `Phone: ${data.phone.trim()}`,
    `Email: ${data.email?.trim() || 'Not supplied'}`,
    `Help with: ${data.service}`,
    '',
    data.message.trim()
  ].join('\n');
}

export async function deliverEnquiry(endpoint, data, fetcher = fetch) {
  const response = await fetcher(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Delivery failed');
}
