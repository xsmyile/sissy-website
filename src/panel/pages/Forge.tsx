import type { ReactElement } from "react";
import { ForgeSection } from "../components/ForgeSection";
import { ChevronRight } from "../components/Glyph";
import { IdentityLineMark } from "../components/IdentityMark";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { Row } from "../components/Row";
import type { OpenPage } from "../page";
import type { IdentityLine as IdentityLineData, PanelSnapshot } from "../types";

const IDENTITY_HELP = "Show every repository's commit identity";
export const IDENTITY_TARGET = "identities";

/**
 * `PanelForge`, the Forge tab: what was pushed to each connected forge, and
 * whether every repository commits under the name its forge expects.
 */
export function Forge({
  snapshot,
  open,
}: {
  snapshot: PanelSnapshot;
  open?: OpenPage;
}): ReactElement {
  return (
    <Platters>
      <ForgeSection rows={snapshot.forge} period={snapshot.headline.period} />
      <IdentityLine line={snapshot.identityLine} open={open} />
    </Platters>
  );
}

/**
 * `PanelIdentityLine`: the door to the identities page, always there and quiet
 * unless something is wrong. It opens the page on the repository it names,
 * which it does only when exactly one is wrong.
 */
function IdentityLine({ line, open }: { line: IdentityLineData; open?: OpenPage }): ReactElement {
  return (
    <PanelGroup>
      <Row
        className="panel-door panel-identity-line"
        target={IDENTITY_TARGET}
        title={IDENTITY_HELP}
        press={
          open && (() => open({ kind: "identities", focus: line.repository }, IDENTITY_TARGET))
        }
      >
        <IdentityLineMark state={line.state} />
        <span className="panel-identity-summary" data-state={line.state}>
          {line.summary}
        </span>
        <ChevronRight className="panel-chevron" />
      </Row>
    </PanelGroup>
  );
}
