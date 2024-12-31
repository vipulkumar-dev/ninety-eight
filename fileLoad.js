function loadScript(primaryUrl, fallbackUrl) {
  const script = document.createElement("script");
  script.src = primaryUrl;
  script.type = "module";
  script.onload = () => console.log(`Loaded script from: ${primaryUrl}`);
  script.onerror = () => {
    console.warn(
      `Failed to load script from: ${primaryUrl}, attempting fallback.`
    );
    const fallbackScript = document.createElement("script");
    fallbackScript.src = fallbackUrl;
    fallbackScript.type = "module";
    fallbackScript.onload = () =>
      console.log(`Loaded script from: ${fallbackUrl}`);
    fallbackScript.onerror = () =>
      console.error(`Failed to load script from: ${fallbackUrl}`);
    document.head.appendChild(fallbackScript);
  };
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  // Call the function with your URLs
  loadScript(
    "http://127.0.0.1:3000/yeildstone/index.js",
    "https://ninety-eight.vercel.app/yeildstone/index.js"
  );
});
