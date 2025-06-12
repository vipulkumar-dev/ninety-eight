import { roll, getDevices } from "../utils.js";

const { isDesktop, isMobile } = getDevices();

document.querySelectorAll(".swiper").forEach((swiper) => {
  const swiperInstance = new Swiper(swiper, {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    grabCursor: true,
    centeredSlidesBounds: true,
    loopFillGroupBlank: false,
    autoplay: {
      delay: 3000,
    },
    loop: true,
    navigation: {
      nextEl: swiper.parentNode.querySelector(".swiper_next"),
      prevEl: swiper.parentNode.querySelector(".swiper_prev"),
    },
  });
});

if (isDesktop) {
  const logos_wpr = document.querySelector(".logos");

  const brand_stripe_rev = gsap.to(".brand_stripe_rev", {
    y: "-100%",
    repeat: -1,
    duration: 20,
    ease: "none",
  });

  const brand_stripe = gsap.to(".brand_stripe", {
    y: "100%",
    repeat: -1,
    duration: 20,
    ease: "none",
  });

  logos_wpr.addEventListener("mouseenter", () => {
    brand_stripe_rev.pause();
    brand_stripe.pause();
  });

  logos_wpr.addEventListener("mouseleave", () => {
    brand_stripe_rev.resume();
    brand_stripe.resume();
  });
} else {
  gsap.to(".brand_stripe_rev", {
    x: "-100%",
    repeat: -1,
    duration: 30,
    ease: "none",
  });

  gsap.to(".brand_stripe", {
    x: "100%",
    repeat: -1,
    duration: 30,
    ease: "none",
  });
}

function swapImages() {
  const hero_img_wprs = document.querySelectorAll(".hero_img_wpr");
  const hero_img_wprs_hide = document.querySelectorAll(".hero_img_wpr.is-hide");
  console.log("hero_img_wprs_hide", hero_img_wprs_hide);

  if (hero_img_wprs.length < 2) {
    gsap.delayedCall(2, swapImages);
    return;
  }

  const getRandom = () =>
    hero_img_wprs[Math.floor(Math.random() * hero_img_wprs.length)];
  const getRandomHide = () =>
    hero_img_wprs_hide[Math.floor(Math.random() * hero_img_wprs_hide.length)];

  let hero_img_wpr_random_first = getRandom();
  let hero_img_wpr_random_second = getRandomHide();

  console.log("hero_img_wprs_hide", hero_img_wpr_random_second);

  // Ensure they are not the same
  while (hero_img_wpr_random_first === hero_img_wpr_random_second) {
    hero_img_wpr_random_second = getRandomHide();
  }

  const hero_img_first_front =
    hero_img_wpr_random_first.querySelector(".hero_image");
  const hero_img_first_back = hero_img_wpr_random_first.querySelector(
    ".hero_image.is-back"
  );

  const hero_img_second_front =
    hero_img_wpr_random_second.querySelector(".hero_image");
  const hero_img_second_back = hero_img_wpr_random_second.querySelector(
    ".hero_image.is-back"
  );

  const src1 = hero_img_first_front?.getAttribute("src");
  const src2 = hero_img_second_front?.getAttribute("src");

  if (!src1 || !src2) {
    gsap.delayedCall(2, swapImages);
    return;
  }

  hero_img_first_back.setAttribute("src", src2);
  hero_img_second_back.setAttribute("src", src1);

  gsap.to([hero_img_first_front, hero_img_second_front], {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      hero_img_first_front.setAttribute("src", src2);
      hero_img_second_front.setAttribute("src", src1);

      gsap.to([hero_img_first_front, hero_img_second_front], {
        opacity: 1,
        duration: 0,
        delay: 1,
      });

      // Call again after delay
      gsap.delayedCall(2, swapImages);
    },
  });
}

// Start the loop
if (isDesktop) {
  swapImages();
}

const horizontalTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".horizontal_section_wpr",
    start: "center center",
    end: "+=4500",
    scrub: 1,
    pin: ".section_pin",
    // markers: true,
  },
});

const horizontalSections = document.querySelectorAll(".horizontal_section");
const horizontal__block = document.querySelectorAll(".horizontal__block");
horizontalSections.forEach((section, i) => {
  horizontalTl.to(
    horizontal__block[i],
    {
      ease: "none",
      opacity: 1,
      duration: 0.15,
    },
    "-=0.3"
  );

  if (i !== horizontalSections.length - 1) {
    horizontalTl.to(section, {
      scale: 150,
      // fontSize: "1000vw",
      // left: (target, index) => {
      //   console.log("target", target);
      //   return `50%`;
      // },
      // color: "black",
      ease: "power1.inOut",
      duration: 0.5,
    });

    // horizontalTl.to(
    //   section.querySelector(".horizontal_text"),
    //   {
    //     backgroundSize: "0.66%",
    //     // color: "black",
    //     ease: "power1.inOut",
    //     duration: 0.5,
    //   },
    //   "<"
    // );
  }
});

const loader = document.querySelector(".loader");
const loaderTl = gsap.timeline({
  paused: true,
});
loaderTl
  .to(".loader_line", {
    top: "69%",
    duration: 1,
    ease: "power3.inOut",
  })
  .to(
    ".loader_counter",
    {
      textContent: "31%",
      duration: 1,
      ease: "power3.inOut",
      snap: { textContent: 1 },
    },
    "<"
  );
loaderTl
  .to(".loader_line", {
    top: "43%",
    duration: 1,
    ease: "power3.inOut",
  })
  .to(
    ".loader_counter",
    {
      textContent: "57%",
      duration: 1,
      ease: "power3.inOut",
      snap: { textContent: 1 },
    },
    "<"
  );
loaderTl
  .to(".loader_line", {
    top: "0%",
    duration: 1,
    ease: "power3.inOut",
  })
  .to(
    ".loader_counter",
    {
      textContent: "100%",
      duration: 1,
      ease: "power3.inOut",
      snap: { textContent: 1 },
    },
    "<"
  );

loaderTl.to(loader, {
  autoAlpha: 0,
});

loaderTl.play();

if (isMobile) {
  roll("[roll]", 60);
}
