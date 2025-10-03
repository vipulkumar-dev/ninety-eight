import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();
const lenis = lenisInit(0.15);

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
      duration: 0.8,
      ease: "power4.inOut",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn.querySelectorAll(".btn_char-mask"), {
      y: "0%",
      stagger: 0.07,
      duration: 0.8,
      ease: "power4.inOut",
    });
  });

  console.log("split", split.words);
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

(function faq_init() {
  const faq_wprs = document.querySelectorAll(".faq_wpr");

  faq_wprs.forEach((faq_wpr, index) => {
    const faq_items = faq_wpr.querySelectorAll(".faq_item");
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

const cards = document.querySelectorAll(".card_item");
let cardArray = Array.from(cards);

function initCards() {
  cardArray.forEach((card, index) => {
    const scale = 1 - index * 0.05;
    const y = index * -20;
    const visible = index < 3; // Only show first 3 cards

    // Set content opacity based on position
    let contentOpacity = 1;
    if (index === 1) contentOpacity = 0.8;
    else if (index === 2) contentOpacity = 0.3;

    gsap.set(card, {
      scale: scale,
      y: y,
      zIndex: cardArray.length - index,
      opacity: visible ? 1 : 0,
      rotation: 0,
    });

    gsap.set(card.querySelector(".card-content"), {
      opacity: contentOpacity,
    });

    if (index === 0) {
      makeCardDraggable(card);
      vibrateCard(card); // Add vibrate animation to first card
    }
  });
}

function vibrateCard(card) {
  // Create a timeline for vibration effect
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 }); // Repeat every 3 seconds

  const gsapOptions = {
    duration: 0.1,
    ease: "power2.inOut",
  };

  tl.to(card, {
    x: -3,
    ...gsapOptions,
  })
    .to(card, {
      x: 3,
      ...gsapOptions,
    })
    .to(card, {
      x: -3,
      ...gsapOptions,
    })
    .to(card, {
      x: 3,
      ...gsapOptions,
    })
    .to(card, {
      x: -2,
      ...gsapOptions,
    })
    .to(card, {
      x: 2,
      ...gsapOptions,
    })
    .to(card, {
      x: 0,
      ...gsapOptions,
    });
}

function stopVibrate(card) {
  gsap.killTweensOf(card);
  gsap.to(card, {
    x: 0,
    duration: 0.1,
  });
}

function makeCardDraggable(card) {
  Draggable.create(card, {
    type: "x,y",
    bounds: { minX: -400, maxX: 400, minY: -200, maxY: 200 },
    onDragStart: function () {
      stopVibrate(card); // Stop vibrate when user starts dragging
    },
    onDrag: function () {
      const rotation = this.x / 10;
      gsap.to(card, {
        rotation: rotation,
        duration: 0.1,
      });
    },
    onDragEnd: function () {
      const threshold = 100;

      if (Math.abs(this.x) > threshold || Math.abs(this.y) > threshold) {
        // Card swiped away - don't restart vibrate
        const direction = this.x > 0 ? 1 : -1;

        gsap.to(card, {
          x: direction * 1000,
          y: this.y * 2,
          rotation: direction * 45,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            // Move card to end of array
            cardArray.shift();
            cardArray.push(card);

            // Reset card position and add to end
            const newIndex = cardArray.length - 1;
            gsap.set(card, {
              x: 0,
              y: newIndex * -20,
              rotation: 0,
              opacity: 0,
              scale: 1 - newIndex * 0.05,
              zIndex: cardArray.length - newIndex,
            });

            // Animate remaining cards
            cardArray.forEach((c, i) => {
              const scale = 1 - i * 0.05;
              const y = i * -20;
              const visible = i < 3; // Only show first 3 cards

              // Set content opacity based on position
              let contentOpacity = 1;
              if (i === 1) contentOpacity = 0.8;
              else if (i === 2) contentOpacity = 0.3;

              gsap.to(c, {
                scale: scale,
                y: y,
                opacity: visible ? 1 : 0,
                zIndex: cardArray.length - i,
                duration: 0.3,
                ease: "power2.out",
              });

              gsap.to(c.querySelector(".card-content"), {
                opacity: contentOpacity,
                duration: 0.3,
                ease: "power2.out",
              });
            });

            // Make next card draggable (no vibrate after first swipe)
            setTimeout(() => {
              makeCardDraggable(cardArray[0]);
            }, 300);
          },
        });
      } else {
        // Snap back and restart vibrate
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            vibrateCard(card); // Restart vibrate only if card snapped back
          },
        });
      }
    },
  });
}

initCards();

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
  const elements = document.querySelectorAll(
    "[basic-reveal],[fade-reveal],[para-reveal],[word-reveal]"
  );

  elements.forEach((element) => {
    let startValue = element.hasAttribute("bottom-100")
      ? "top 100%"
      : "top 85%"; // default

    ScrollTrigger.create({
      trigger: element,
      start: startValue,
      end: startValue,
      anticipatePin: 1,
      // markers: true,
      onEnter: () => {
        const animateItems = [];

        if (element.hasAttribute("basic-reveal")) {
          animateItems.push(element);
        }
        if (element.hasAttribute("para-reveal")) {
          element.querySelectorAll(".para_line").forEach((line) => {
            animateItems.push(line);
          });
        }
        if (element.hasAttribute("word-reveal")) {
          element.querySelectorAll(".para_word").forEach((word) => {
            animateItems.push(word);
          });
        }
        if (element.hasAttribute("fade-reveal")) {
          animateItems.push(element);
        }

        gsap.to(animateItems, {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 1,
          delay: (index, target) => {
            if (target.hasAttribute("extra-time")) return 0.1;
            if (target.hasAttribute("extra-more-time")) return 0.2;
            return 0;
          },
          ease: "power4.inOut",
        });
      },
    });
  });
}

initReveal();

const webflowLottie = Webflow.require("lottie").lottie;
webflowLottie.setQuality("low");

const allAnimations = webflowLottie.getRegisteredAnimations();

console.log("allAnimations", allAnimations);

// Function to handle Lottie animation visibility
function handleLottieVisibility() {
  // Create intersection observer options
  const options = {
    root: null, // use viewport as root
    rootMargin: "0px",
    threshold: 0, // trigger when at least 10% of the element is visible
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Find the Lottie animation for this element
      const animation = allAnimations.find(
        (anim) => anim.wrapper === entry.target
      );

      if (animation) {
        if (entry.isIntersecting) {
          // Play animation when in view
          animation.play();
        } else {
          // Pause animation when out of view
          animation.pause();
        }
      }
    });
  }, options);

  // Observe each Lottie animation wrapper
  allAnimations.forEach((animation) => {
    if (animation.wrapper) {
      observer.observe(animation.wrapper);
    }
  });
}

// Initialize the Lottie visibility handling
handleLottieVisibility();

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

liveReload();
