import { gsap } from "@/lib/gsap";
import { artistMotion, museumMotion } from "./motion.config";

export function animateArtistChapters(root, contextSafe) {
  const stage = root.querySelector("[data-artists-stage]");
  const chapters = [...root.querySelectorAll("[data-chapter]")];
  let timeline;
  const build = contextSafe(() => {
    const progress = timeline?.scrollTrigger?.progress;
    timeline?.scrollTrigger?.kill();
    timeline?.revert();
    const height = stage.clientHeight;
    const gap = Math.max(24, height * 0.035);
    timeline = gsap.timeline({
      defaults: { ease: museumMotion.ease },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: museumMotion.scrub,
      },
    });
    chapters.forEach((chapter, index) => {
      const title = chapter.querySelector("[data-chapter-title]");
      const painter = chapter.querySelector("h2");
      const composition = chapter.querySelector("[data-chapter-composition]");
      const pictures = chapter.querySelector("[data-chapter-pictures]");
      const figures = [...pictures.querySelectorAll("figure")];
      const message = chapter.querySelector("[data-chapter-message]");
      const start = index * artistMotion.chapterInterval;
      const titleScale = Math.min(
        1,
        (root.clientWidth * 0.92) / title.scrollWidth,
      );
      const artistScale = Math.min(
        1,
        (root.clientWidth * 0.92) / painter.scrollWidth,
      );
      const artistTop = pictures.offsetTop + pictures.offsetHeight + gap;
      gsap.set(painter, { top: artistTop, transformOrigin: "center top" });
      gsap.set(title, {
        transformOrigin: "center bottom",
        top: pictures.offsetTop - title.offsetHeight - gap,
      });
      if (index) {
        timeline.fromTo(
          composition,
          { y: height * 0.4, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ...artistMotion.enter },
          start,
        );
      }
      const exchange = start + (index ? artistMotion.exchange.delay : 0);
      timeline
        .fromTo(
          title,
          { scale: titleScale, y: 0 },
          {
            scale: Math.max(
              titleScale * 0.52,
              24 / parseFloat(getComputedStyle(title).fontSize),
            ),
            y: -height * 0.025,
            duration: artistMotion.exchange.duration,
          },
          exchange,
        )
        .fromTo(
          painter,
          { scale: artistScale * 0.38, y: 30 },
          {
            scale: artistScale,
            y: 0,
            duration: artistMotion.exchange.duration,
          },
          exchange,
        )
        .fromTo(
          figures,
          { y: (i) => height * (i ? 0.045 : 0.025) },
          {
            y: 0,
            duration: artistMotion.exchange.duration,
            stagger: artistMotion.exchange.stagger,
          },
          exchange,
        );
      const last = index === chapters.length - 1;
      // A final reflection replaces the paintings before leaving with the page.
      if (last && !message) return;
      const exit = start + artistMotion.exit.at;
      timeline
        .to(
          composition,
          { y: -height * 1.1, duration: artistMotion.exit.duration },
          exit,
        )
        .to(
          title,
          { y: -height * 0.1, duration: artistMotion.exit.duration },
          exit,
        )
        .to(
          figures,
          {
            y: (i) => -height * (i ? 0.025 : 0.045),
            duration: artistMotion.exit.duration,
          },
          exit,
        )
        .to(
          painter,
          {
            y: -Math.min(90, pictures.offsetHeight * 0.28),
            duration: artistMotion.exit.duration,
          },
          exit + artistMotion.exit.stagger,
        )
        .set(
          composition,
          { autoAlpha: 0 },
          exit + artistMotion.exit.duration + artistMotion.exit.stagger,
        );
      if (message) {
        timeline.fromTo(
          message,
          { autoAlpha: 0, y: height * 0.04, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: artistMotion.message.enterDuration,
          },
          start + artistMotion.message.enterAt,
        );
        if (!last) {
          timeline.to(
            message,
            {
              y: -height * 0.4,
              autoAlpha: 0,
              duration: artistMotion.message.leaveDuration,
            },
            start + artistMotion.message.leaveAt,
          );
        }
      }
    });
    const updateAccessibility = () => {
      const time = timeline.time();
      chapters.forEach((chapter, index) => {
        const from = index * artistMotion.chapterInterval;
        const exits =
          index < chapters.length - 1 ||
          Boolean(chapter.querySelector("[data-chapter-message]"));
        chapter.querySelector("[data-chapter-composition]").inert =
          time < from || (exits && time > from + artistMotion.message.enterAt);
      });
    };
    timeline.eventCallback("onUpdate", updateAccessibility);
    timeline.progress(progress ?? timeline.scrollTrigger.progress);
    updateAccessibility();
  });
  build();
  const refresh = gsap.delayedCall(museumMotion.rebuildDelay, build).pause();
  const observer = new ResizeObserver(() => refresh.restart(true));
  observer.observe(stage);
  root.querySelectorAll("[data-chapter-pictures]").forEach((pictures) => {
    observer.observe(pictures);
  });
  let disposed = false;
  document.fonts.ready.then(() => {
    if (!disposed) refresh.restart(true);
  });
  return () => {
    disposed = true;
    observer.disconnect();
    refresh.kill();
    timeline.scrollTrigger?.kill();
    timeline.revert();
    chapters.forEach((chapter) => {
      chapter.querySelector("[data-chapter-composition]").inert = false;
    });
  };
}
