import { animate, inView, stagger } from "motion";

import { clearInline } from "./settle";

/**
 * How each tier arrives, and the whole of the page's vocabulary: a lead
 * section's parts land one after another, a support section's land together,
 * and the detail block does not move at all.
 *
 * The difference between the first two is categorical rather than a matter of
 * degree, because sections arrive seconds apart and are never seen side by
 * side: a lead travels far enough and waits long enough between its parts to
 * be read as a sequence, where a support is one settle its parts share. The
 * pair this replaced was 26px against 10px and 50ms against 40ms, which is the
 * same gesture at two sizes and left the hierarchy in the attribute rather
 * than on the screen.
 *
 * The still tier is a value here rather than an absence, so a tier that is not
 * one of the three is a tier nobody wrote and not a section that meant to
 * stand.
 */
const TIERS = {
  lead: { lift: 44, gap: 0.1 },
  support: { lift: 6, gap: 0.02 },
  detail: null,
} as const;

type Tier = keyof typeof TIERS;
type Arrival = NonNullable<(typeof TIERS)[Tier]>;

const SPRING = { type: "spring", stiffness: 190, damping: 24 } as const;

/** Enough of a section showing to count as arrived. */
const AMOUNT = 0.15;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const isTier = (value: string | undefined): value is Tier => value !== undefined && value in TIERS;

/**
 * The parts of a section that arrive, in the order they arrive: whatever the
 * section marks itself, or its head's children, then its body, then each of
 * the parts that follow the two.
 */
function partsOf(section: HTMLElement): HTMLElement[] {
  const marked = section.querySelectorAll<HTMLElement>("[data-reveal]");
  if (marked.length > 0) return [...marked];
  return [
    ...section.querySelectorAll<HTMLElement>(
      ":scope > .head > *, :scope > .body, :scope > .after > * > *",
    ),
  ];
}

function revealSection(section: HTMLElement, { lift, gap }: Arrival): void {
  const parts = partsOf(section);
  if (parts.length === 0) return;

  const rule = section.querySelector<HTMLElement>(":scope > .rule");

  for (const part of parts) {
    part.style.opacity = "0";
  }
  if (rule !== null) rule.style.transform = "scaleX(0)";

  const stop = inView(
    section,
    () => {
      stop();
      animate(
        parts,
        { opacity: [0, 1], transform: [`translateY(${lift}px)`, "translateY(0px)"] },
        { ...SPRING, delay: stagger(gap) },
      ).then(() => clearInline(parts));
      if (rule !== null) {
        animate(rule, { transform: ["scaleX(0)", "scaleX(1)"] }, { ...SPRING, damping: 30 }).then(
          () => clearInline([rule]),
        );
      }
    },
    { amount: AMOUNT },
  );
}

/**
 * The pace band's figure, arriving the way the app's own figures do.
 *
 * `PanelOverview` puts `.animation(.default, value:)` on the headline cost and
 * `.contentTransition(.numericText())` on every count it draws, and
 * `PanelComponents` springs a bar whenever its share changes. A figure that
 * counts up while its bar springs past the pace mark and settles back is that
 * behaviour at page scale, not an invention.
 */
function revealFigure(band: HTMLElement): void {
  const value = band.querySelector<HTMLElement>("[data-pace-value]");
  const fill = band.querySelector<HTMLElement>("[data-pace-fill]");
  if (value === null || fill === null) return;

  const target = Number(value.textContent);
  if (Number.isNaN(target)) return;

  value.textContent = "0";
  fill.style.transform = "scaleX(0)";

  const stop = inView(
    band,
    () => {
      stop();
      animate(0, target, {
        type: "spring",
        stiffness: 60,
        damping: 18,
        onUpdate: (current) => {
          value.textContent = String(Math.round(current));
        },
      }).then(() => {
        value.textContent = String(target);
      });
      animate(
        fill,
        { transform: ["scaleX(0)", "scaleX(1)"] },
        { type: "spring", stiffness: 120, damping: 15 },
      ).then(() => clearInline([fill]));
    },
    { amount: AMOUNT },
  );
}

/**
 * Wires the page's arrivals, reading the motion preference as the page boots.
 *
 * Under Reduce Motion nothing is touched at all, so the finished page is what
 * stands. A section with any part of it already on screen is left alone: the
 * script is deferred, so that section has been painted, and hiding it to
 * animate it in would be a flash. Only what is below the fold is ever hidden,
 * which is also why a failure here cannot park content at zero opacity.
 */
export function wireReveals(): void {
  if (window.matchMedia(REDUCED_MOTION).matches) return;

  const fold = window.innerHeight;

  for (const section of document.querySelectorAll<HTMLElement>("[data-tier]")) {
    const tier = section.dataset.tier;
    if (!isTier(tier)) continue;
    const arrival = TIERS[tier];
    if (arrival === null) continue;
    if (section.getBoundingClientRect().top < fold) continue;
    revealSection(section, arrival);
  }

  const band = document.querySelector<HTMLElement>("[data-pace-band]");
  if (band !== null && band.getBoundingClientRect().top >= fold) revealFigure(band);
}
