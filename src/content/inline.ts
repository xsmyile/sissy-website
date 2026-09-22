export type SegmentKind = "text" | "code" | "em";

export interface Segment {
  kind: SegmentKind;
  text: string;
}

const MARKUP = /(`[^`]*`|\*[^*]*\*)/;
const STRAY_DELIMITER = /[`*]/;

/**
 * Splits copy written with the README's own light markup into runs: backticks
 * for `code`, asterisks for *emphasis*, and plain text between them. Section
 * text stays one readable string and still renders the two elements it needs.
 * A delimiter left open is a defect in the copy and fails the build.
 */
export function inlineSegments(text: string): Segment[] {
  return text
    .split(MARKUP)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith("`")) return { kind: "code" as const, text: part.slice(1, -1) };
      if (part.startsWith("*")) return { kind: "em" as const, text: part.slice(1, -1) };
      if (STRAY_DELIMITER.test(part)) {
        throw new Error(`Unbalanced markup in copy: "${text.slice(0, 60)}"`);
      }
      return { kind: "text" as const, text: part };
    });
}
