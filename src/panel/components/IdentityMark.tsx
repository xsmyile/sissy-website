import type { ReactElement } from "react";
import type { IdentityLineState, IdentityMark } from "../types";
import { Checkmark, ExclamationmarkTriangleFill } from "./Glyph";

/**
 * The identities page's marks, which the Overview's line borrows so the line
 * and the rows it leads to read alike: a tick, an orange warning, or a dash
 * for a reading that was not judged.
 */
export function IdentityMarkGlyph({ mark }: { mark: IdentityMark }): ReactElement {
  switch (mark) {
    case "agrees":
      return <Checkmark className="panel-mark-agrees" />;
    case "unexpected":
      return <ExclamationmarkTriangleFill className="panel-mark-warning" />;
    case "unjudged":
      return <span>—</span>;
  }
}

/** The Overview line's mark. Nothing read carries none: a tick there would be a verdict. */
export function IdentityLineMark({ state }: { state: IdentityLineState }): ReactElement | null {
  switch (state) {
    case "findings":
      return <ExclamationmarkTriangleFill className="panel-mark-warning" />;
    case "clean":
      return <Checkmark className="panel-mark-agrees" />;
    case "unread":
      return null;
  }
}
