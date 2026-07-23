async function run() {
  const url = "https://script.google.com/macros/s/AKfycbzO_u8IOGiW_OTjAGeiGX7hvyQCa8wup9GNjoViDh25MLRdseDX3_jIQhzpErDfscvf/exec?action=get";
  const res = await fetch(url);
  const text = await res.text();
  console.log(res.status);
  console.log(text.substring(0, 500));
}
run();
