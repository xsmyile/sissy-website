/**
 * Look-alikes of the SF Symbols the app draws.
 *
 * SF Symbols are licensed for Apple platforms only, so the site redraws the
 * ones it needs by hand: `chevron.right`, `chevron.left`,
 * `chevron.up.chevron.down`, `cup.and.saucer.fill`, `gearshape.fill`,
 * `arrow.clockwise`, `person.2`, `arrow.trianglehead.merge`,
 * `smallcircle.filled.circle` and `bubble.left`.
 */

import type { ReactElement, SVGProps } from "react";

type GlyphProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "aria-hidden">;

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ChevronRight(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M6 3l5 5-5 5" {...STROKE} strokeWidth="2.4" />
    </svg>
  );
}

export function ChevronLeft(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M10 3 5 8l5 5" {...STROKE} strokeWidth="2.4" />
    </svg>
  );
}

export function ChevronUpDown(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 9 12" aria-hidden="true" {...props}>
      <path d="M1.5 4.5 4.5 1.5l3 3M1.5 7.5l3 3 3-3" {...STROKE} strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowClockwise(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M13.2 8.6A5.2 5.2 0 1 1 11.6 4.3" {...STROKE} strokeWidth="1.8" />
      <path d="M9.6 1.9l2.4 2.4-2.4 2.4" {...STROKE} strokeWidth="1.8" />
    </svg>
  );
}

export function PersonTwo(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 20 14" aria-hidden="true" {...props}>
      <circle cx="7" cy="4" r="2.6" {...STROKE} strokeWidth="1.5" />
      <path d="M1.5 12.5c.5-3 2.7-4.4 5.5-4.4s5 1.4 5.5 4.4" {...STROKE} strokeWidth="1.5" />
      <path
        d="M12.6 1.6a2.6 2.6 0 0 1 1.2 5M14.6 8.4c2.1.5 3.5 1.9 3.9 4.1"
        {...STROKE}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CupAndSaucer(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M2.5 3.5h8.5V8a4 4 0 0 1-4 4h-.5a4 4 0 0 1-4-4z" fill="currentColor" />
      <path
        d="M11 5h1.1a2.1 2.1 0 0 1 0 4.2H11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M1.5 14h13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const GEAR = {
  centre: 8,
  teeth: 8,
  outer: 7.4,
  valley: 5.7,
  hole: 2.3,
  toothDeg: 11,
  valleyDeg: 13.5,
};

function gearPath(): string {
  const { centre, teeth, outer, valley, hole, toothDeg, valleyDeg } = GEAR;
  const step = 360 / teeth;
  const point = (deg: number, radius: number): string => {
    const rad = (deg * Math.PI) / 180;
    return `${(centre + radius * Math.cos(rad)).toFixed(2)} ${(centre + radius * Math.sin(rad)).toFixed(2)}`;
  };
  const ring = Array.from({ length: teeth }, (_, index) => {
    const at = index * step;
    return [
      point(at - valleyDeg, valley),
      point(at - toothDeg, outer),
      point(at + toothDeg, outer),
      point(at + valleyDeg, valley),
    ].join(" L");
  }).join(" L");
  const right = centre + hole;
  const left = centre - hole;
  const holePath = `M${right} ${centre} A${hole} ${hole} 0 1 0 ${left} ${centre} A${hole} ${hole} 0 1 0 ${right} ${centre} Z`;
  return `M${ring} Z ${holePath}`;
}

const GEAR_PATH = gearPath();

export function Gearshape(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d={GEAR_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/**
 * `arrow.trianglehead.merge`, the mark on the merged counter.
 *
 * Deliberately not `arrow.trianglehead.pull`: that is the state before this
 * one, and the count is of requests that were merged. Two tails converge into
 * one stem under a solid head, which is what tells it from a chevron at the
 * 10 pt the row draws it at.
 */
export function ArrowTriangleheadMerge(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M3.4 14.6c0-3.3 1.9-5 4.6-5s4.6 1.7 4.6 5M8 9.6V5.4" {...STROKE} strokeWidth="1.9" />
      <path d="M8 1.2 11.7 6H4.3z" fill="currentColor" />
    </svg>
  );
}

/** `smallcircle.filled.circle`, the mark on the issues counter. */
export function SmallcircleFilledCircle(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="6.4" {...STROKE} strokeWidth="1.7" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** `bubble.left`, the mark on the comments counter. */
export function BubbleLeft(props: GlyphProps): ReactElement {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M12.3 2.5H3.7a2.5 2.5 0 0 0-2.5 2.5v4.2a2.5 2.5 0 0 0 2.5 2.5h.7v2.8l3.2-2.8h4.7a2.5 2.5 0 0 0 2.5-2.5V5a2.5 2.5 0 0 0-2.5-2.5Z"
        {...STROKE}
        strokeWidth="1.6"
      />
    </svg>
  );
}
