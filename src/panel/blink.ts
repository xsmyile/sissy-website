import { BLINK_COOLDOWN_MS, BLINK_MS, EYE_OPEN_MS } from "./motion";

/**
 * How long each eye after the first trails the one before it.
 *
 * The app pages the menu bar and the panel off their own clocks, so the two
 * surfaces match in rhythm and not frame for frame
 * (`StatusItemController.swift:169`). A page that drew them in lockstep would
 * claim a synchronisation the app does not have.
 */
const TRAIL_MS = 140;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Which gesture an eye is playing, read by the stylesheet as `data-motion`. */
type Motion = "blink" | "close" | "open";

interface BlinkOptions {
  /**
   * Every Sissy on the surface, in the order they play, read at the moment
   * the gesture starts: navigating the panel unmounts the eye inside it and
   * coming back creates a different one.
   */
  eyes: () => HTMLElement[];
  /**
   * The scene the eyes light. It takes the same gesture, so the light on the
   * cat, the rim on the panel and the ambient drop and lift together.
   */
  scene?: HTMLElement | null;
}

export interface BlinkDriver {
  /** A frame landed. Blinks unless the cooldown, a shut eye or Reduce Motion says otherwise. */
  blink(): void;
  /** Releases the timers and the visibility listener. */
  stop(): void;
}

/**
 * Plays Sissy's eye on a page, on the rules the app plays it on: a blink when
 * numbers land, and the eye closing and opening as readings stop and start
 * again.
 *
 * A hidden tab is what "readings stop" means here, so the eye closes and rests
 * shut until the tab comes back. Asleep she never blinks, which is
 * `PanelSissyBlinkGate` in the app: a blink would claim something is arriving
 * while nothing is.
 */
export function driveBlink({ eyes, scene = null }: BlinkOptions): BlinkDriver {
  const reduced = window.matchMedia(REDUCED_MOTION);
  const timers = new Set<number>();
  let lastBlinkAt = Number.NEGATIVE_INFINITY;
  let shut = false;

  const after = (ms: number, run: () => void): void => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      run();
    }, ms);
    timers.add(timer);
  };

  const clearTimers = (): void => {
    for (const timer of timers) {
      window.clearTimeout(timer);
    }
    timers.clear();
  };

  const play = (element: HTMLElement, motion: Motion): void => {
    element.removeAttribute("data-motion");
    void element.offsetWidth;
    element.dataset.motion = motion;
  };

  const rest = (element: HTMLElement): void => {
    element.removeAttribute("data-motion");
  };

  const blink = (): void => {
    if (reduced.matches || shut) return;
    const now = performance.now();
    if (now - lastBlinkAt < BLINK_COOLDOWN_MS) return;
    lastBlinkAt = now;

    if (scene !== null) {
      play(scene, "blink");
      after(BLINK_MS, () => rest(scene));
    }

    eyes().forEach((eye, at) => {
      after(at * TRAIL_MS, () => {
        play(eye, "blink");
        after(BLINK_MS, () => rest(eye));
      });
    });
  };

  const close = (): void => {
    if (shut) return;
    shut = true;
    clearTimers();
    if (scene !== null) play(scene, "close");
    for (const eye of eyes()) {
      play(eye, "close");
    }
  };

  const open = (): void => {
    if (!shut) return;
    shut = false;
    if (scene !== null) {
      play(scene, "open");
      after(EYE_OPEN_MS, () => rest(scene));
    }
    for (const eye of eyes()) {
      play(eye, "open");
      after(EYE_OPEN_MS, () => rest(eye));
    }
  };

  const onVisibility = (): void => {
    if (document.hidden) close();
    else open();
  };

  document.addEventListener("visibilitychange", onVisibility);
  if (document.hidden) close();

  return {
    blink,
    stop(): void {
      clearTimers();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
