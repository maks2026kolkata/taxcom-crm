async function run() {
  const url = "https://script.google.com/macros/s/AKfycbzO_u8IOGiW_OTjAGeiGX7hvyQCa8wup9GNjoViDh25MLRdseDX3_jIQhzpErDfscvf/exec";
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({id: "test"})
  });
  const text = await res.text();
  console.log(res.status, res.url);
  console.log(text.substring(0, 200));
}
run();
