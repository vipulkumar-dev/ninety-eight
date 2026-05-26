import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";
import { lenisInit } from "../utils.js";

const { isDesktop, isMobile } = getDevices();

const lenis = lenisInit(0.15);

const header = document.getElementById("header");
if (header) {
  let isMenuOpen = false;
  let lastScrollPosition = 0;
  let delta = isDesktop ? 70 : 100; // Minimum scroll distance before toggling header
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
    .to(".menu-line-wpr", {
      gap: "0px",
    })
    .set(".menu-line.bottom", {
      width: "100%",
    })
    .set(".menu-line.middle", {
      opacity: 0,
    })
    .to(".menu-line.top", {
      rotate: "45deg",
    })
    .to(
      ".menu-line.bottom",
      {
        rotate: "-45deg",
      },
      "<",
    )
    .fromTo(
      ".navigation_wrapper",
      { y: "-100%" },
      { y: "0%", duration: 0.7 },
      "<",
    );

  const menu_trigger = document.querySelector("[menu_trigger]");

  menu_trigger?.addEventListener("click", () => {
    if (!isMenuOpen) {
      menu_tl.play();
    } else {
      menu_tl.reverse();
    }
    isMenuOpen = !isMenuOpen;
  });
}

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    centeredSlidesBounds: true,
    autoplay: {
      delay: 3000,
    },
    loop: true,
    navigation: {
      nextEl: document.querySelector(".swiper_next"),
      prevEl: document.querySelector(".swiper_prev"),
    },
  });
});

(function faq_init() {
  const faq_items = document.querySelectorAll(".faq_item");
  let activeIndex = null;
  const timelines = [];

  faq_items.forEach((faqItem, index) => {
    faqItem.isActive = false;
    const faqTl = faqTimeline(faqItem);
    timelines[index] = faqTl;

    faqItem.addEventListener("click", () => {
      if (!faqItem.isActive) {
        // Close any open item
        if (activeIndex !== null && activeIndex !== index) {
          timelines[activeIndex].reverse();
          faq_items[activeIndex].isActive = false;
        }
        faqTl.play();
        faqItem.isActive = true;
        activeIndex = index;
      } else {
        faqTl.reverse();
        faqItem.isActive = false;
        activeIndex = null;
      }
    });

    if (index === 0) {
      faqItem.click(); // auto-open first item
    }
  });

  function faqTimeline(faqItem) {
    const faqTl = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.4,
          ease: "power3.inOut",
        },
        onReverseComplete: () => {
          lenis.resize();
          ScrollTrigger.refresh();
        },
      })
      .to(
        faqItem,
        {
          borderRadius: "6px",
          opacity: 1,
        },
        0,
      )
      .to(
        faqItem.querySelector(".faq_body"),
        {
          height: "auto",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        },
        0,
      )
      .to(
        faqItem.querySelectorAll(".faq_icon"),
        {
          rotate: -180,
        },
        0,
      )
      .to(
        faqItem.querySelector(".plus-icon"),
        {
          opacity: 0,
        },
        0,
      )
      .to(
        faqItem.querySelector(".minus-icon"),
        {
          opacity: 1,
        },
        0,
      );

    return faqTl;
  }
})();

(function menu_dropdown_init() {
  const menu_dropdown_items = document.querySelectorAll(".menu_dropdown_item");
  let activeIndex = null;
  const timelines = [];

  menu_dropdown_items.forEach((menu_dropdown_item, index) => {
    menu_dropdown_item.isActive = false;
    const menu_dropdown_tl = menu_dropdown_timeline(menu_dropdown_item);
    timelines[index] = menu_dropdown_tl;

    menu_dropdown_item
      .querySelector(".menu_dropdown_trigger")
      .addEventListener("click", () => {
        if (!menu_dropdown_item.isActive) {
          // Close any open item
          if (activeIndex !== null && activeIndex !== index) {
            timelines[activeIndex].reverse();
            menu_dropdown_items[activeIndex].isActive = false;
          }
          menu_dropdown_tl.play();
          menu_dropdown_item.isActive = true;
          activeIndex = index;
        } else {
          menu_dropdown_tl.reverse();
          menu_dropdown_item.isActive = false;
          activeIndex = null;
        }
      });

    if (index === 0) {
      menu_dropdown_item.click(); // auto-open first item
    }
  });

  function menu_dropdown_timeline(menu_dropdown_item) {
    const menu_dropdown_tl = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.4,
          ease: "power3.inOut",
        },
        onReverseComplete: () => {
          lenis.resize();
          ScrollTrigger.refresh();
        },
      })
      .to(
        menu_dropdown_item,
        {
          borderRadius: "6px",
          opacity: 1,
        },
        0,
      )
      .to(
        menu_dropdown_item.querySelector(".menu_dropdown_body"),
        {
          height: "auto",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        },
        0,
      )
      .to(
        menu_dropdown_item.querySelectorAll(".menu_dropdown_icon"),
        {
          rotate: 180,
        },
        0,
      )
      .to(
        menu_dropdown_item.querySelector(".plus-icon"),
        {
          opacity: 0,
        },
        0,
      )
      .to(
        menu_dropdown_item.querySelector(".minus-icon"),
        {
          opacity: 1,
        },
        0,
      );

    return menu_dropdown_tl;
  }
})();

(function menu_animation_desktop() {
  const container = document.querySelector("[data-navigation-container]");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const navHideElements = document.querySelectorAll("[data-nav-hide]");
  const header = document.querySelector("[data-element='header']");
  const allWprs = document.querySelectorAll("[data-navigation-wpr]");

  if (!container || !header || !allWprs.length) return;

  let currentWpr = null;

  function getWpr(name) {
    return document.querySelector(`[data-navigation-wpr="${name}"]`);
  }

  function hideWprInstant(wpr) {
    gsap.killTweensOf(wpr);
    gsap.set(wpr, {
      opacity: 0,
      x: 0,
      filter: "blur(0px)",
      pointerEvents: "none",
    });
  }

  function openPanel(name, incoming_dir) {
    const targetWpr = getWpr(name);
    if (!targetWpr || targetWpr === currentWpr) return;

    const targetHeight = targetWpr.offsetHeight;

    // Force-clear any wpr that isn't the current outgoing or the new target.
    // Prevents stragglers from rapid hovers (A -> B -> C) leaving B visible.
    allWprs.forEach((wpr) => {
      if (wpr !== targetWpr && wpr !== currentWpr) hideWprInstant(wpr);
    });

    if (currentWpr && currentWpr !== targetWpr) {
      const outgoingWpr = currentWpr;
      gsap.killTweensOf(outgoingWpr);
      gsap.set(outgoingWpr, { pointerEvents: "none" });

      gsap.to(outgoingWpr, {
        opacity: 0,
        x: incoming_dir === "l" ? 20 : -20,
        filter: "blur(2px)",
        duration: 0.3,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => {
          gsap.set(outgoingWpr, { x: 0, filter: "blur(0px)" });
        },
      });

      gsap.killTweensOf(targetWpr);
      gsap.set(targetWpr, {
        opacity: 0,
        x: incoming_dir === "l" ? -10 : 10,
        filter: "blur(2px)",
        pointerEvents: "auto",
      });

      gsap.to(targetWpr, {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power3.inOut",
        overwrite: true,
      });

      gsap.to(container, {
        height: targetHeight,
        duration: 0.5,
        ease: "power3.inOut",
        overwrite: true,
      });
    } else {
      gsap.killTweensOf(container);
      gsap.killTweensOf(targetWpr);
      gsap.set(container, { height: 0, opacity: 0 });
      gsap.set(targetWpr, {
        display: "block",
        opacity: 0,
        x: 0,
        filter: "blur(2px)",
        pointerEvents: "auto",
      });

      gsap.to(container, {
        height: targetHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(targetWpr, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power3.out",
        delay: 0.1,
        overwrite: true,
      });
    }

    currentWpr = targetWpr;
  }

  function closePanel() {
    if (!currentWpr) return;
    const outgoingWpr = currentWpr;
    currentWpr = null;

    gsap.killTweensOf(container);
    gsap.killTweensOf(outgoingWpr);
    gsap.set(outgoingWpr, { pointerEvents: "none" });

    gsap.to(container, {
      height: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: true,
    });

    gsap.to(outgoingWpr, {
      opacity: 0,
      filter: "blur(2px)",
      duration: 0.3,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        gsap.set(outgoingWpr, { x: 0, filter: "blur(0px)" });
        // Safety sweep: ensure no panel is left interactive after a close.
        allWprs.forEach((wpr) => {
          if (wpr !== currentWpr) gsap.set(wpr, { pointerEvents: "none" });
        });
      },
    });
  }

  allWprs.forEach((wpr) => {
    gsap.set(wpr, { opacity: 0, pointerEvents: "none" });
  });
  gsap.set(container, { height: 0, opacity: 0, overflow: "hidden" });

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const name = this.getAttribute("data-nav-link");
      const targetWpr = getWpr(name);
      if (!targetWpr) return;

      let incoming_dir = null;
      if (currentWpr && currentWpr !== targetWpr) {
        const links = Array.from(navLinks);
        const currentName = currentWpr.getAttribute("data-navigation-wpr");
        const currentIndex = links.findIndex(
          (l) => l.getAttribute("data-nav-link") === currentName,
        );
        const targetIndex = links.findIndex(
          (l) => l.getAttribute("data-nav-link") === name,
        );
        incoming_dir = currentIndex > targetIndex ? "r" : "l";
      }

      openPanel(name, incoming_dir);
    });
  });

  header.addEventListener("mouseleave", closePanel);

  navHideElements.forEach((element) => {
    element.addEventListener("mouseenter", closePanel);
  });
})();

(function playPauseVideo() {
  const videos = document.querySelectorAll(".auto_video");

  videos.forEach((video) => {
    video.muted = true;

    const isScrollTriggered = video.hasAttribute("scroll-triggered");
    const isScrollOffset = video.hasAttribute("scroll-offset");
    const scrollOffset = video.getAttribute("scroll-offset");

    // Store original sources for restoration
    if (!video.dataset.originalSources) {
      const sources = video.querySelectorAll("source");
      const sourcesData = Array.from(sources).map((source) => ({
        src: source.src,
        type: source.type,
        media: source.media || "",
      }));
      video.dataset.originalSources = JSON.stringify(sourcesData);
    }

    let DefaultOffset = 0;

    if (scrollOffset) {
      DefaultOffset = parseInt(scrollOffset);
    }

    console.log("DefaultOffset", DefaultOffset);

    if (isScrollTriggered) {
      ScrollTrigger.create({
        trigger: video,
        start: `top+=${DefaultOffset}px bottom`,
        end: `bottom+=${DefaultOffset}px top`,
        pinnedContainer: isScrollOffset ? undefined : ".section_wpr",
        // markers: true,
        onEnter: () => {
          // Video is in view - restore sources and auto-play after load
          console.log("play");
          restoreVideoSources(video);
        },
        onLeave: () => {
          // Video is out of view - pause and clean sources
          console.log("pause");
          video.pause();
          clearAllVideoSources(video);
        },
        onEnterBack: () => {
          // Video is back in view when scrolling up
          console.log("play");
          restoreVideoSources(video);
        },
        onLeaveBack: () => {
          // Video is out of view when scrolling up
          console.log("pause");
          video.pause();
          clearAllVideoSources(video);
        },
      });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Video is in view - restore sources and auto-play after load
              console.log("play");
              restoreVideoSources(video);
            } else {
              // Video is out of view - pause and clean sources
              console.log("pause");
              video.pause();
              clearAllVideoSources(video);
            }
          });
        },
        { threshold: 0, rootMargin: "200px" },
      );

      observer.observe(video);
    }
  });
})();

function clearAllVideoSources(video) {
  // Remove src attribute from video element
  video.removeAttribute("src");

  // Clear all source elements
  const sources = video.querySelectorAll("source");
  sources.forEach((source) => {
    source.removeAttribute("src");
  });

  // Trigger load to release resources
  video.load();
}

function restoreVideoSources(video) {
  if (!video.dataset.originalSources) return;

  const sourcesData = JSON.parse(video.dataset.originalSources);
  const sources = video.querySelectorAll("source");

  sources.forEach((source, index) => {
    if (sourcesData[index]) {
      source.src = sourcesData[index].src;
      source.type = sourcesData[index].type;
      if (sourcesData[index].media) {
        source.media = sourcesData[index].media;
      }
    }
  });

  // Reload the video with new sources
  video.load();

  // Wait for the video to be ready before playing
  const onLoaded = () => {
    video.play().catch((err) => console.log("Error playing video:", err));
    video.removeEventListener("loadeddata", onLoaded);
  };

  video.addEventListener("loadeddata", onLoaded);
}

(function cycle_active_class_init() {
  document.querySelectorAll("[cycle-active-wpr]").forEach((wrapper) => {
    const items = wrapper.querySelectorAll("[cycle-active]");
    if (items.length < 2) return;

    let index = 0;
    let interval = null;

    const setActive = (i) => {
      items.forEach((item) => item.classList.remove("active"));
      items[i].classList.add("active");
      index = i;
    };

    const startCycle = () => {
      clearInterval(interval);
      interval = setInterval(() => {
        setActive((index + 1) % items.length);
      }, 4000);
    };

    setActive(0);
    startCycle();

    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        setActive(i);
        startCycle();
      });
    });
  });
})();

document.querySelectorAll(".btn").forEach((btn) => {
  const btnTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power4.inOut",
    },
  });

  // Set the button's minWidth to its current offsetWidth so it can't shrink smaller
  btn.style.minWidth = btn.offsetWidth + 1 + "px";

  btnTl.to(
    btn.querySelector(".right-icon"),
    {
      width: "0px",
      marginRight: "0px",
      opacity: 0,
      rotate: 90,
      filter: "blur(6px)",
      scale: 0,
      x: "-2.5em",
    },
    0,
  );
  btnTl.fromTo(
    btn.querySelector(".left-icon"),
    {
      filter: "blur(6px)",
      opacity: 0,
      scale: 0,
      rotate: -45,
      x: "2.5em",
    },
    {
      width: "0.625em",
      x: 0,
      scale: 1,
      marginLeft: "1em",
      opacity: 1,
      rotate: 45,
      filter: "blur(0px)",
    },
    0,
  );

  btn.addEventListener("mouseenter", () => {
    btnTl.play();
  });
  btn.addEventListener("mouseleave", () => {
    btnTl.reverse();
  });
});

document.querySelectorAll("[para-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "lines",
    deepslice: true,
    // mask: "lines",
    linesClass: "para_line",
  });
});

document.querySelectorAll("[word-reveal]").forEach((text) => {
  new SplitText(text, {
    type: "words",
    deepslice: true,
    // mask: "lines",
    wordsClass: "para_word",
  });
});

gsap.set("[para-reveal]", {
  opacity: 1,
});

gsap.set("[word-reveal]", {
  opacity: 1,
});

const isLoader = false;

function initReveal() {
  ScrollTrigger.batch(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]",
    {
      start: "top bottom",
      end: "top bottom",
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
          if (element.hasAttribute("word-reveal")) {
            // console.log("word", element);
            element.querySelectorAll(".para_word").forEach((word) => {
              // console.log("word", word);
              animateItems.push(word);
            });
          }
          if (element.hasAttribute("fade-reveal")) {
            animateItems.push(element);
          }
        });
        // console.log("animateItems", animateItems);

        gsap.to(animateItems, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scaleY: 1,
          stagger: 0.08,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.3;
            }
            return 0.8;
          },
          ease: "power3.inOut",
        });
      },
    },
  );
}

if (isLoader) {
  setTimeout(() => {
    initReveal();
  }, 3000);
} else {
  initReveal();
}

console.log("uplinq-new");

(function askAiButtonInit() {
  const askAiButton = document.querySelector(".ask-ai-button");
  const aiButtonsWpr = document.querySelector(".ai-buttons-wpr");
  const aiButtonsInit = document.querySelector(".ai-button-init");

  const aiBUttonsWprWidth = aiButtonsWpr.offsetWidth;

  const askAiButtonTl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power3.inOut",
    },
  });

  askAiButtonTl
    .to(
      askAiButton,
      {
        width: aiBUttonsWprWidth,
      },
      0,
    )
    .to(
      aiButtonsWpr,
      {
        opacity: 1,
      },
      0,
    )
    .to(
      aiButtonsInit,
      {
        opacity: 0,
      },
      0,
    );

  askAiButton.addEventListener("mouseenter", () => {
    askAiButtonTl.play();
  });
  askAiButton.addEventListener("mouseleave", () => {
    askAiButtonTl.reverse();
  });
})();

(function blog_item_hover_init() {
  document.querySelectorAll(".blog-item").forEach((item) => {
    const readTime = item.querySelector(".read-time-wpr");
    const hoverArrow = item.querySelector(".hover-arrow-wpr");
    if (!readTime || !hoverArrow) return;

    gsap.set(hoverArrow, { position: "absolute", inset: 0, opacity: 0 });
    gsap.set(readTime, { opacity: 1 });

    const tl = gsap
      .timeline({
        paused: true,
        defaults: { duration: 0.4, ease: "power3.inOut" },
      })
      .to(readTime, { opacity: 0, filter: "blur(4px)", y: "-40%" }, 0)
      .fromTo(
        hoverArrow,
        { opacity: 0, filter: "blur(4px)", y: "40%" },
        { opacity: 1, filter: "blur(0px)", y: "0%" },
        0,
      )
      .fromTo(hoverArrow, { filter: "blur(4px)" }, { filter: "blur(0px)" }, 0);

    item.addEventListener("mouseenter", () => tl.play());
    item.addEventListener("mouseleave", () => tl.reverse());
  });
})();

liveReload();
