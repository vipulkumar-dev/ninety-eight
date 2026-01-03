import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

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

  menu_tl.fromTo(
    ".navigation_wrapper",
    { y: "-100%" },
    { y: "0%", duration: 0.01 }
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

(function logo_animation_init() {
  const logos = document.querySelectorAll(".digideck-logo");
  logos.forEach((logo) => {
    const paths = logo.querySelectorAll("path");

    gsap.set(paths, {
      opacity: 0,
    });

    paths.forEach((path) => {
      let leaveTimeout = null;

      path.addEventListener("mouseenter", () => {
        // Clear any pending leave animation
        if (leaveTimeout) {
          clearTimeout(leaveTimeout);
          leaveTimeout = null;
        }

        gsap.to(path, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });
      path.addEventListener("mouseleave", () => {
        // Clear any existing timeout
        if (leaveTimeout) {
          clearTimeout(leaveTimeout);
        }

        // Wait 0.4 seconds before starting the fade out
        leaveTimeout = setTimeout(() => {
          gsap.to(path, {
            opacity: 0,
            duration: 0.9,
            delay: 0.5,
            ease: "power2.inOut",
            overwrite: true,
          });
          leaveTimeout = null;
        }, 400);
      });
    });
  });
})();

(function mouse_follow_init() {
  if (!isDesktop) return;
  const mouse_follow_containers = document.querySelectorAll(
    "[mouse-follow-container]"
  );

  const containerData = [];

  mouse_follow_containers.forEach((mouse_follow_container) => {
    const mouse_follow_item = mouse_follow_container.querySelector(
      "[mouse-follow-item]"
    );

    if (!mouse_follow_item) return;

    // Parse data-x attribute (default: -50, 30)
    const dataX = mouse_follow_item.getAttribute("strength-x");
    const xRange = dataX ? parseFloat(dataX.trim()) : 10;

    // Parse data-y attribute (default: -50, 30)
    const dataY = mouse_follow_item.getAttribute("strength-y");
    const yRange = dataY ? parseFloat(dataY.trim()) : 10;
    console.log(xRange, yRange);

    // Store data for this container
    const data = {
      container: mouse_follow_container,
      item: mouse_follow_item,
      xRange,
      yRange,
      getWidth: () => mouse_follow_item.offsetWidth,
      getHeight: () => mouse_follow_item.offsetHeight,
    };

    containerData.push(data);

    // Function to update dimensions
    const updateDimensions = () => {
      data.width = data.getWidth();
      data.height = data.getHeight();
    };

    // Initialize dimensions
    updateDimensions();

    mouse_follow_container.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const mapped_x = gsap.utils.mapRange(
        0,
        data.width,
        -data.xRange,
        data.xRange,
        x
      );

      const mapped_y = gsap.utils.mapRange(
        0,
        data.height,
        -data.yRange,
        data.yRange,
        y
      );

      gsap.to(mouse_follow_item, {
        x: mapped_x,
        y: mapped_y,
        duration: 0.3,
      });
    });
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      containerData.forEach((data) => {
        data.width = data.getWidth();
        data.height = data.getHeight();
      });
    }, 100);
  });
})();

(function swiper_init() {
  document.querySelectorAll(".swiper").forEach((swiper) => {
    const swiperInstance = new Swiper(swiper, {
      direction: "horizontal",
      slidesPerView: 1,
      spaceBetween: 16,
      centeredSlides: true,
      centeredSlidesBounds: true,
      speed: 500,
      grabCursor: true,
      autoplay: {
        delay: 4000,
      },
      loop: true,
      navigation: {
        nextEl: document.querySelector(".swiper_next"),
        prevEl: document.querySelector(".swiper_prev"),
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 8,
        },
        640: {
          slidesPerView: 1.2,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        1400: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  });
})();

(function handleSports() {
  let isSports = false;
  document
    .querySelector("[toggle-mode-container]")
    .addEventListener("click", () => {
      isSports = !isSports;
      handleMode(isSports);
      handleChange(isSports);
    });

  const gsapDefault = {
    duration: 0.3,
    ease: "power4.inOut",
  };

  function handleMode(isSports) {
    if (isSports) {
      gsap.to("[toggle-mode-trigger]", {
        x: "100%",
        ...gsapDefault,
      });
      gsap.to("[toggle-mode-trigger-content]", {
        x: "-50%",
        ...gsapDefault,
      });
    } else {
      gsap.to("[toggle-mode-trigger]", {
        x: "0%",
        ...gsapDefault,
      });
      gsap.to("[toggle-mode-trigger-content]", {
        x: "0%",
        ...gsapDefault,
      });
    }
  }
  function handleChange(isSports) {
    if (isSports) {
      document.querySelectorAll("[toggle-txt-sport]").forEach((el) => {
        const content = el.getAttribute("toggle-txt-business");
        el.textContent = content;
      });
    } else {
      document.querySelectorAll("[toggle-txt-business]").forEach((el) => {
        const content = el.getAttribute("toggle-txt-sport");
        el.textContent = content;
      });
    }
  }
})();
console.log("Digideck");

roll("[roll]", 45);

liveReload();
