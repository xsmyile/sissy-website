import { animate } from "motion";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { clearInline } from "../motion/settle";
import { type BlinkDriver, driveBlink } from "./blink";
import { DEMO_SNAPSHOT } from "./data";
import { Panel } from "./Panel";
import { BACK, type OpenPage, OVERVIEW, pageIdentity } from "./page";
import type { PanelPage } from "./types";

/** Long enough after mount to read as a frame landing rather than as page load. */
const FIRST_FRAME_MS = 900;

/** How much of the distance to the pointer the frame closes each frame. */
const TILT_EASE = 0.14;
/** Below this the tilt has arrived, and the loop stops until the pointer moves. */
const TILT_EPSILON = 0.002;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER = "(pointer: coarse)";

const SCENE = "[data-scene]";
const EYES = "[data-sissy-eye], .panel-cat-eye";

/** Stiff enough to read as a popover resizing, damped enough not to wobble. */
const PANEL_SPRING = { type: "spring", stiffness: 210, damping: 26 } as const;

/**
 * Opening a page moves focus inside the panel, and the page it sits on must
 * not move with it: `html` scrolls smoothly, so a row below the fold would
 * carry the whole document with it. In the app the popover is the window.
 */
const FOCUS_IN_PLACE = { preventScroll: true } as const;

/** The page showing, and the control the app would leave focus on once it has. */
interface View {
  page: PanelPage;
  focus: string | null;
}

/**
 * The one operable panel on the page: it owns which page is showing, puts
 * focus where the app would leave it, and blinks when the figures change.
 *
 * It renders inert first and turns operable once it has mounted, so the server
 * HTML and the first client render agree and a page without JavaScript shows
 * the same Overview with nothing on it that looks pressable.
 *
 * Its light and its tilt are written onto the scene around it rather than kept
 * to itself, because the cat is the light's source and counter-drifts against
 * the panel's rotation.
 */
export function HeroPanel({ label }: { label: string }): ReactElement {
  const [view, setView] = useState<View>({ page: OVERVIEW, focus: null });
  const [live, setLive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const driverRef = useRef<BlinkDriver | null>(null);
  const originsRef = useRef<string[]>([]);

  const open = useCallback<OpenPage>((next, from) => {
    const back = from === BACK;
    const focus = back ? (originsRef.current.pop() ?? null) : BACK;
    if (!back) originsRef.current.push(from);
    setView({ page: next, focus });
  }, []);

  useEffect(() => setLive(true), []);

  useEffect(() => {
    const scene = rootRef.current?.closest<HTMLElement>(SCENE) ?? null;
    const driver = driveBlink({
      eyes: () => Array.from(scene?.querySelectorAll<HTMLElement>(EYES) ?? []),
      scene,
    });
    driverRef.current = driver;
    const first = window.setTimeout(() => driver.blink(), FIRST_FRAME_MS);
    return () => {
      window.clearTimeout(first);
      driver.stop();
      driverRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (view.focus === null) return;
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-target="${view.focus}"]`)
      ?.focus(FOCUS_IN_PLACE);
    driverRef.current?.blink();
  }, [view]);

  useTilt(rootRef);
  usePanelTransition(rootRef, pageIdentity(view.page));

  return (
    <div className="hero-panel" ref={rootRef}>
      <Panel
        snapshot={DEMO_SNAPSHOT}
        page={view.page}
        label={label}
        open={live ? open : undefined}
      />
    </div>
  );
}

/**
 * Follows the pointer in JavaScript and releases in CSS: while the pointer is
 * over the panel the loop writes the rotation onto the scene with the
 * transition off, and leaving drops both so the transition performs the
 * return.
 *
 * Off under Reduce Motion and off on a coarse pointer, where a tilt that
 * follows a finger is a tilt that fights a scroll. Both are watched rather
 * than read once, so turning Reduce Motion on stops the tilt on the page that
 * is already open.
 */
function useTilt(ref: React.RefObject<HTMLDivElement | null>): void {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const queries = [window.matchMedia(REDUCED_MOTION), window.matchMedia(COARSE_POINTER)];
    const read = (): void => setAllowed(queries.every((query) => !query.matches));
    read();
    for (const query of queries) {
      query.addEventListener("change", read);
    }
    return () => {
      for (const query of queries) {
        query.removeEventListener("change", read);
      }
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    const scene = root?.closest<HTMLElement>(SCENE) ?? null;
    if (!allowed || root === null || scene === null) return;

    let frame = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const write = (): void => {
      scene.style.setProperty("--tilt-x", current.x.toFixed(4));
      scene.style.setProperty("--tilt-y", current.y.toFixed(4));
    };

    const step = (): void => {
      current.x += (target.x - current.x) * TILT_EASE;
      current.y += (target.y - current.y) * TILT_EASE;
      write();
      const settled =
        Math.abs(target.x - current.x) < TILT_EPSILON &&
        Math.abs(target.y - current.y) < TILT_EPSILON;
      frame = settled ? 0 : requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent): void => {
      const box = root.getBoundingClientRect();
      target.x = ((event.clientX - box.left) / box.width) * 2 - 1;
      target.y = ((event.clientY - box.top) / box.height) * 2 - 1;
      scene.dataset.tilting = "";
      if (frame === 0) frame = requestAnimationFrame(step);
    };

    const release = (): void => {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
      current.x = 0;
      current.y = 0;
      target.x = 0;
      target.y = 0;
      delete scene.dataset.tilting;
      scene.style.removeProperty("--tilt-x");
      scene.style.removeProperty("--tilt-y");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", release);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", release);
      release();
    };
  }, [ref, allowed]);
}

/**
 * The popover changing size, which is the one part of opening a page that the
 * app really does: `UsagePanelView` sets the page's frame to its measured
 * height, so the panel is a different size the moment the page changes.
 *
 * The app cuts between the pages themselves with no transition at all, so the
 * incoming page rising is a departure the site takes deliberately — a hard cut
 * on a web page reads as a fault where in a popover it reads as a popover.
 *
 * A page opened while the last resize is still running springs from where the
 * panel actually is, which is the inline height that run left frozen on it,
 * not the height it was heading for.
 */
function usePanelTransition(ref: React.RefObject<HTMLDivElement | null>, pageKey: string): void {
  const shownRef = useRef<{ key: string; height: number } | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const panel = root?.querySelector<HTMLElement>(".panel") ?? null;
    const page = root?.querySelector<HTMLElement>(".panel-page") ?? null;
    if (panel === null || page === null) return;

    const interrupted = Number.parseFloat(panel.style.height);
    panel.style.removeProperty("height");

    const to = panel.offsetHeight;
    const shown = shownRef.current;
    shownRef.current = { key: pageKey, height: to };
    if (shown === null || shown.key === pageKey) return;
    const from = Number.isNaN(interrupted) ? shown.height : interrupted;
    if (from === to) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    const resize = animate(panel, { height: [`${from}px`, `${to}px`] }, PANEL_SPRING);
    resize.then(() => panel.style.removeProperty("height"));
    const rise = animate(
      page,
      { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] },
      PANEL_SPRING,
    );
    rise.then(() => clearInline([page]));

    return () => {
      resize.stop();
      rise.stop();
    };
  }, [ref, pageKey]);
}
