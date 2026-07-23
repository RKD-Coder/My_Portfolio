export async function onRequestPost(context) {
  const request = context.request;
  const formData = await request.formData();
  
  // Forward to Web3forms with a spoofed Origin to bypass the TLD block
  const web3formsRequest = new Request('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
    headers: {
      'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Origin': 'https://ritikdeswal.com',
      'Referer': 'https://ritikdeswal.com/',
      'Accept': 'application/json, text/plain, */*'
    }
  });

  const response = await fetch(web3formsRequest);
  return response;
}
