import { Fragment, type ReactElement } from "react";
import { forgeCommentsHelp, forgeIssuesHelp, forgeMergedHelp, forgeSectionLabel } from "../format";
import type { ForgeCounter, ForgeEvent, ForgeRow, Period } from "../types";
import { PanelActions } from "./Actions";
import { ArrowTriangleheadMerge, BubbleLeft, SmallcircleFilledCircle } from "./Glyph";
import { PanelGroup } from "./PanelGroup";
import { ForgeMark } from "./Sprite";

/**
 * `ProviderPalette.forgeSymbol`: the mark a counter is drawn with, which is
 * also the mark of the latest event where the event is one of its.
 */
function CounterMark({ counter }: { counter: ForgeCounter }): ReactElement {
  switch (counter) {
    case "merged":
      return <ArrowTriangleheadMerge />;
    case "issues":
      return <SmallcircleFilledCircle />;
    case "comments":
      return <BubbleLeft />;
  }
}

/**
 * `ForgeRowView`: one connected forge account, its contribution total bare and
 * the other three behind their own mark, with the last thing it did under
 * them.
 *
 * Bare because the contribution total is the section's own figure, the one
 * its heading is about, so a mark on it would qualify nothing; the three
 * beside it are different readings on the same line and a glyph is what tells
 * them apart without spending the row a word each.
 */
function Row({ row }: { row: ForgeRow }): ReactElement {
  return (
    <div className="panel-forge-row">
      <div className="panel-line">
        <ForgeMark host={row.host} />
        <span className="panel-name">{row.login}</span>
        <span className="panel-forge-figures">
          <span className="panel-forge-count">{row.contributions}</span>
          <Counter value={row.merged} counter="merged" help={forgeMergedHelp(row.host)} />
          <Counter value={row.issues} counter="issues" help={forgeIssuesHelp(row.host)} />
          <Counter value={row.comments} counter="comments" help={forgeCommentsHelp(row.host)} />
        </span>
      </div>
      {row.latest && <Latest event={row.latest} />}
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
}: {
  value: string;
  counter: ForgeCounter;
  help: string;
}): ReactElement {
  return (
    <span className="panel-forge-counter" data-counter={counter}>
      <span className="panel-forge-mark" role="img" aria-label={help}>
        <CounterMark counter={counter} />
      </span>
      <span className="panel-forge-count">{value}</span>
    </span>
  );
}

/**
 * `ForgeRowView.latest`: the last thing the account did, in the mark and the
 * tint of the counter it is one of, so a merge on this line and the merged
 * figure above it read as one thing. Two texts, so the half a long branch is
 * in shortens while the repository and the age stay whole.
 */
function Latest({ event }: { event: ForgeEvent }): ReactElement {
  return (
    <div className="panel-forge-event" data-counter={event.counter}>
      <span className="panel-forge-mark">
        <CounterMark counter={event.counter} />
      </span>
      <span className="panel-forge-event-text">
        <span className="panel-forge-event-done">{event.done}</span>
        <span className="panel-forge-event-tail">{event.tail}</span>
      </span>
    </div>
  );
}

/**
 * `PanelForge.section`: one forge account's section, headed by its vendor and
 * the panel's window, which the heading names because the period is chosen in
 * the header, with the age of the reading at its end, and a GitHub
 * connection's Actions allowances under it. `withActions` is off only for a
 * crop that enlarges the contributions while another surface draws the
 * allowances.
 *
 * A section each, never summed, because each vendor counts its own thing and
 * one block of rows invited the sum.
 */
export function ForgeSections({
  rows,
  period,
  withActions = true,
}: {
  rows: ForgeRow[];
  period: Period;
  withActions?: boolean;
}): ReactElement {
  return (
    <>
      {rows.map((row) => (
        <Fragment key={row.id}>
          <PanelGroup
            label={
              <div className="panel-label">
                {forgeSectionLabel(row.host, period)}
                <span className="panel-caption panel-label-end">{row.notice}</span>
              </div>
            }
          >
            <Row row={row} />
          </PanelGroup>
          {withActions && row.actions !== null && <PanelActions block={row.actions} />}
        </Fragment>
      ))}
    </>
  );
}
