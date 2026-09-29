import type { ReactElement } from "react";
import { PanelGroup, Platters } from "../components/PanelGroup";
import type { MacBlock, MacLevel } from "../types";

/** `MacHealthLevel.allCases`: the track's steps, in the order the kernel grades them. */
const STEPS: MacLevel[] = ["normal", "warn", "critical"];

/**
 * `PanelMac`, the Mac tab: the kernel's word for memory, a track of its three
 * steps filled up to it, then swap, load and uptime, and the apps holding the
 * most besides the sessions. The level wears the colour the kernel's grade
 * earns and nothing more: normal is the resting grey.
 */
export function Mac({ block }: { block: MacBlock }): ReactElement {
  const reached = block.pressure === null ? -1 : STEPS.indexOf(block.pressure);
  return (
    <Platters>
      <PanelGroup className="panel-mac">
        <div>
          <div className="panel-money" data-level={block.pressure ?? "none"}>
            {block.memory}
          </div>
          <div className="panel-meta">{block.caption}</div>
        </div>
        <div className="panel-mac-track">
          <div className="panel-mac-steps">
            {STEPS.map((step, index) => (
              <span
                key={step}
                className="panel-mac-step"
                data-level={index <= reached ? block.pressure : undefined}
              />
            ))}
          </div>
          <div className="panel-mac-steps">
            {STEPS.map((step) => (
              <span key={step} className="panel-mac-step-label">
                {step}
              </span>
            ))}
          </div>
        </div>
        <div className="panel-divider" />
        <div className="panel-mac-rows">
          <MacRow label="Swap" value={block.swap} />
          <MacRow label="Load" value={block.load} />
          <MacRow label="Up" value={block.uptime} />
        </div>
      </PanelGroup>
      {block.heaviest.length > 0 && (
        <PanelGroup
          className="panel-mac-rows"
          label={<div className="panel-label">Heaviest apps</div>}
        >
          {block.heaviest.map((app) => (
            <div className="panel-line" key={app.id}>
              <span className="panel-process">{app.name}</span>
              <span className="panel-value">{app.footprint}</span>
            </div>
          ))}
        </PanelGroup>
      )}
    </Platters>
  );
}

function MacRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="panel-line">
      <span className="panel-mac-label">{label}</span>
      <span className="panel-mac-value">{value}</span>
    </div>
  );
}
