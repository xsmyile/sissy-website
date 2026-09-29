import type { ReactElement } from "react";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { RateFigure, RateSparkline } from "../components/RateSparkline";
import type { NetworkBlock } from "../types";

/** `NetworkSparkline.scaleFloor`: 100 KB/s, below which a link reads as quiet. */
const NETWORK_FLOOR = 100_000;

/**
 * `PanelNetwork`, the Network tab: what the links carry now, received over
 * sent, the last two minutes of both, and the interface, the Wi-Fi signal and
 * the totals under the label that says since when, on one platter.
 */
export function Network({ block }: { block: NetworkBlock }): ReactElement {
  return (
    <Platters>
      <PanelGroup className="panel-network">
        <div>
          <div className="panel-money panel-rates">
            <RateFigure text={block.down} series="first" />
            <RateFigure text={block.up} series="second" />
          </div>
          <div className="panel-meta">{block.caption}</div>
        </div>
        <RateSparkline
          rates={block.rates}
          floor={NETWORK_FLOOR}
          label="Network rate over the last two minutes"
        />
        <div className="panel-divider" />
        <div className="panel-mac-rows">
          <Row label="Interface" value={block.interface} />
          {block.signal !== null && <Row label="Signal" value={block.signal} />}
          <Row label={block.totalsLabel} value={block.totals} />
        </div>
      </PanelGroup>
    </Platters>
  );
}

function Row({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="panel-line">
      <span className="panel-mac-label">{label}</span>
      <span className="panel-mac-value">{value}</span>
    </div>
  );
}
