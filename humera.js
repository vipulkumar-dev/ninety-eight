function lenisInit(lerp = 0.1) {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis({
    lerp,
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

function getDevices() {
  return {
    isDesktop: window.innerWidth > 991,
    isMobile: window.innerWidth < 991,
  };
}

const { isDesktop, isMobile } = getDevices();

let lenis;
if (isDesktop) {
  lenis = lenisInit(0.15);
}

// Force scroll to top immediately

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
    .to(".menu_line.top", { y: "5px" })
    .to(".menu_line.bottom", { y: "-5px" }, "<")
    .to(".menu_line.top", { rotate: 225, width: "82%", duration: 0.5 })
    .to(".menu_line.bottom", { rotate: -45, width: "82%" }, "<")
    .fromTo(
      ".navigation_wrapper",
      { y: "-100%" },
      { y: "0%", duration: 1 },
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

let hoverTimeout;
let isFirstHover = true;

document.querySelectorAll(".backed_item").forEach((item, _, allItems) => {
  item.addEventListener("mouseenter", () => {
    // Clear any existing timeout
    clearTimeout(hoverTimeout);

    // Add delay only for first hover
    const delay = isFirstHover ? 100 : 0;

    hoverTimeout = setTimeout(() => {
      allItems.forEach((el) => {
        if (el !== item) {
          el.classList.add("unactive");
          el.classList.remove("active");
        } else {
          el.classList.add("active");
          el.classList.remove("unactive");
        }
      });

      gsap.fromTo(
        item.querySelectorAll(".backed_label"),
        {
          y: 15,
          scale: 0,
          transformOrigin: "center bottom",
          filter: "blur(15px)",
          opacity: 0,
          rotate: "-20deg",
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "center bottom",
          filter: "blur(0px)",
          rotate: "0deg",
          duration: 0.4,
          ease: "power4.inOut",
        }
      );

      // Mark that first hover is done
      isFirstHover = false;
      console.log("Mouse entered:", item);
    }, delay);
  });
});

document.querySelectorAll("[backed-wpr]").forEach((wrapper) => {
  wrapper.addEventListener("mouseleave", () => {
    // Clear timeout on mouseleave
    clearTimeout(hoverTimeout);

    // Reset first hover state
    isFirstHover = true;

    document.querySelectorAll(".backed_item").forEach((el) => {
      el.classList.remove("active", "unactive");
    });
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
          stagger: 0.04,
          duration: (index, target) => {
            if (target.hasAttribute("extra-time")) {
              return 1.3;
            }
            return 0.5;
          },
          ease: "power3.inOut",
        });
      },
    }
  );
}

if (isLoader) {
  setTimeout(() => {
    initReveal();
  }, 3000);
} else {
  initReveal();
}

gsap.to("[loading-animation]", {
  opacity: 0,
  filter: "blur(1px)",
  duration: 0.7,
  delay: 3,
  ease: "power4.inOut",
});

// gsap.to(".loading_bg", {
//   opacity: 1,
//   duration: 0.7,
//   ease: "power4.inOut",
// });

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
          if (lenis) lenis.resize();
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
      .to(
        faqItem.querySelector(".faq_body"),
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

ScrollTrigger.batch(".auto_video", {
  onEnter: (batch) => batch.forEach((v) => v.play()),
  onEnterBack: (batch) => batch.forEach((v) => v.play()),
  onLeave: (batch) => batch.forEach((v) => v.pause()),
  onLeaveBack: (batch) => batch.forEach((v) => v.pause()),
  start: "top 80%",
  end: "bottom 20%",
  markers: false,
});

try {
  (function clickItems_init() {
    const items = document.querySelectorAll(".click-item");
    let activeIndex = null;
    let currentIndex = 0; // Track current item in cycle
    const timelines = [];
    let autoCycleInterval = null;
    const cycleDuration = 3000; // 3 seconds per item

    // Auto-cycle function
    function startAutoCycle() {
      if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
      }

      autoCycleInterval = setInterval(() => {
        // Close current item
        if (activeIndex !== null) {
          timelines[activeIndex].reverse();
          items[activeIndex].isActive = false;
        }

        // Move to next item
        currentIndex = (currentIndex + 1) % items.length;

        // Open next item
        const nextItem = items[currentIndex];
        const nextTimeline = timelines[currentIndex];
        nextTimeline.play();
        nextItem.isActive = true;
        activeIndex = currentIndex;
      }, cycleDuration);
    }

    // Stop auto-cycle
    function stopAutoCycle() {
      if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
        autoCycleInterval = null;
      }
    }

    items.forEach((item, index) => {
      item.isActive = false;
      const itemTl = itemTimeline(item);
      timelines[index] = itemTl;

      item.addEventListener("click", () => {
        if (!item.isActive) {
          // Close any open item
          if (activeIndex !== null && activeIndex !== index) {
            timelines[activeIndex].reverse();
            items[activeIndex].isActive = false;
          }
          itemTl.play();
          item.isActive = true;
          activeIndex = index;
          currentIndex = index; // Update current index to continue from here

          // Restart auto-cycle from this new position
          startAutoCycle();
        }
        // Auto-cycle continues running regardless of manual clicks
      });
    });

    // Initialize: open first item and start auto-cycle
    if (items.length > 0) {
      items[0].click(); // auto-open first item
      startAutoCycle();
    }

    function itemTimeline(item) {
      const content = item.querySelector(".click-content");

      const itemTl = gsap
        .timeline({
          paused: true,
          defaults: {
            duration: 0.4,
            ease: "power3.inOut",
          },
        })
        .to(item.querySelector(".item-header"), {
          scale: 1.5,
          color: "#001a33",
        })
        .to(
          content,
          {
            height: "auto",
            opacity: 1,
          },
          "<"
        );

      return itemTl;
    }
  })();
} catch (err) {
  console.log(err);
}

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

      // Scroll active tab to center on mobile
      const tabWpr = document.querySelector(".tab_wpr");
      if (tabWpr) {
        const tabWprRect = tabWpr.getBoundingClientRect();
        const activeElementRect = activeElement.getBoundingClientRect();

        // Calculate center position
        const scrollLeft =
          activeElement.offsetLeft -
          tabWprRect.width / 2 +
          activeElementRect.width / 2;

        // Smooth scroll to center the active tab
        gsap.to(tabWpr, {
          scrollLeft: scrollLeft,
          duration: 0.6,
          ease: "power3.out",
        });
      }
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
    .add("fourth")
    .to(".tab_content", {
      duration: 2,
    })
    .to(".tab_content.fourth", {
      opacity: 0,
      filter: "blur(3px)",
      duration: 3,
      ease: "power3.inOut",
      onUpdate: function () {
        if (this.progress() >= 0.5) {
          setActiveTab("fifth");
        } else {
          setActiveTab("fourth");
        }
      },
    })
    .to(
      ".tab_content.fifth",
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.inOut",
      },
      "<"
    )
    .add("fifth");

  // Set initial active state
  setActiveTab("first");

  ScrollTrigger.create({
    trigger: ".section_tabs",
    start: "center center",
    end: "+=2000px",
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

try {
  (function clickItems_init() {
    const items = document.querySelectorAll(".click-item");
    let activeIndex = null;
    let currentIndex = 0; // Track current item in cycle
    const timelines = [];
    let autoCycleInterval = null;
    const cycleDuration = 4000; // 3 seconds per item

    // Auto-cycle function
    function startAutoCycle() {
      if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
      }

      autoCycleInterval = setInterval(() => {
        // Close current item
        if (activeIndex !== null) {
          timelines[activeIndex].reverse();
          items[activeIndex].isActive = false;
        }

        // Move to next item
        currentIndex = (currentIndex + 1) % items.length;

        // Open next item
        const nextItem = items[currentIndex];
        const nextTimeline = timelines[currentIndex];
        nextTimeline.play();
        nextItem.isActive = true;
        activeIndex = currentIndex;
      }, cycleDuration);
    }

    // Stop auto-cycle
    function stopAutoCycle() {
      if (autoCycleInterval) {
        clearInterval(autoCycleInterval);
        autoCycleInterval = null;
      }
    }

    items.forEach((item, index) => {
      item.isActive = false;
      const itemTl = itemTimeline(item);
      timelines[index] = itemTl;

      item.addEventListener("click", () => {
        if (!item.isActive) {
          // Close any open item
          if (activeIndex !== null && activeIndex !== index) {
            timelines[activeIndex].reverse();
            items[activeIndex].isActive = false;
          }
          itemTl.play();
          item.isActive = true;
          activeIndex = index;
          currentIndex = index; // Update current index to continue from here

          // Restart auto-cycle from this new position
          startAutoCycle();
        }
        // Auto-cycle continues running regardless of manual clicks
      });
    });

    // Initialize: open first item and start auto-cycle
    if (items.length > 0) {
      items[0].click(); // auto-open first item
      startAutoCycle();
    }

    function itemTimeline(item) {
      const content = item.querySelector(".click-content");

      const itemTl = gsap
        .timeline({
          paused: true,
          defaults: {
            duration: 0.4,
            ease: "power3.inOut",
          },
        })
        .to(item.querySelector(".item-header"), {
          scale: 1.5,
          color: "#001a33",
        })
        .to(
          content,
          {
            height: "auto",
            opacity: 1,
          },
          "<"
        );

      return itemTl;
    }
  })();
} catch (err) {
  console.log(err);
}

$(".plyr_component").each(function (index) {
  let thisComponent = $(this);

  // create plyr settings
  let player = new Plyr(thisComponent.find(".plyr_video")[0], {
    controls: [
      "play",
      "progress",
      "current-time",
      "mute",
      "fullscreen",
      "volume",
    ],
    resetOnEnd: true,
  });

  // custom video cover
  thisComponent.find(".plyr_cover").on("click", function () {
    player.play();
  });
  player.on("ended", (event) => {
    thisComponent.removeClass("hide-cover");
  });

  // pause other playing videos when this one starts playing
  player.on("play", (event) => {
    $(".plyr_component").removeClass("hide-cover");
    thisComponent.addClass("hide-cover");
    let prevPlayingComponent = $(".plyr--playing")
      .closest(".plyr_component")
      .not(thisComponent);
    if (prevPlayingComponent.length > 0) {
      prevPlayingComponent.find(".plyr_pause-trigger")[0].click();
    }
  });
  thisComponent.find(".plyr_pause-trigger").on("click", function () {
    player.pause();
  });

  // exit full screen when video ends
  player.on("ended", (event) => {
    if (player.fullscreen.active) {
      player.fullscreen.exit();
    }
  });
  // set video to contain instead of cover when in full screen mode
  player.on("enterfullscreen", (event) => {
    thisComponent.addClass("contain-video");
  });
  player.on("exitfullscreen", (event) => {
    thisComponent.removeClass("contain-video");
  });
});

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

  // Reload the video with new sources
  video.load();

  // Wait for the video to be ready before playing
  const onLoaded = () => {
    video.play().catch((err) => console.log("Error playing video:", err));
    video.removeEventListener("loadeddata", onLoaded);
  };

  video.addEventListener("loadeddata", onLoaded);
}
