import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── 丝滑缓动 ───
// expo.out / power3.out 归位时极丝滑，无廉价弹跳感
export const EASE_SILK = "power3.out";
export const EASE_EXPO = "expo.out";
export const EASE_SOFT = "power2.inOut";
export const EASE_QUART = "power4.inOut";

// 模块进场默认配置
const ST_DEFAULTS = {
  start: "top 82%",
  once: true,
};

/**
 * 模块进场：副标题 → 标题（遮罩揭开+位移+blur）→ 描述 → 卡片 stagger
 *
 * 在 section 容器上用 ref，内部用 data 属性标记：
 *   [data-r-sub]    副标题
 *   [data-r-title]  主标题
 *   [data-r-desc]   描述文字
 *   [data-r-card]   需 stagger 的卡片
 *   [data-r-stagger] 整组卡片容器（可选，用于以容器为触发点）
 */
export function useSectionReveal(depRef, deps = []) {
  useLayoutEffect(() => {
    const scope = depRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // 副标题
      const sub = scope.querySelector("[data-r-sub]");
      if (sub) {
        gsap.from(sub, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: EASE_SILK,
          scrollTrigger: { trigger: sub, ...ST_DEFAULTS },
        });
      }

      // 主标题 — 遮罩揭开 + 位移 + 轻微模糊归位
      const title = scope.querySelector("[data-r-title]");
      if (title) {
        gsap.from(title, {
          opacity: 0,
          y: 70,
          clipPath: "inset(0 0 100% 0)",
          filter: "blur(4px)",
          duration: 1.3,
          ease: EASE_EXPO,
          scrollTrigger: { trigger: title, ...ST_DEFAULTS },
        });
      }

      // 描述
      const desc = scope.querySelector("[data-r-desc]");
      if (desc) {
        gsap.from(desc, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: EASE_SILK,
          delay: 0.15,
          scrollTrigger: { trigger: desc, ...ST_DEFAULTS },
        });
      }

      // 卡片 stagger — 支持多组，每组以 [data-r-stagger] 容器为触发点
      const groups = scope.querySelectorAll("[data-r-stagger]");
      if (groups.length) {
        groups.forEach((group) => {
          const items = group.querySelectorAll("[data-r-card]");
          if (!items.length) return;
          gsap.from(items, {
            opacity: 0,
            y: 55,
            duration: 1,
            ease: EASE_SILK,
            stagger: 0.11,
            scrollTrigger: { trigger: group, ...ST_DEFAULTS },
          });
        });
      } else {
        const cards = scope.querySelectorAll("[data-r-card]");
        if (cards.length) {
          gsap.from(cards, {
            opacity: 0,
            y: 55,
            duration: 1,
            ease: EASE_SILK,
            stagger: 0.11,
            scrollTrigger: { trigger: cards[0], ...ST_DEFAULTS },
          });
        }
      }
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hero 首屏完整开场动画
 * 顺序：遮罩 → 标题压缩归位 → 英文名 → 标签 stagger → CTA → 滚动指示
 */
export function useHeroTimeline(depRef) {
  useLayoutEffect(() => {
    const scope = depRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE_EXPO } });

      // 背景遮罩层淡入
      tl.from("[data-hero-overlay]", {
        opacity: 0,
        duration: 0.6,
      });

      // 副标题徽章
      tl.from(
        "[data-hero-badge]",
        { opacity: 0, y: 20, duration: 0.8, ease: EASE_SILK },
        0.3
      );

      // 主标题 — 压缩归位（scaleY 0→1 + 位移 + blur）
      tl.from(
        "[data-hero-title]",
        {
          opacity: 0,
          y: 60,
          scaleY: 0.3,
          filter: "blur(6px)",
          transformOrigin: "center bottom",
          duration: 1.4,
        },
        0.5
      );

      // 英文名
      tl.from(
        "[data-hero-nameen]",
        { opacity: 0, y: 30, duration: 1, ease: EASE_SILK },
        0.9
      );

      // 标签 stagger
      tl.from(
        "[data-hero-tag]",
        { opacity: 0, y: 24, duration: 0.7, ease: EASE_SILK, stagger: 0.07 },
        1.1
      );

      // CTA
      tl.from(
        "[data-hero-cta]",
        { opacity: 0, y: 24, duration: 0.8, ease: EASE_SILK },
        1.4
      );

      // 滚动指示
      tl.from(
        "[data-hero-scroll]",
        { opacity: 0, duration: 0.8 },
        1.8
      );
    }, scope);

    return () => ctx.revert();
  }, []);
}

/**
 * 图片 reveal + parallax
 * [data-img-reveal] — clip-path 从底部揭开 + scale 归位
 * [data-img-parallax] — 轻微 parallax（滚动驱动 y 位移）
 */
export function useImageReveal(depRef, deps = []) {
  useLayoutEffect(() => {
    const scope = depRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // reveal
      const reveals = scope.querySelectorAll("[data-img-reveal]");
      reveals.forEach((img) => {
        gsap.from(img, {
          clipPath: "inset(0 0 100% 0)",
          scale: 1.12,
          duration: 1.4,
          ease: EASE_EXPO,
          scrollTrigger: { trigger: img, ...ST_DEFAULTS },
        });
      });

      // parallax — 容器内图片轻微 y 位移（幅度小，避免露白）
      const parallax = scope.querySelectorAll("[data-img-parallax]");
      parallax.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
