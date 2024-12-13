import { getCurrentTime, roll } from "../utils.js";
import { liveReload } from "../liveReload.js";

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 30; // Minimum scroll distance before toggling header
let ticking = false;

function handleScroll() {
  const currentScrollPosition = window.scrollY;

  if (Math.abs(currentScrollPosition - lastScrollPosition) > delta) {
    if (currentScrollPosition > lastScrollPosition) {
      // Scrolling down
      header.classList.add("hidden");
    } else {
      // Scrolling up
      header.classList.remove("hidden");
    }
    lastScrollPosition = currentScrollPosition;
  }

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }

  if (window.scrollY > 0) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

console.log("From how it why");
roll("[roll]", 100);
liveReload();
