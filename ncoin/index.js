import { roll, getDevices } from "../utils.js";
import { liveReload } from "../liveReload.js";

const { isDesktop, isMobile } = getDevices();

gsap.registerPlugin(ScrollTrigger);

gsap.to(".n_heading", {
  scale: 3,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "bottom bottom",
    end: "bottom top",
    scrub: 0.5,
    // pin: ".section_hero",
    // markers: true,
  },
});

liveReload();
