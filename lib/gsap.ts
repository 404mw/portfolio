// Registers the GSAP plugins the site uses, once, and re-exports them (constitution §5: GSAP is
// the only motion library). Import `gsap`, `ScrollTrigger` and `useGSAP` from here, never from the
// packages directly, so registration has always run first. Only plugins in use are registered.
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
