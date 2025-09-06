async function callApi() {
  const res = await fetch("/.netlify/functions/generate");
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}
