import { roll, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const header = document.getElementById("header");
let lastScrollPosition = 0;
let delta = 50; // Minimum scroll distance before toggling header
let ticking = false;
let isMenuOpen = false;

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

const lenis = lenisInit();

// var scriptLocation = document.currentScript.src;
// console.log("scriptLocation", scriptLocation);

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

(function loaderAnimatiion() {
  const loaderTl = gsap.timeline({
    defaults: {
      duration: 3,
      ease: "power4.inOut",
    },
  });

  loaderTl
    .to(".loader_center_line", {
      height: "0%",
      duration: 2,
    })
    .to(
      ".loader_line",
      {
        height: "0%",
        duration: 2,
      },
      "<"
    );

  const loader_circle = document.querySelector(".loader_circle");
  const length = loader_circle.getTotalLength();

  // Set the stroke dash values
  loader_circle.style.strokeDasharray = length;
  loader_circle.style.strokeDashoffset = 0;

  loaderTl
    .to(
      ".loader_svg",
      {
        opacity: "0",
        delay: 1,
        duration: 1.3,
        // duration: 5,
      },
      "<"
    )
    .to(
      ".loader_circle",
      {
        strokeDashoffset: length,
        duration: 1.3,
        // duration: 5,
      },
      "<-0.4"
    );

  loaderTl
    .to(
      ".loader_bg_left",
      {
        x: "-101%",
        duration: 2,
      },
      "=-0.4"
    )
    .to(
      ".loader_bg_right",
      {
        x: "101%",
        duration: 2,
      },
      "<"
    );

  const hero_svg_path = document.querySelectorAll(".hero_svg path");

  hero_svg_path.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  loaderTl
    .to(
      hero_svg_path,
      {
        strokeDashoffset: 0,
        stagger: 0.1,
      },
      "=-1.5"
    )
    .to(
      hero_svg_path,
      {
        fill: "rgb(251, 240, 218)",
        duration: 2,
      },
      "<=+1.5"
    );

  loaderTl
    .from(
      ".header_border",
      {
        width: 0,
        duration: 1.5,
      },
      "<"
    )
    .from(
      "[nav-reveal]",
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 2,
      },
      "<"
    );

  new SplitText("#hero-paragraph", { type: "lines" });
  new SplitText("#hero-paragraph", { type: "lines", linesClass: "line" });

  loaderTl
    .from(
      "#hero-paragraph .line > div",
      {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 2,
      },
      "<"
    )
    .from(
      ".hero-svg-small",
      {
        opacity: 0,
        duration: 1.5,
      },
      "<"
    )
    .from("#scroll-text", { y: 30, opacity: 0, duration: 1.5 }, "<+1");
})();

const menu_open_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 2,
    ease: "power4.inOut",
  },
});
menu_open_tl
  .to(".navigation_left", {
    x: "0%",
    duration: 1.5,
  })
  .to(
    ".navigation_right",
    {
      x: "0%",
      duration: 1.5,
    },
    "<"
  )
  .from(
    ".nav_border",
    {
      width: "0%",
      duration: 1.5,
      stagger: 0.05,
    },
    "<+0.5"
  )
  .from(
    ".nav_border_left",
    {
      width: "0%",
      duration: 1.5,
      stagger: 0.05,
    },
    "<"
  )
  .from(
    "[nav_animate]",
    {
      y: 50,

      duration: 1.5,
      stagger: 0.05,
    },
    "<"
  )
  .from(
    "[nav_animate_left]",
    {
      y: 50,

      duration: 1.5,
      stagger: 0.05,
    },
    "<"
  )
  .from(
    "[nav_animate_fade]",
    {
      opacity: 0,
      duration: 1.5,
      stagger: 0.05,
    },
    "<+0.5"
  );

const menu_close_tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 2,
    ease: "power4.inOut",
  },
});
menu_close_tl
  .to(".navigation_left", {
    x: "-101%",
    duration: 1.5,
  })
  .to(
    ".navigation_right",
    {
      x: "101%",
      duration: 1.5,
    },
    "<"
  );

const menu_trigger = document.querySelector(".menu_trigger");
const menu_close = document.querySelector(".menu_close");

menu_trigger.addEventListener("click", () => {
  menu_open_tl.restart();
  isMenuOpen = true;
});

menu_close.addEventListener("click", () => {
  menu_close_tl.restart();
  isMenuOpen = false;
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
  const PARALLAXAMOUNT = 140;
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

  if (image.hasAttribute("not-reveal")) {
    return;
  }

  gsap.fromTo(
    wrapper,
    {
      clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
    },
    {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      duration: 1.5,
      delay: 0.5,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
      },
    }
  );
});

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, { type: "lines" });
  new SplitText(text, { type: "lines", linesClass: "line" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: text,
      start: "top bottom",
      end: "bottom top",
    },
  });
  tl.fromTo(
    text.querySelectorAll(".line > div"),
    {
      y: "140%",
    },
    {
      y: 0,

      stagger: 0.1,
      duration: 1.5,
      ease: "power4.inOut",
    }
  );
});

document.querySelectorAll("[basic-reveal]").forEach((element) => {
  // gsap.from(element, {
  //   scrollTrigger: {
  //     trigger: element,
  //     start: "top bottom",
  //     end: "bottom top",
  //   },
  //   y: "150%",
  //   duration: 1.5,
  //   ease: "power4.inOut",
  // });

  gsap.set(element, {
    y: "150%",
  });
});

ScrollTrigger.batch("[basic-reveal]", {
  start: "top bottom",
  end: "bottom top",
  // markers: true,
  onEnter: (elements, triggers) => {
    gsap.to(elements, {
      y: 0,
      stagger: 0.15,
      duration: 1.5,
      ease: "power3.inOut",
    });
  },
});

document.querySelectorAll("[fade-in]").forEach((element) => {
  gsap.set(element, {
    opacity: 0,
  });
});

ScrollTrigger.batch("[fade-in]", {
  start: "top bottom",
  end: "bottom top",
  // markers: true,
  onEnter: (elements, triggers) => {
    gsap.to(elements, {
      opacity: 1,
      stagger: 0.1,
      duration: 3,
      ease: "power3.inOut",
    });
  },
});

document.querySelectorAll("[border-reveal]").forEach((element) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
    },
    width: "0%",
    duration: 1.5,
    ease: "power4.inOut",
  });
});

document.querySelectorAll(".footer_link_content").forEach((element) => {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "none",
    },
  });
  tl.fromTo(
    element.querySelector(".footer_link_border"),
    {
      left: "0%",
      right: "100%",
    },
    {
      left: "0%",
      right: "0%",
    }
  ).to(element.querySelector(".footer_link_border"), {
    right: "0%",
    left: "100%",
  });

  let tween = null;

  // Kill any running tween
  const stopTween = () => {
    if (tween) {
      tween.kill();
      tween = null;
    }
  };

  // Reset timeline when it's done
  tl.eventCallback("onComplete", () => {
    tl.pause(0); // Go back to start, paused
  });

  element.addEventListener("mouseenter", () => {
    // play the animation until 50%

    stopTween();

    tween = gsap.to(tl, {
      progress: 0.5,
      duration: Math.abs(tl.progress() - 0.5) * tl.duration(),
      ease: "power3.out",
    });

    gsap.to(element.querySelector(".footer_link_shadow"), {
      width: "100%",
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
  element.addEventListener("mouseleave", () => {
    stopTween();

    tween = gsap.to(tl, {
      progress: 1,
      duration: (1 - tl.progress()) * tl.duration(),
      ease: "power3.inOut",
    });

    // Optional: reset timeline after complete if you want repeat behavior
    tween.then(() => {
      tl.pause(0);
    });

    gsap.to(element.querySelector(".footer_link_shadow"), {
      width: "0%",
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
});

// console.log("From how it why");
// roll("[roll]", 80);
liveReload();
