import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";
gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = lenisInit();
const { isDesktop, isMobile } = getDevices();
const header = document.getElementById("header");

if (header) {
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

  const nav_items_tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power4.inOut",
    },
  });

  menu_tl
    .to(".menu_line.top", { y: "6.5px" })
    .to(".menu_line.bottom", { y: "-6.5px" }, "<")
    .to(".menu_line.top", { rotate: 225, width: "82%", duration: 0.5 })
    .to(".menu_line.bottom", { rotate: -45, width: "82%" }, "<")
    .fromTo(
      ".navigation_wrapper",
      { y: "-100%" },
      { y: "0%", duration: 2 },
      "-=1.3"
    );

  nav_items_tl.fromTo(
    ".nav_animate .nav_item",
    {
      y: "150%",
      opacity: 0,
      scaleY: 2,
      transformOrigin: "top",
    },
    {
      y: "0%",
      opacity: 1,
      scaleY: 1,
      stagger: 0.07,
      delay: 0.4,
      duration: 1.3,
    }
  );

  const menu_trigger = document.querySelector(".menu_trigger");

  menu_trigger?.addEventListener("click", () => {
    if (!isMenuOpen) {
      menu_tl.play();
      // Only play nav_items_tl if it's not already playing or active
      if (!nav_items_tl.isActive()) {
        nav_items_tl.play(0);
      } // always play forward
    } else {
      menu_tl.reverse();
      // Don't reverse nav_items_tl (skip it)
    }
    isMenuOpen = !isMenuOpen;
  });
}

function wiggle(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    // wiggleProp(el, "scale", 0.93, 1);
    // wiggleProp(el, "rotation", -5, 5);
    wiggleProp(el, "x", -3, 3);
    wiggleProp(el, "y", -5, 5);
  });
}

function wiggleProp(element, prop, min, max) {
  const duration = Math.random() * (0.6 - 0.3) + 1;

  const tweenValue = Math.random() * (max - min) + min;

  gsap.to(element, {
    [prop]: tweenValue,
    duration: duration,
    ease: "power1.inOut",
    onComplete: () => wiggleProp(element, prop, min, max),
  });
}

wiggle("[wiggle]");
if (isDesktop) {
  document.querySelectorAll(".press_item").forEach((press_item) => {
    const split = new SplitText(press_item.querySelector(".press_item_txt"), {
      type: "lines",
      linesClass: "press_item_line",
      deepslice: true,
      mask: "lines",
    });
    press_item.addEventListener("mouseenter", () => {
      gsap.to(press_item.querySelector(".press_item_content"), {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
      });

      gsap.fromTo(
        split.lines,
        { y: "150%" },
        {
          y: "0%",
          duration: 0.5,
          stagger: 0.04,
          delay: 0.1,
          ease: "power3.inOut",
        }
      );
    });

    press_item.addEventListener("mouseleave", () => {
      gsap.to(press_item.querySelector(".press_item_content"), {
        height: "0",
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
    });
  });
}

document.querySelectorAll(".btn").forEach((btn) => {
  let split = new SplitText(btn, {
    type: "words",
    wordsClass: "btn_char",
    deepslice: true,
    mask: "words",
  });

  split.words.forEach((word) => {
    setwordAnimation(word);
  });

  gsap.set(".btn_char-mask", {
    overflow: "visible",
  });

  btn.addEventListener("mouseenter", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "-100%",
      stagger: 0.07,
      duration: 1,
      ease: "power4.inOut",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "0%",
      stagger: 0.07,
      duration: 1,
      ease: "power4.inOut",
    });
  });

  console.log("split", split.words);
});

document.querySelectorAll("[magnet]").forEach((magnet) => {
  const magnetButton = magnet;
  const shapka = magnetButton.querySelector(".shapka");
  const strength = magnetButton.getAttribute("magnet") || 200;

  if (isDesktop) {
    magnetButton.addEventListener("mousemove", handleMagnetMove);
    magnetButton.addEventListener("mouseout", handleMagnetOut);
  }
  function handleMagnetOut(event) {
    gsap.to([magnetButton, shapka], {
      x: 0,
      y: 0,
      ease: "elastic.out(1,0.4)",
      duration: 1.5,
    });
  }

  function handleMagnetMove(event) {
    const bounding = magnetButton.getBoundingClientRect();
    const magneticWidth =
      (event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5;
    const magneticHeight =
      (event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5;

    gsap.to(magnetButton, {
      x: magneticWidth * strength,
      y: magneticHeight * strength,
      ease: "power2.out",
      duration: 1,
    });
    // shapka should be pointer events none

    if (shapka) {
      gsap.to(shapka, {
        x: magneticWidth * (strength / 2),
        y: magneticHeight * (strength / 2),
        ease: "power2.out",
        duration: 1,
      });
    }

    //magnetButton.style.transform = 'translate(' + (((( event.clientX - bounding.left)/(magnetButton.offsetWidth))) - 0.5) * strength + 'px,'+ (((( event.clientY - bounding.top)/(magnetButton.offsetHeight))) - 0.5) * strength + 'px)';
  }
});

function setwordAnimation(word) {
  // clone the word element
  const clone = word.cloneNode(true);
  word.parentNode.appendChild(clone);

  gsap.set(clone, {
    position: "absolute",
    top: "100%",
    left: 0,
    // y: "100%",
    // opacity: 0,
    // duration: 0.5,
    // ease: "power4.out",
  });
}

(function hoverlinkEffect() {
  document.querySelectorAll("[hover-link]").forEach((link) => {
    let split = new SplitText(link.querySelector("p"), {
      type: "words",
      wordsClass: "link_char",
      deepslice: true,
      mask: "words",
    });

    split.words.forEach((word) => {
      setwordAnimation(word);
    });

    gsap.set(".link_char-mask", {
      overflow: "visible",
    });

    link.addEventListener("mouseenter", () => {
      gsap.to(link.querySelectorAll(".link_char-mask"), {
        y: "-100%",
        stagger: 0.07,
        duration: 1,
        ease: "power4.inOut",
      });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(link.querySelectorAll(".link_char-mask"), {
        y: "0%",
        stagger: 0.07,
        duration: 1,
        ease: "power4.inOut",
      });
    });

    // console.log("split", split.words);
  });
})();

if (isDesktop) {
  document.querySelectorAll("[parallax-image]").forEach((image) => {
    const parallaxAmount = image.getAttribute("parallax-image");
    gsap.fromTo(
      image,
      {
        y: Number(parallaxAmount),
      },
      {
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          pinnedContainer: ".section_pin",
          scrub: true,
          // markers: true,
        },
        y: -1 * Number(parallaxAmount),
        duration: 1,
        ease: "none",
      }
    );

    const purpose_image_bg_tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.4,
        ease: "power3.inOut",
      },
    });

    purpose_image_bg_tl.set(image.querySelectorAll(".purpose_image_bg"), {
      opacity: 1,
    });
    purpose_image_bg_tl.to(image.querySelector(".purpose_image_bg.first"), {
      rotate: -20,
      x: "-100px",
    });

    purpose_image_bg_tl.to(
      image.querySelector(".purpose_image_bg.second"),
      {
        rotate: 20,
        x: "100px",
      },
      "<"
    );

    image.addEventListener("mouseenter", () => {
      purpose_image_bg_tl.play();
    });

    image.addEventListener("mouseleave", () => {
      purpose_image_bg_tl.reverse();
    });
  });
}

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    mask: "lines",
    linesClass: "para_line",
  });
});

gsap.set("[para-reveal]", {
  opacity: 1,
});

document.querySelectorAll("[chars-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "chars",
    deepslice: true,
    mask: "chars",
    charsClass: "para_chars",
  });
});

gsap.set("[chars-reveal]", {
  opacity: 1,
});

gsap.set("[rotate-reveal]", {
  rotate: 60,
  scale: 0,
});

ScrollTrigger.batch("[reveal]", {
  start: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    if (eltrigger.hasAttribute("basic-reveal")) {
      return `top-=${eltriggerHeight}px bottom`;
    }
    return "top bottom";
  },
  end: (scrollInstance) => {
    const eltrigger = scrollInstance.trigger;
    const eltriggerHeight = eltrigger.clientHeight * 1.4;
    if (eltrigger.hasAttribute("basic-reveal")) {
      return `top-=${eltriggerHeight}px bottom`;
    }
    return "top bottom";
  },
  pinnedContainer: ".section_pin",
  // markers: true,
  onEnter: (elements, triggers) => {
    const animateItems = [];

    elements.forEach((element) => {
      if (element.hasAttribute("basic-reveal")) {
        animateItems.push(element);
      }
      if (element.hasAttribute("para-reveal")) {
        // console.log("para", element);
        element.querySelectorAll(".para_line").forEach((line) => {
          animateItems.push(line);
        });
      }

      if (element.hasAttribute("chars-reveal")) {
        // console.log("chars", element);
        element.querySelectorAll(".para_chars").forEach((char) => {
          animateItems.push(char);
        });
      }
      if (element.hasAttribute("fade-reveal")) {
        animateItems.push(element);
      }
    });
    // console.log("animateItems", animateItems);

    gsap.to(animateItems, {
      y: "0%",
      opacity: 1,
      scale: 1,
      rotate: "0deg",
      stagger: 0.05,
      duration: 1.5,
      ease: "power4.inOut",
    });
  },
});

(function timelineTextEffect() {
  document
    .querySelectorAll(".txt_timeline_container")
    .forEach((txt_timeline_container) => {
      const txt_timeline_tl = gsap.timeline({
        // paused: true,
        repeat: -1,
        defaults: {
          duration: 1.1,
          ease: "power4.inOut",
        },
      });
      const txt_timeline_items =
        txt_timeline_container.querySelectorAll(".txt_timeline_item");
      const txt_timeline_wpr =
        txt_timeline_container.querySelector(".txt_timeline_wpr");

      txt_timeline_items.forEach((timeline_item, index) => {
        const nextIndex =
          index == txt_timeline_items.length - 1 ? 0 : index + 1;

        console.log(txt_timeline_items[nextIndex].clientWidth);

        txt_timeline_tl.fromTo(
          txt_timeline_items[index],
          { opacity: 1, y: "0%" },
          {
            opacity: 0,
            y: "-100%",
          }
        );
        txt_timeline_tl.fromTo(
          txt_timeline_items[nextIndex],
          {
            opacity: 0,
            y: "100%",
          },
          {
            opacity: 1,
            y: "0%",
          },
          "<"
        );
        txt_timeline_tl.to(
          txt_timeline_wpr,
          {
            width: txt_timeline_items[nextIndex].clientWidth,
          },
          "<"
        );
        txt_timeline_tl.to(txt_timeline_wpr, {});
      });
    });
})();

(function overlapEffect() {
  if (isMobile) {
    return;
  }
  document.querySelectorAll(".overlay_section").forEach((overlay_section) => {
    gsap.set(overlay_section.querySelector(".overlay_wpr"), {
      y: "-50%",
    });

    gsap.to(overlay_section.querySelector(".overlay_wpr"), {
      y: "0%",
      duration: 1,
      ease: "none",
      scrollTrigger: {
        trigger: overlay_section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        // pin: true,
        // markers: true,
      },
    });
  });
})();

document.querySelectorAll("[parallax-wpr]").forEach((image) => {
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
  let PARALLAXAMOUNT = isDesktop ? 100 : 50;
  if (image.hasAttribute("no-parallax")) {
    PARALLAXAMOUNT = 0;
  }

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

ScrollTrigger.batch(".parallax-image-wrapper", {
  start: "top bottom",
  end: "bottom top",
  onEnter: (elements) => {
    gsap.to(elements, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      duration: 1.5,
      delay: 0.5,
      ease: "power4.inOut",
      stagger: 0.3,
    });

    const elementImages = elements.map((element) =>
      element.querySelector("[parallax-wpr]")
    );

    gsap.to(elementImages, {
      scale: 1,
      duration: 1.5,
      delay: 0.5,
      ease: "power4.inOut",
      stagger: 0.3,
    });
  },
});
gsap.set("[parallax-wpr]", {
  opacity: 1,
});

roll("[roll]", 60);

liveReload();
