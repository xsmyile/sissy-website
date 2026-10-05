import type { ReactElement } from "react";
import type { ActionsBlock, ActionsRow } from "../types";
import { PanelGroup } from "./PanelGroup";
import { WindowRowView } from "./WindowRow";

/**
 * `PanelActions`: a GitHub connection's Actions allowances, on a platter of
 * its own under its forge's section, because it answers a different window:
 * the section follows the panel's period and this follows the month GitHub
 * bills by, which the heading names. The app also draws a notice under the
 * rows while the token cannot read the account's own bill; the fixture's token
 * can, so the replica has no such line.
 */
export function PanelActions({ block }: { block: ActionsBlock }): ReactElement {
  return (
    <PanelGroup label={<div className="panel-label">{block.title}</div>}>
      <div className="panel-actions">
        {block.rows.map((row) => (
          <ActionsRowView key={row.id} row={row} />
        ))}
      </div>
    </PanelGroup>
  );
}

/**
 * `ActionsRowView`: the gauge, on the limit rows' own colour rule, a spent
 * allowance red and anything below it the accent; then what stopped and who
 * spent it. The app prints the minutes in place of the gauge for a plan whose
 * allowance it does not know; every owner in the fixture is on a known plan.
 */
function ActionsRowView({ row }: { row: ActionsRow }): ReactElement {
  return (
    <div className="panel-actions-row">
      <WindowRowView
        window={row.window}
        tint={Math.round(row.window.usedFraction * 100) >= 100 ? "red" : "accent"}
        binding={row.binding}
      />
      {row.state !== null && (
        <div className="panel-actions-line" data-stopped={row.stopped || undefined}>
          {row.state}
        </div>
      )}
      {row.spender !== null && (
        <div className="panel-actions-line panel-actions-spender">{row.spender}</div>
      )}
    </div>
  );
}
