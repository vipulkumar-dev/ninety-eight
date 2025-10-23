function loadScript(primaryUrl, fallbackUrl) {
  const script = document.createElement("script");
  script.src = primaryUrl;
  script.type = "module";
  script.onload = () => console.log(`Loaded script from: ${primaryUrl}`);
  document.setAttribute("data-script-mode", "local");
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
    document.setAttribute("data-script-mode", "server");
  };
  document.head.appendChild(script);
}

const FOLDERNAME = "humera";

document.addEventListener("DOMContentLoaded", () => {
  loadScript(
    `http://127.0.0.1:3000/${FOLDERNAME}/index.js`,
    `https://ninety-eight.vercel.app/${FOLDERNAME}/index.js`
  );
});
