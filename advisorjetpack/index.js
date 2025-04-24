import { roll, getDevices, convertVhToFixedHeight } from "../utils.js";
import PhotoSwipeLightbox from "https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js";
import { liveReload } from "../liveReload.js";
const { isDesktop, isMobile } = getDevices();

document.querySelectorAll("#modal-gallery img").forEach((img) => {
  // Only proceed when the image is fully loaded
  if (img.complete && img.naturalWidth) {
    wrapImage(img);
  } else {
    img.addEventListener("load", () => {
      wrapImage(img);
    });
  }
});

function wrapImage(img) {
  // Skip if it's already wrapped
  if (img.parentElement.classList.contains("zoom_image")) return;

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  let scaleFactor = isDesktop ? 0.6 : 1;

  if (width < 600 && height < 600) {
    scaleFactor = 1;
  }

  const link = document.createElement("a");
  link.href = img.src;
  link.className = "zoom_image";
  link.setAttribute("data-pswp-width", width * scaleFactor);
  link.setAttribute("data-pswp-height", height * scaleFactor);

  img.parentNode.insertBefore(link, img);
  link.appendChild(img);
}

const lightbox = new PhotoSwipeLightbox({
  // closeSVG: closeArrowSVGString,
  // zoomSVG: zoomSVGString,

  gallery: "#modal-gallery",
  secondaryZoomLevel: 1.5,
  children: ".zoom_image",
  pswpModule: () => import("https://unpkg.com/photoswipe"),
});

lightbox.init();

function lenisInit() {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis({
    lerp: 0.15,
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

const lenis = lenisInit();

let isMenuOpen;

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 50; // Minimum scroll distance before toggling header
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

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!isMenuOpen) {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  if (window.scrollY > 0) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

const pillar_wpr = document.querySelector(".pillar_content");
const pillar_dash = document.querySelector(".pillar_dash");
const DASH_TRANSFORM = isMobile ? 18 : 18;

const pillar_dash_tw = gsap.to(pillar_dash, {
  top: () => {
    const topH = pillar_wpr.offsetHeight;
    const dashtopH = pillar_dash.offsetHeight;
    return `${topH - DASH_TRANSFORM}px`;
  },
  ease: "linear",
  scrollTrigger: {
    trigger: ".pillar_content",
    start: "top 30%",
    end: "bottom 60%",
    scrub: 0.3,
    // markers: true,
  },
});

////
document.querySelectorAll(".about_container").forEach((about_container) => {
  const aboutItems = about_container.querySelectorAll(".about_item");
  console.log(aboutItems);

  const aboutItemWidth = aboutItems[aboutItems.length - 1].offsetWidth;

  // Loop through each item and add the event listener
  aboutItems.forEach((item) => {
    item.style.width = aboutItemWidth + "px";
    item.addEventListener("mouseenter", function () {
      // Remove the 'active' class from all 'about_item' elements
      aboutItems.forEach((item) => item.classList.remove("active"));

      // Add the 'active' class to the current element
      item.classList.add("active");
    });
  });
});

const faq_items = document.querySelectorAll(".faq_item");

faq_items.forEach((faqItem, index) => {
  faqItem.isActive = false;
  const faqTl = faqTimeline(faqItem);
  faqItem.addEventListener("click", () => {
    console.log(faqItem);
    if (!faqItem.isActive) {
      faqTl.play();
      faqItem.isActive = true;
    } else {
      faqTl.reverse();
      faqItem.isActive = false;
    }
  });

  if (index == 0) {
    faqItem.click();
  }
});

function faqTimeline(faqItem) {
  const faqTl = gsap
    .timeline({
      paused: true,
      defaults: {
        duration: 0.4,
        ease: "power2.inOut",
      },
      onComplete: () => {
        lenis.resize();
        ScrollTrigger.refresh();
      },
      onReverseComplete: () => {
        lenis.resize();
        ScrollTrigger.refresh();
      },
    })
    .to(faqItem, {
      gap: isMobile ? "20px" : "26px",
    })

    .to(
      faqItem.querySelector(".faq_para"),
      {
        height: "auto",
        opacity: 1,
      },
      0
    )
    .to(
      faqItem.querySelectorAll(".faq_arrow"),
      {
        rotate: 180,
      },
      0
    );

  return faqTl;
}

const items = document.querySelectorAll("[data-number]");

items.forEach((item) => {
  const hasIsPoint = item.hasAttribute("is-point");

  gsap.from(item, {
    textContent: hasIsPoint ? 0.0 : 0,
    duration: 1,
    scrollTrigger: {
      trigger: item,
      start: "top bottom",
      end: "top bottom",
      // markers: true,
    },
    ease: Power1.easeIn,
    snap: { textContent: hasIsPoint ? 0.1 : 1 },
    // stagger: 1, // not used in individual loops
    // onUpdate: textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  });
});

const swiper = new Swiper(".swiper", {
  // freeMode: true,
  slidesPerView: 1,
  spaceBetween: 16,
  // grabCursor: true,
  breakpoints: {
    479: {
      slidesPerView: "auto",
      spaceBetween: 23,
    },
  },
  navigation: {
    nextEl: ".swiper-custom-button.is-next",
    prevEl: ".swiper-custom-button.is-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

const menu_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: "power3.inOut",
  },
});

menu_tl

  .to(".menu_line.top", {
    y: 7,
    duration: 0.2,
  })
  .to(
    ".menu_line.bottom",
    {
      y: -7,
      duration: 0.2,
    },
    "<"
  )

  .to(".menu_line.top", {
    rotate: 45,
  })
  .to(
    ".menu_line.bottom",
    {
      rotate: -45,
    },
    "<"
  )
  .fromTo(
    ".navigation_wrapper",
    {
      y: "-100%",
    },
    {
      y: "0%",
      duration: 1.2,
    },
    "-=0.7"
  )
  .fromTo(
    ".nav_animate",
    {
      x: "150px",
    },
    {
      x: "0px",
      duration: 0.9,
      stagger: 0.03,
    },
    "-=1.1"
  );

isMenuOpen = false;
document.querySelector(".menu_trigger").addEventListener("click", () => {
  if (!isMenuOpen) {
    console.log("open");
    menu_tl.play();
  } else {
    console.log("close");
    menu_tl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

ScrollTrigger.batch("[fade-animation]", {
  start: (element, triggers) => {
    if (element.trigger.hasAttribute("after-pinned")) {
      return `top+=${PIN_SPACING} 100%`;
    }
    return "top 100%";
  },

  end: "top top",
  // markers: true,
  onEnter: (elements, triggers) => {
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: 0.06,
      duration: 0.8,
      ease: "power2.inOut",
    });
  },
});

document.querySelectorAll("[tab_item]").forEach((tab) => {
  tab.addEventListener("click", () => {
    lenis.resize();
    // ScrollTrigger.refresh();
  });
});

convertVhToFixedHeight();

console.log("adivsory");
roll("[roll]", 60);
liveReload();
