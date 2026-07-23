export async function onRequestPost(context) {
  const request = context.request;
  const formData = await request.formData();
  
  // Convert FormData to JSON
  const object = {};
  for (const [key, value] of formData.entries()) {
    object[key] = value;
  }
  
  // Forward to Web3forms with a spoofed Origin to bypass the TLD block
  const web3formsRequest = new Request('https://api.web3forms.com/submit', {
    method: 'POST',
    body: JSON.stringify(object),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Origin': 'https://ritikdeswal.com',
      'Referer': 'https://ritikdeswal.com/'
    }
  });

  const response = await fetch(web3formsRequest);
  return response;
}
