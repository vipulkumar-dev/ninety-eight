function loadScript(primaryUrl, fallbackUrl) {
  const script = document.createElement("script");
  script.src = primaryUrl;
  script.type = "module";
  script.onload = () => console.log(`Loaded script from: ${primaryUrl}`);
<<<<<<< HEAD
  //document.setAttribute("data-script-mode", "local");
=======

>>>>>>> 91b20b19602a84844397f7e437c108947a3daa4d
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
<<<<<<< HEAD
    //document.setAttribute("data-script-mode", "server");
=======
>>>>>>> 91b20b19602a84844397f7e437c108947a3daa4d
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
