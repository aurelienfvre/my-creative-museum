"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger);
CustomEase.create("museum", "0.22, 1, 0.36, 1");
CustomEase.create("curtain", "0.76, 0, 0.24, 1");
export { gsap, useGSAP, ScrollTrigger };
