import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

(function scrollResotration() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Prevent scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  });
})();

/*
Returns a FUNCTION that you can feed an element to get its scroll position.
- targets: selector text, element, or Array of elements
- config: an object with any of the following optional properties:
- start: defaults to "top top" but can be anything like "center center", "100px 80%", etc. Same format as "start" and "end" ScrollTrigger values.
- containerAnimation: the horizontal scrolling tween/timeline. Must have an ease of "none"/"linear".
- pinnedContainer: if you're pinning a container of the element(s), you must define it so that ScrollTrigger can make the proper accommodations.
*/
function getScrollLookup(
  targets,
  { start, pinnedContainer, containerAnimation }
) {
  let triggers = gsap.utils.toArray(targets).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: start || "top top",
        pinnedContainer: pinnedContainer,
        refreshPriority: -10,
        containerAnimation: containerAnimation,
      })
    ),
    st = containerAnimation && containerAnimation.scrollTrigger;
  return (target) => {
    let t = gsap.utils.toArray(target)[0],
      i = triggers.length;
    while (i-- && triggers[i].trigger !== t) {}
    if (i < 0) {
      return console.warn("target not found", target);
    }
    return containerAnimation
      ? st.start +
          (triggers[i].start / containerAnimation.duration()) *
            (st.end - st.start)
      : triggers[i].start;
  };
}

(function initNavItemScroll() {
  // Initialize scroll lookup after ScrollTriggers are created
  let getPosition;

  // Wait for ScrollTriggers to initialize, then create lookup
  gsap.delayedCall(0.1, () => {
    // Get all target elements for the lookup
    const targetElements = [];
    document.querySelectorAll(".nav_item").forEach((link) => {
      const targetId = link.getAttribute("data-href");
      if (targetId) targetElements.push(targetId);
    });

    getPosition = getScrollLookup(targetElements, {
      start: "top top",
    });
  });

  document.querySelectorAll(".nav_item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("data-href"); // e.g. "#section"
      const targetEl = document.querySelector(`${targetId}`);
      console.log(targetEl);

      if (targetEl && getPosition) {
        gsap.to(window, {
          duration: 1,
          scrollTo: getPosition(targetId), // Use calculated position
          ease: "power2.inOut",
        });
      }
      console.log("nav link clicked");
    });
  });
})();

const { isDesktop, isMobile } = getDevices();

// const lenis = lenisInit(0.15);

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
}

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
          // lenis.resize();
          ScrollTrigger.refresh();
        },
      })
      .to(
        faqItem,
        {
          borderRadius: "6px",
        },
        0
      )
      .fromTo(
        faqItem.querySelector(".faq_body"),
        {
          height: 0,
        },
        {
          height: "auto",
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        },
        0
      )
      .to(
        faqItem.querySelectorAll(".faq_icon"),
        {
          rotate: -180,
        },
        0
      );

    return faqTl;
  }
})();

(function popup_init() {
  const popupTriggers = document.querySelectorAll("[popup-trigger]");
  const closeTriggers = document.querySelectorAll("[popup-close]");

  const popup_animation = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.8,
      ease: "power4.inOut",
    },
  });

  popup_animation
    .to(
      ".popup_wpr",
      {
        autoAlpha: 1,
        pointerEvents: "auto",
      },
      0
    )
    .to(
      [".close_area"],
      {
        backdropFilter: "blur(30px)",
        backgroundColor: "rgba(13, 12, 16, 0.8)",
      },
      0
    )
    .from(
      "[popup-content]",
      {
        scale: 0.9,
      },
      0
    );

  popupTriggers.forEach((popupTrigger) => {
    popupTrigger.addEventListener("click", () => {
      popup_animation.play();
    });
  });
  closeTriggers.forEach((closeTrigger) => {
    closeTrigger.addEventListener("click", () => {
      popup_animation.reverse();
    });
  });
})();

(function tabAnimation() {
  const tabs = document.querySelectorAll(".tabs");

  // Create the timeline
  const tl = gsap.timeline();

  const clickableElements = document.querySelectorAll("[data-scroll-tab]");

  // Helper function to set active tab
  function setActiveTab(labelName) {
    clickableElements.forEach((el) => el.classList.remove("active"));
    const activeElement = Array.from(clickableElements).find(
      (el) => el.getAttribute("data-scroll-tab") === labelName
    );
    if (activeElement) {
      activeElement.classList.add("active");
    }
  }

  // Add opacity animations to the timeline with onStart and onReverseComplete callbacks
  tl.add("first")
    .to(".tab_content", {
      duration: 1,
    })
    .to(".tab_content.first", {
      opacity: 0,
      filter: "blur(3px)",
      duration: 3,
      ease: "power3.inOut",
      onUpdate: function () {
        if (this.progress() >= 0.5) {
          setActiveTab("second");
        } else {
          setActiveTab("first");
        }
      },
    })
    .to(
      ".tab_content.second",
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.inOut",
      },
      "<"
    )
    .add("second")
    .to(".tab_content", {
      duration: 2,
    })
    .to(".tab_content.second", {
      opacity: 0,
      filter: "blur(3px)",
      duration: 3,
      ease: "power3.inOut",
      onUpdate: function () {
        if (this.progress() >= 0.5) {
          setActiveTab("third");
        } else {
          setActiveTab("second");
        }
      },
    })
    .to(
      ".tab_content.third",
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.inOut",
      },
      "<"
    )
    .add("third")
    .to(".tab_content", {
      duration: 2,
    })
    .to(".tab_content.third", {
      opacity: 0,
      filter: "blur(3px)",
      duration: 3,
      ease: "power3.inOut",
      onUpdate: function () {
        if (this.progress() >= 0.5) {
          setActiveTab("fourth");
        } else {
          setActiveTab("third");
        }
      },
    })
    .to(
      ".tab_content.fourth",
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.inOut",
      },
      "<"
    )
    .add("fourth");

  // Set initial active state
  setActiveTab("first");

  ScrollTrigger.create({
    trigger: ".tab_wpr",
    start: "center center",
    end: "+=1500px",
    pin: ".section_wpr",
    animation: tl,
    scrub: 1,
  });

  clickableElements.forEach((element) => {
    element.addEventListener("click", () => {
      const targetLabel = element.getAttribute("data-scroll-tab");

      if (targetLabel) {
        gsap.to(window, {
          scrollTo: tl.scrollTrigger.labelToScroll(targetLabel),
          duration: 0.8,
          ease: "power3.inOut",
        });
      }
    });
  });
})();

// Split lines for [para-reveal] and words for [word-reveal], then set initial opacity
["para-reveal", "word-reveal"].forEach((attr) => {
  document.querySelectorAll(`[${attr}]`).forEach((el) => {
    new SplitText(el, {
      type: attr === "para-reveal" ? "lines" : "words",
      deepslice: true,
      linesClass: attr === "para-reveal" ? "para_line" : undefined,
      wordsClass: attr === "word-reveal" ? "para_word" : undefined,
    });
    gsap.set(el, { opacity: 1 });
  });
});

function initReveal() {
  ScrollTrigger.batch(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]",
    {
      start: "top bottom",
      end: "top bottom",
      anticipatePin: 1,
      // pinnedContainer: ".section_wpr",
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
          filter: "blur(0px)",
          opacity: 1,
          stagger: 0.05,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.3;
            }
            if (target.hasAttribute("extra-more-time")) {
              return 2;
            }
            return 1;
          },
          ease: "power3.inOut",
        });
      },
    }
  );
}

initReveal();

(function playPauseVideo() {
  const videos = document.querySelectorAll(".auto_video");

  videos.forEach((video) => {
    video.muted = true;

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - restore sources and play
            console.log("play");
            restoreVideoSources(video);
            video.play().catch((error) => {
              console.log("Error playing video:", error);
            });
          } else {
            // Video is out of view - clean up all sources
            console.log("pause");
            video.pause();
            clearAllVideoSources(video);
          }
        });
      },
      { threshold: 0, rootMargin: "200px" }
    );

    observer.observe(video);
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

  // Trigger load to apply new sources
  video.load();
}

liveReload();
