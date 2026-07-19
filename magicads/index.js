import { roll, getDevices, lenisInit } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

// Smooth scroll + wire Lenis to ScrollTrigger so scrub animations update.
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
      { y: "0%", duration: 0.5 },
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

//https://hook.us2.make.com/1dajp1mas73o6alqxt7j1okw98neoynj

(function dashboardCardsReveal() {
  const cards = gsap.utils.toArray(".dashboard-card");
  if (!cards.length) return;

  gsap.registerPlugin(ScrollTrigger);

  // Don't let mobile URL-bar height changes trigger a refresh mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Trigger off the wrapper if it exists, otherwise the first card's section.
  const wrapper =
    document.querySelector(".dashboard-card-wpr") ||
    cards[0].closest("section") ||
    cards[0].parentElement;

  // Hardcoded START offset per card. x/y on inner (curved path), rotation/blur on outer.
  // POSITIONS now use percentage values relative to 750px width and 512px height
  // e.g., x: -220 becomes (-220 / 750) * 100 = -29.33%
  //       y: -520 becomes (-520 / 512) * 100 = -101.56%

  const POSITIONS = isDesktop
    ? [
        { x: "-89.33%", y: "-271.56%", rot: -8, blur: 2, scale: 0.7 }, // far top-left
        { x: "-80.00%", y: "-100.59%", rot: -14, blur: 0, scale: 0.85 }, // left
        { x: "64.67%", y: "-130.34%", rot: 10, blur: 0, scale: 0.85 }, // lower-left
        { x: "20.67%", y: "-350.09%", rot: 14, blur: 5, scale: 0.55 }, // top center-left (blurred)
        { x: "-156.00%", y: "-100.00%", rot: -8, blur: 0, scale: 0.85 }, // top center-right (blurred)
        { x: "-40.00%", y: "-50.38%", rot: -8, blur: 0, scale: 0.85 }, // top-right (blurred)
        { x: "-10%", y: "-100%", rot: -9, blur: 0, scale: 0.85 }, // right
        { x: "105.33%", y: "-203.44%", rot: 12, blur: 0, scale: 0.7 }, // lower-right
      ]
    : [
        { x: "-89.33%", y: "-271.56%", rot: -8, blur: 2, scale: 0.7 }, // far top-left
        { x: "-80.00%", y: "-100.59%", rot: -14, scale: 0.85 }, // left
        { x: "64.67%", y: "-130.34%", rot: 10, scale: 0.85 }, // lower-left
        // { x: "20.67%", y: "-350.09%", rot: 14, blur: 5, scale: 0.55 }, // top center-left (blurred)
        { x: "-156.00%", y: "-100.00%", rot: -8, scale: 0.85 }, // top center-right (blurred)
        { x: "-40.00%", y: "-50.38%", rot: -8, scale: 0.85 }, // top-right (blurred)
        { x: "20%", y: "-100%", rot: 9, scale: 0.75 }, // right
        // { x: "105.33%", y: "-203.44%", rot: 12, scale: 0.7 }, // lower-right
      ];

  const fallback = (i) => ({
    x: 0,
    y: 0,
    rot: 0,
    blur: 0,
  });

  const build = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 90%",
        end: "bottom 90%",
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
      },
    });

    cards.forEach((card, i) => {
      const inner = card.querySelector(".dashboard-card-inner") || card;
      const p = POSITIONS[i] || fallback(i);
      const at = i * 0.05; // small stagger so cards cascade in

      // x + y on inner at the same time — gentle opposing eases keep a soft
      // curve without the "slide left, then drop" feel.
      tl.fromTo(
        inner,
        { x: p.x },
        { x: 0, ease: "power3.inOut", duration: 1 },
        at,
      )
        .fromTo(
          inner,
          { y: p.y },
          { y: 0, ease: "power2.inOut", duration: 1 },
          at,
        )
        .fromTo(
          card,
          {
            rotation: p.rot,
            filter: `blur(${p.blur}px)`,
            transformOrigin: "50% 50%",
          },
          {
            rotation: 0,
            filter: "blur(0px)",
            ease: "power1.out",
            duration: 1,
          },
          at,
        )
        .fromTo(
          card,
          { scale: p.scale, transformOrigin: "50% 50%" },
          { scale: 1, ease: "none", duration: 1 },
          at,
        );
    });

    return tl;
  };

  let tl = build();

  // Mobile browsers fire resize when the URL bar shows/hides during scroll.
  // Only rebuild when the width actually changes, otherwise the rebuild +
  // ScrollTrigger.refresh() kills the scroll momentum mid-scroll.
  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      tl && tl.scrollTrigger && tl.scrollTrigger.kill();
      tl && tl.kill();
      gsap.set(cards, { clearProps: "all" });
      cards.forEach((c) => {
        const inner = c.querySelector(".dashboard-card-inner");
        if (inner) gsap.set(inner, { clearProps: "all" });
      });
      tl = build();
      ScrollTrigger.refresh();
    }, 250);
  });
})();

(function heroVideoSwiper() {
  const heroVideo = document.querySelector(".hero-video");

  function getSlideVideoLink(slide) {
    return slide?.getAttribute("videolink") || slide?.dataset?.videolink || "";
  }

  function getSlidePoster(slide) {
    const img = slide?.querySelector(".hero-slide-image, img");
    return img?.currentSrc || img?.src || "";
  }

  function setHeroVideo(src, poster) {
    const source = heroVideo.querySelector("source");
    const currentSrc =
      source?.getAttribute("src") || heroVideo.getAttribute("src");

    if (poster) heroVideo.poster = poster;

    if (currentSrc === src) {
      heroVideo.loop = false;
      if (heroVideo.paused) heroVideo.play().catch(() => {});
      return;
    }

    if (source) {
      source.src = src;
    } else {
      heroVideo.src = src;
    }

    heroVideo.loop = false;
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.load();
    heroVideo.play().catch(() => {});
  }

  document.querySelectorAll(".swiper").forEach((swiperEl) => {
    const hasVideoSlides = swiperEl.querySelector(
      "[videolink], [data-videolink]",
    );
    const linkVideo = heroVideo && hasVideoSlides;

    function syncVideo(swiper) {
      const slide = swiper.slides[swiper.activeIndex];
      const link = getSlideVideoLink(slide);
      if (!link) return;
      setHeroVideo(link, getSlidePoster(slide));
    }

    const swiperInstance = new Swiper(swiperEl, {
      direction: "horizontal",
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
      centeredSlidesBounds: true,
      slideToClickedSlide: true,
      loop: true,
      grabCursor: true,
      on: linkVideo
        ? {
            init: syncVideo,
            slideChange: syncVideo,
          }
        : undefined,
    });

    if (linkVideo) {
      heroVideo.addEventListener("ended", () => swiperInstance.slideNext());
    }
  });
})();

(function faq_init() {
  const faq_items = document.querySelectorAll(".faq-item");
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
        faqItem.querySelectorAll(".icon-plus"),
        {
          opacity: 0,
        },
        0,
      )
      .to(
        faqItem.querySelectorAll(".icon-minus"),
        {
          opacity: 1,
        },
        0,
      );

    return faqTl;
  }
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

(function pricing_toggle_init() {
  const pricing_card = document.querySelectorAll("[pricing-card]");

  pricing_card.forEach((card) => {
    const pricing_toggle = card.querySelector("[pricing-toggle]");
    const pricing_toggle_dot = card.querySelector("[pricing-toggle-dot]");
    const pricing_number = card.querySelector(".pricing-number");
    const monthly_pricing = card.getAttribute("monthly-pricing");
    const yearly_pricing = card.getAttribute("yearly-pricing");
    const billed_text = card.querySelector("[billed-text]");

    if (!pricing_toggle || !pricing_number) return;

    let isMonthly = false;

    // Keep prefix/suffix (e.g. "$", "/mo") and only count the numeric part.
    function parseParts(value) {
      const match = String(value).match(/-?[\d.,]+/);
      if (!match) return { prefix: "", number: 0, suffix: "", decimals: 0 };
      const numStr = match[0].replace(/,/g, "");
      const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
      return {
        prefix: String(value).slice(0, match.index),
        number: parseFloat(numStr),
        suffix: String(value).slice(match.index + match[0].length),
        decimals,
      };
    }

    const counter = { value: parseParts(yearly_pricing).number };

    function countTo(value) {
      const { prefix, number, suffix, decimals } = parseParts(value);
      gsap.to(counter, {
        value: number,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          pricing_number.textContent =
            prefix + counter.value.toFixed(decimals) + suffix;
        },
      });
    }

    pricing_toggle.addEventListener("click", () => {
      isMonthly = !isMonthly;

      billed_text.textContent = isMonthly ? "Billed Month" : "Billed Yearly";

      gsap.to(pricing_toggle_dot, {
        x: isMonthly ? -12 : 0,
        duration: 0.2,
        ease: "power2.inOut",
      });

      countTo(isMonthly ? monthly_pricing : yearly_pricing);
    });
  });
})();

(function btn_rotate_init() {
  const btn_rotate = document.querySelectorAll("[btn-rotate]");

  btn_rotate.forEach((btn) => {
    const btn_rotate_icon = btn.querySelector("[btn-rotate-icon]");
    const btn_rotate_tl = gsap
      .timeline({
        paused: true,
        defaults: {
          duration: 0.5,
          ease: "power2.inOut",
        },
      })
      .to(btn_rotate_icon, {
        rotate: 180,
        duration: 1,
        ease: "power3.inOut",
      });

    btn.addEventListener("mouseenter", () => {
      if (btn_rotate_tl.isActive()) {
        return;
      }
      btn_rotate_tl.restart();
    });
  });
})();

(function shimmer_details_init() {
  const shimmer_wpr = document.querySelector("[shimmer-wpr]");
  const shimmer_details = document.querySelectorAll("[shimmer-details]");
  if (!shimmer_details.length) return;

  const STEP = 3; // seconds between each shimmer trigger
  const SWEEP = 1.6; // shimmer stripe sweep duration
  const FADE = 0.4; // crossfade duration

  const items = Array.from(shimmer_details).map((shimmer) => {
    const content = shimmer.querySelector("[shimmer-content]");
    const active = shimmer.querySelector("[shimmer-content-active]");

    // Inject the glowing stripe that sweeps across the detail.
    shimmer.style.position ||= "relative";
    shimmer.style.overflow = "hidden";

    const stripe = document.createElement("div");
    Object.assign(stripe.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "40%",
      height: "100%",
      pointerEvents: "none",
      background:
        "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
      zIndex: "2",
    });
    shimmer.appendChild(stripe);

    gsap.set(stripe, { xPercent: -120, autoAlpha: 0 });
    gsap.set(content, { autoAlpha: 1 });
    gsap.set(active, { autoAlpha: 0 });

    return { content, active, stripe };
  });

  const contents = items.map((i) => i.content);
  const actives = items.map((i) => i.active);

  const tl = gsap.timeline({ repeat: -1, repeatDelay: STEP, paused: true });

  items.forEach(({ content, active, stripe }, i) => {
    const at = i * STEP;

    tl.to(stripe, { autoAlpha: 1, duration: 0.15 }, at)
      .fromTo(
        stripe,
        { xPercent: -120 },
        { xPercent: 260, duration: SWEEP, ease: "power2.inOut" },
        at,
      )
      .to(stripe, { autoAlpha: 0, duration: 0.15 }, at + SWEEP - 0.15)
      // crossfade to the active state once the stripe has passed
      .to(content, { autoAlpha: 0, duration: FADE }, at + SWEEP * 0.7)
      .to(active, { autoAlpha: 1, duration: FADE }, at + SWEEP * 0.7);
  });

  // After the last one, crossfade everything back to the inactive state,
  // then the loop restarts from the first.
  const resetAt = items.length * STEP;
  tl.to(actives, { autoAlpha: 0, duration: FADE }, resetAt).to(
    contents,
    { autoAlpha: 1, duration: FADE },
    resetAt,
  );

  // Only run the loop while the wrapper is in view.
  const trigger = shimmer_wpr || shimmer_details[0];
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        tl.play();
      } else {
        tl.pause();
      }
    },
    { threshold: 0 },
  );
  observer.observe(trigger);
})();

liveReload();

/* iPhone 14 Pro */
