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
}

const items = document.querySelectorAll("[data-number]");

items.forEach((item) => {
  const originalText = item.textContent.trim();
  const numericValue = parseFloat(originalText.replace(/\s/g, "")) || 0;

  // Create zero string matching the original format
  let zeroString;
  if (originalText.includes(" ")) {
    const parts = originalText.split(" ");
    zeroString =
      "0".repeat(parts[0].length) + " " + "0".repeat(parts[1].length);
  } else {
    zeroString = "0".repeat(originalText.length);
  }

  // Set initial value to zero string
  item.textContent = zeroString;

  const animationObj = { value: 0 };

  gsap.to(animationObj, {
    value: numericValue,
    duration: 0.8,
    delay: 0.8,
    scrollTrigger: {
      trigger: item,
      start: "top bottom",
      end: "top bottom",
      // markers: true,
    },
    ease: Power1.easeIn,
    snap: { value: 1 },
    onUpdate: function () {
      const currentValue = Math.round(animationObj.value);
      const valueStr = currentValue.toString();

      // Preserve space format if original had space
      if (originalText.includes(" ")) {
        const parts = originalText.split(" ");
        const totalDigits = parts[0].length + parts[1].length;
        const paddedValue = valueStr.padStart(totalDigits, "0");
        const spaceIndex = parts[0].length;
        item.textContent =
          paddedValue.slice(0, spaceIndex) +
          " " +
          paddedValue.slice(spaceIndex);
      } else {
        item.textContent = valueStr.padStart(originalText.length, "0");
      }
    },
    onComplete: function () {
      item.textContent = originalText;
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
          duration: 0.5,
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
          color: "#FFE8E2",
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
          rotate: 135,
        },
        0
      );

    return faqTl;
  }
})();

class ButtonGsapTeleport {
  constructor(element) {
    this.button = element;
    this.buttonText = this.button.querySelector(
      "[data-button-gsap-teleport-text]"
    );
    this.buttonTextHover = this.button.querySelector(
      "[data-button-gsap-teleport-text-hover]"
    );
    this.buttonText.innerHTML = this.buttonText.textContent.replace(
      / /g,
      "&nbsp;"
    );
    this.buttonTextHover.innerHTML = this.buttonTextHover.textContent.replace(
      / /g,
      "&nbsp;"
    );
    this.splitText = SplitText.create(this.buttonText, {
      type: "chars",
      // autoSplit: true,
      // tag: "span",
    });
    this.splitTextHover = SplitText.create(this.buttonTextHover, {
      type: "chars",
      // autoSplit: true,
      aria: "none",
      // tag: "span",
    });
    this.setupAnimation();
  }

  init() {
    this.button.addEventListener("pointerenter", () => this.onHover());
    this.button.addEventListener("focus", () => this.onHover());
  }

  setupAnimation() {
    this.hoverTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.hoverTimeline.progress(0).pause();
      },
    });

    this.hoverTimeline
      .to(this.splitText.chars, {
        scale: 0.5,
        opacity: 0,
        yPercent: -100,
        duration: 0.45,
        stagger: {
          each: 0.018,
          from: "random",
        },
        ease: CustomEase.create("", ".32, .72, 0, 1"),
      })
      .fromTo(
        this.splitTextHover.chars,
        {
          yPercent: 100,
          scale: 0.5,
          opacity: 0,
        },
        {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          duration: 0.45,
          stagger: {
            each: 0.018,
            from: "random",
          },
          ease: CustomEase.create("", ".32, .72, 0, 1"),
        },
        "-=0.525"
      );
  }

  onHover() {
    this.hoverTimeline.play();
  }
}

gsap.registerPlugin(SplitText, CustomEase);

const buttonGsapTeleportElements = document.querySelectorAll(
  "[data-button-gsap-teleport]"
);

if (buttonGsapTeleportElements.length > 0) {
  buttonGsapTeleportElements.forEach((element) => {
    new ButtonGsapTeleport(element).init();
  });
}

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
      // anticipatePin: 1,
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

liveReload();
