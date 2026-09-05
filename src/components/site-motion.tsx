import { useEffect } from "react";

const MOTION_SELECTOR = ".motion-section, .motion-card";

export function SiteMotionObserver() {
  useEffect(() => {
    const revealEverything = () => {
      document.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((element) => {
        element.classList.add("motion-visible");
      });
    };

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealEverything();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealEverything();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("motion-visible");
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const observeMotionElements = () => {
      document.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((element) => {
        if (element.dataset['motionObserved'] === "true") return;
        element.dataset['motionObserved'] = "true";
        observer.observe(element);
      });
    };

    observeMotionElements();
    const mutationObserver = new MutationObserver(observeMotionElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
