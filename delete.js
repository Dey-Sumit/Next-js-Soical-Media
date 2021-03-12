// Simple javascipt

// Synchronous fetch using async/await.
// Usual way
const jsonData = fetch("URL")
  .then((response = response.json()))
  .then((json = console.log(json)));

  // Using await
const jsonData = await fetch("URL").then((res = res.json()));

// Shorter syntax ®
const jsonData = await (await fetch("URL")).json();
