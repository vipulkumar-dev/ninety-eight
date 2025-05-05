import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

const lenis = lenisInit();

const header = document.getElementById("header");
let isMenuOpen = false;
let lastScrollPosition = 0;
let delta = isDesktop ? 30 : 60; // Minimum scroll distance before toggling header
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

const menu_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.3,
    ease: "power3.inOut",
  },
});

menu_tl
  .to(".menu_line.top", {
    top: "50%",
  })
  .to(
    ".menu_line.bottom",
    {
      bottom: "50%",
    },
    "<"
  )
  .to(".menu_line.top", {
    rotate: 225,
    width: "82%",
    duration: 0.5,
  })
  .to(
    ".menu_line.bottom",
    {
      rotate: -45,
      width: "82%",
    },
    "<"
  )
  .fromTo(
    ".navigation_wrapper",
    {
      x: "100%",
    },
    {
      x: "0%",
      duration: 0.8,
    },
    "-=0.7"
  )
  .fromTo(
    ".nav_animate",
    {
      x: "500px",
    },
    {
      x: "0%",
      stagger: 0.04,
      duration: 0.8,
    },
    "-=0.7"
  );

const menu_trigger = document.querySelector(".menu_trigger");

menu_trigger?.addEventListener("click", () => {
  if (!isMenuOpen) {
    menu_tl.play();
  } else {
    menu_tl.reverse();
  }
  isMenuOpen = !isMenuOpen;
});

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

document.querySelectorAll(".btn").forEach((btn) => {
  const btn_tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 1,
      ease: "power4.inOut",
    },
  });

  btn_tl.to(btn.querySelectorAll(".btn_arrow_wpr"), {
    x: "100%",
  });

  btn_tl.to(
    btn.querySelector(".btn_arrow_first"),
    {
      scale: "0",
    },
    "<"
  );
  btn_tl.to(
    btn.querySelector(".btn_arrow_last"),
    {
      scale: "1",
    },
    "<"
  );

  // btn_tl.to(btn.querySelector(".btn_bg_path"), {
  //   duration: 1,
  //   // scale: 1.2,
  //   // attr: {
  //   //   d: "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H27.2646C25.1808 62.5 24.0353 62.4996 21.5693 62.1533L21.5352 62.1494H5.7041L1.27246 57.8105L2.90039 41.9043L2.9248 41.6641L2.75293 41.4961C1.31212 40.0853 0.5 38.1532 0.5 36.1367V8C0.5 3.85786 3.85786 0.5 8 0.5Z",
  //   //   delta: 0,
  //   // },
  //   // morphSVG:
  //   //   "M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z",
  //   scale: 1,
  //   // fill: "#333",
  //   ease: "power4.inOut",
  // });

  //   <svg width="265" height="63" viewBox="0 0 265 63" fill="none" xmlns="http://www.w3.org/2000/svg">
  // <path d="M8 0.5H257C261.142 0.5 264.5 3.85786 264.5 8V55C264.5 59.1421 261.142 62.5 257 62.5H8.16504C4.05427 62.4998 0.709905 59.1906 0.666016 55.0801L0.5 39.4951V8L0.509766 7.61426C0.710536 3.65139 3.98724 0.5 8 0.5Z" fill="black" stroke="#949494"/>
  // </svg>

  btn.addEventListener("mouseenter", (e) => {
    btn_tl.play();
  });

  btn.addEventListener("mouseleave", (e) => {
    btn_tl.reverse();
  });
});

document.querySelectorAll("[parallax-image]").forEach((image) => {
  //wrap the image with a div
  const wrapper = document.createElement("div");
  wrapper.classList.add("parallax-image-wrapper");
  wrapper.style.overflow = "hidden";
  image.parentNode.insertBefore(wrapper, image);
  wrapper.appendChild(image);

  const parallaxtl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      // markers: true,
    },
  });
  const PARALLAXAMOUNT = isDesktop ? 100 : 50;
  const imageHeight = image.clientHeight;
  wrapper.style.height = `${imageHeight}px`;
  image.style.height = `${imageHeight + PARALLAXAMOUNT}px`;

  parallaxtl.fromTo(
    image,
    {
      y: 0,
    },
    {
      y: -PARALLAXAMOUNT,
    }
  );
});

//

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    mask: "lines",
    linesClass: "para_line",
  });

  // const tl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: text,
  //     start: "top bottom",
  //     end: "bottom top",
  //   },
  // });
  // tl.fromTo(
  //   text.querySelectorAll(".para_line"),
  //   {
  //     y: "140%",
  //   },
  //   {
  //     y: 0,

  //     stagger: 0.1,
  //     duration: 1.5,
  //     ease: "power4.inOut",
  //   }
  // );
});

document.querySelectorAll("[reveal]").forEach((el) => {
  if (el.hasAttribute("para-reveal")) {
    setReset(el.querySelectorAll(".para_line"));
  } else setReset(el);
});

function setReset(targets) {
  gsap.set(targets, {
    y: (index, target) => {
      console.log(target);
      if (target.hasAttribute("fade-reveal")) {
        return "0%";
      }
      return "140%";
    },
    opacity: 0,
    scaleY: (index, target) => {
      console.log(target);
      if (target.hasAttribute("fade-reveal")) {
        return 1.2;
      }
      return 2;
    },
    transformOrigin: "top",
  });
}

ScrollTrigger.batch("[reveal]", {
  start: "top bottom",
  end: "top top",
  // markers: true,
  onEnter: (elements, triggers) => {
    const animateItems = [];

    elements.forEach((element) => {
      if (element.hasAttribute("basic-reveal")) {
        animateItems.push(element);
      }
      if (element.hasAttribute("para-reveal")) {
        element.querySelectorAll(".para_line").forEach((line) => {
          animateItems.push(line);
        });
      }
      if (element.hasAttribute("fade-reveal")) {
        animateItems.push(element);
      }
    });
    console.log("animateItems", animateItems);

    gsap.to(animateItems, {
      y: "0%",
      opacity: 1,
      scaleY: 1,
      stagger: 0.07,
      duration: (index, target) => {
        console.log(target);
        if (target.hasAttribute("fade-reveal")) {
          return 1.3;
        }
        return 1.3;
      },
      ease: "power4.inOut",
    });
  },
});

// console.log("From how it why");
roll("[roll]", 60);
liveReload();
