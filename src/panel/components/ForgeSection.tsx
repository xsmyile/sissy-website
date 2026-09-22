import type { ReactElement } from "react";
import { forgeCommentsHelp, forgeIssuesHelp, forgeMergedHelp, forgeSectionLabel } from "../format";
import type { ForgeRow, Period } from "../types";
import { ArrowTriangleheadMerge, BubbleLeft, SmallcircleFilledCircle } from "./Glyph";
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
  counter: string;
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
 * The forge block at the foot of the Overview, below the projects. The app's
 * own reason for the placement is the question rather than the height: the
 * projects are what the app is for and nothing may push them under the fold,
 * and a contribution count is the least urgent reading on the page.
 *
 * The two rows are never summed, so nothing here adds them.
 */
export function ForgeSection({ rows, period }: { rows: ForgeRow[]; period: Period }): ReactElement {
  return (
    <div className="panel-section panel-forge-section">
      <div className="panel-label">{forgeSectionLabel(period)}</div>
      {rows.map((row) => (
        <Row row={row} key={row.id} />
      ))}
    </div>
  );
}
