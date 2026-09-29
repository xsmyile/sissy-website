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
import {
  BACK,
  HOME_TAB,
  type OpenPage,
  OVERVIEW,
  pageIdentity,
  type SelectTab,
  tabTarget,
} from "./page";
import { IDENTITY_TARGET } from "./pages/Forge";
import type { PanelPage, PanelTab } from "./types";

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
 * How long a summons waits for the scroll to end where the browser never says
 * it has. Measured, the longest trip, from the foot of the page at 1440 x 900,
 * took 1.42 s.
 */
const SCROLL_SETTLE_MS = 2000;

/** The row the Usage tab leads with, which is where a summons leaves focus. */
const FIRST_ROW = DEMO_SNAPSHOT.gaugeRows[0]?.id ?? null;

const GAUGE_ROWS = new Set(DEMO_SNAPSHOT.gaugeRows.map((row) => row.id));

/** The three kinds of door the panel has, which is what the hint walks through. */
type Door = "account" | "sessions" | "identity";

const DOORS: readonly Door[] =
  FIRST_ROW === null ? ["sessions", "identity"] : ["account", "sessions", "identity"];

/**
 * The control the hint sits on for a door not yet opened, from the tab on
 * screen: the door itself where it is on this tab, and the tab it is on where
 * it is not.
 */
function hintTarget(door: Door, tab: PanelTab): string | null {
  switch (door) {
    case "account":
      return tab === HOME_TAB ? FIRST_ROW : tabTarget(HOME_TAB);
    case "sessions":
      return tabTarget("sessions");
    case "identity":
      return tab === "forge" ? IDENTITY_TARGET : tabTarget("forge");
  }
}

function doorOf(target: string): Door | null {
  if (GAUGE_ROWS.has(target)) return "account";
  if (target === IDENTITY_TARGET) return "identity";
  return null;
}

/**
 * Opening a page moves focus inside the panel, and the page it sits on must
 * not move with it: `html` scrolls smoothly, so a row below the fold would
 * carry the whole document with it. In the app the popover is the window.
 */
const FOCUS_IN_PLACE = { preventScroll: true } as const;

/**
 * The page showing, the tab the Overview is on, and the control the app would
 * leave focus on once it has.
 */
interface View {
  page: PanelPage;
  tab: PanelTab;
  focus: string | null;
}

const HOME: View = { page: OVERVIEW, tab: HOME_TAB, focus: null };

/**
 * The one operable panel on the page: it owns which page is showing, puts
 * focus where the app would leave it, and blinks when the figures change.
 *
 * It renders inert first and turns operable once it has mounted, so the server
 * HTML and the first client render agree and a page without JavaScript shows
 * the same Overview with nothing on it that looks pressable.
 *
 * A replica reads as a screenshot until something says otherwise, so one
 * control at a time carries `data-hint`, which the hero draws as a pulse: the
 * first account, then the Sessions tab, then the identity line on the Forge
 * tab, each giving way to the next once its kind of door has been opened, and
 * nothing once all three have. A door on another tab is hinted at through
 * that tab. The mark is set on the DOM rather than passed down, because the
 * pages mirror the app and the app has no such thing.
 *
 * Its light and its tilt are written onto the scene around it rather than kept
 * to itself, because the cat is the light's source and counter-drifts against
 * the panel's rotation.
 */
export function HeroPanel({ label, anchor }: { label: string; anchor: string }): ReactElement {
  const [view, setView] = useState<View>(HOME);
  const [live, setLive] = useState(false);
  const [opened, setOpened] = useState<ReadonlySet<Door>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);
  const driverRef = useRef<BlinkDriver | null>(null);
  const originsRef = useRef<string[]>([]);

  const open = useCallback<OpenPage>((next, from) => {
    const back = from === BACK;
    const focus = back ? (originsRef.current.pop() ?? null) : BACK;
    if (!back) originsRef.current.push(from);
    const door = doorOf(from);
    if (door !== null) setOpened((before) => new Set(before).add(door));
    setView((before) => ({ ...before, page: next, focus }));
  }, []);

  const select = useCallback<SelectTab>((tab) => {
    if (tab === "sessions") setOpened((before) => new Set(before).add("sessions"));
    setView((before) =>
      before.tab === tab ? before : { page: OVERVIEW, tab, focus: tabTarget(tab) },
    );
  }, []);

  const rewind = useCallback(() => {
    originsRef.current = [];
    setView(HOME);
  }, []);

  const land = useCallback(() => setView({ ...HOME, focus: FIRST_ROW }), []);

  const door = DOORS.find((entry) => !opened.has(entry));
  const hint = live && door !== undefined ? hintTarget(door, view.tab) : null;

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

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    for (const marked of root.querySelectorAll<HTMLElement>("[data-hint]")) {
      delete marked.dataset.hint;
    }
    if (hint === null || view.page.kind !== "overview") return;
    const row = root.querySelector<HTMLElement>(`[data-target="${hint}"]`);
    if (row !== null) row.dataset.hint = "";
  }, [hint, view]);

  useTilt(rootRef);
  useSummons(rootRef, anchor, rewind, land);
  usePanelTransition(rootRef, pageIdentity(view.page, view.tab));

  return (
    <div className="hero-panel" ref={rootRef}>
      <Panel
        snapshot={DEMO_SNAPSHOT}
        page={view.page}
        tab={view.tab}
        label={label}
        open={live ? open : undefined}
        select={live ? select : undefined}
      />
    </div>
  );
}

/**
 * Brings the panel back from a link elsewhere on the page that names its
 * anchor, which is the menu bar's Sissy at the foot of the page: in macOS a
 * click on the status item opens the popover, and the popover on this page is
 * the one up here.
 *
 * Whatever page and tab the panel was left on go back to the Usage tab the
 * moment the link is pressed, as the app reopens on it, while the panel is still off screen, so the resize is over
 * before anyone can see it. Nothing else moves until the scroll has ended:
 * then she blinks and focus lands on the first row. Started any sooner, on the
 * panel coming into view, the arrival played during the scroll's long
 * deceleration and read as a late glitch. The scroll centres the panel, so the
 * stacked scene shows the whole of it too. Without JavaScript the link is a
 * plain anchor and still lands on the panel.
 */
function useSummons(
  ref: React.RefObject<HTMLDivElement | null>,
  anchor: string,
  rewind: () => void,
  land: () => void,
): void {
  useEffect(() => {
    const root = ref.current;
    if (root === null) return;
    const selector = `a[href="#${anchor}"]`;
    let settle: (() => void) | null = null;

    const onClick = (event: MouseEvent): void => {
      if (!(event.target instanceof Element) || event.target.closest(selector) === null) return;
      event.preventDefault();
      settle?.();
      rewind();
      const reduced = window.matchMedia(REDUCED_MOTION).matches;
      root.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
      if (reduced) {
        land();
        return;
      }
      const arrive = (): void => {
        settle?.();
        settle = null;
        land();
      };
      const fallback = window.setTimeout(arrive, SCROLL_SETTLE_MS);
      window.addEventListener("scrollend", arrive, { once: true });
      settle = () => {
        window.clearTimeout(fallback);
        window.removeEventListener("scrollend", arrive);
      };
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      settle?.();
    };
  }, [ref, anchor, rewind, land]);
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
