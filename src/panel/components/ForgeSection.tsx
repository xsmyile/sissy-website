import type { ReactElement } from "react";
import { forgeCommentsHelp, forgeIssuesHelp, forgeMergedHelp, forgeSectionLabel } from "../format";
import type { ForgeCounter, ForgeRow, Period } from "../types";
import { ArrowTriangleheadMerge, BubbleLeft, SmallcircleFilledCircle } from "./Glyph";
import { PanelGroup } from "./PanelGroup";
import { ForgeMark } from "./Sprite";

/**
 * `ForgeRowView`: one connected forge account, its contribution total bare and
 * the other three behind their own mark, with the age of the reading under it.
 *
 * Bare because the contribution total is what the section label already names,
 * so a mark on it would qualify nothing; the three beside it are different
 * readings on the same line and a glyph is what tells them apart without
 * spending the row a word each.
 */
function Row({ row }: { row: ForgeRow }): ReactElement {
  return (
    <div className="panel-forge-row">
      <div className="panel-line">
        <ForgeMark host={row.host} />
        <span className="panel-name">{row.login}</span>
        <span className="panel-forge-figures">
          <span className="panel-forge-count">{row.contributions}</span>
          <Counter
            value={row.merged}
            counter="merged"
            help={forgeMergedHelp(row.host)}
            mark={<ArrowTriangleheadMerge />}
          />
          <Counter
            value={row.issues}
            counter="issues"
            help={forgeIssuesHelp(row.host)}
            mark={<SmallcircleFilledCircle />}
          />
          <Counter
            value={row.comments}
            counter="comments"
            help={forgeCommentsHelp(row.host)}
            mark={<BubbleLeft />}
          />
        </span>
      </div>
      <div className="panel-forge-notice">{row.notice}</div>
    </div>
  );
}

/**
 * One figure and the mark that says what it counts, with the meaning on the
 * mark: a glyph is recognised before it is read and read by nobody who has not
 * met it, and this row is where someone meets it.
 */
function Counter({
  value,
  counter,
  help,
  mark,
}: {
  value: string;
  counter: ForgeCounter;
  help: string;
  mark: ReactElement;
}): ReactElement {
  return (
    <span className="panel-forge-counter" data-counter={counter}>
      <span className="panel-forge-mark" role="img" aria-label={help}>
        {mark}
      </span>
      <span className="panel-forge-count">{value}</span>
    </span>
  );
}

/**
 * `PanelForge.forge`: how much was pushed, per forge account, over the panel's
 * window, which the label names because the period is chosen in the header.
 *
 * The two rows are never summed, so nothing here adds them.
 */
export function ForgeSection({ rows, period }: { rows: ForgeRow[]; period: Period }): ReactElement {
  return (
    <PanelGroup
      className="panel-forge-section"
      label={<div className="panel-label">{forgeSectionLabel(period)}</div>}
    >
      {rows.map((row) => (
        <Row row={row} key={row.id} />
      ))}
    </PanelGroup>
  );
}
