import type { ReactElement } from "react";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { RateFigure, RateSparkline } from "../components/RateSparkline";
import { ShareBar } from "../components/ShareBar";
import type { DiskBlock, MacLevel } from "../types";

/** `DiskActivityPlatter.scaleFloor`: 1 MB/s, below which a disk reads as quiet. */
const DISK_FLOOR = 1_000_000;
/** `DiskCleanupCopy.section` and `DiskCleanupCopy.clean`. */
const CLEANUP_SECTION = "Taking room";
const CLEAN = "Clean…";

/**
 * `PanelDisk`, the Disk tab: the home volume's free space graded against the
 * Mac's RAM, with the two grades marked on its bar; the activity of the last
 * two minutes; the other volumes; and the developer caches that can be
 * cleared. `Clean…` is drawn and inert, because clearing a cache is a write.
 */
export function Disk({ block }: { block: DiskBlock }): ReactElement {
  return (
    <Platters>
      <PanelGroup className="panel-mac">
        <div>
          <div className="panel-money" data-level={block.level ?? "none"}>
            {block.free}
          </div>
          <div className="panel-meta">{block.caption}</div>
        </div>
        <div className="panel-disk-track">
          <DiskBar block={block} />
          <div className="panel-disk-thresholds">{block.thresholds}</div>
        </div>
        <div className="panel-divider" />
        <div className="panel-line">
          <span className="panel-mac-label">Purgeable</span>
          <span className="panel-mac-value">{block.purgeable}</span>
        </div>
      </PanelGroup>
      <PanelGroup className="panel-mac" label={<div className="panel-label">Activity</div>}>
        <div className="panel-rates panel-rates-small">
          <RateFigure text={block.activity.read} series="first" />
          <RateFigure text={block.activity.write} series="second" />
        </div>
        <RateSparkline
          rates={block.activity.rates}
          floor={DISK_FLOOR}
          label="Disk activity over the last two minutes"
        />
        <div className="panel-disk-window">last 2 minutes</div>
      </PanelGroup>
      {block.volumes.length > 0 && (
        <PanelGroup className="panel-mac-rows" label={<div className="panel-label">Volumes</div>}>
          {block.volumes.map((volume) => (
            <div className="panel-disk-volume" key={volume.id}>
              <div className="panel-line">
                <span className="panel-process">{volume.name}</span>
                <span className="panel-value">{volume.free}</span>
              </div>
              <ShareBar share={volume.used} tint="secondary" />
            </div>
          ))}
        </PanelGroup>
      )}
      <PanelGroup
        className="panel-mac-rows"
        label={<div className="panel-label">{CLEANUP_SECTION}</div>}
      >
        {block.cleanup.map((row) => (
          <div className="panel-line" key={row.id}>
            <span className="panel-mac-label">{row.name}</span>
            <span className="panel-mac-value">{row.size}</span>
            {row.offered && <span className="panel-small-button panel-clean">{CLEAN}</span>}
          </div>
        ))}
      </PanelGroup>
    </Platters>
  );
}

/**
 * `DiskBar`: how full the home volume is, in the tint its grade wears, with a
 * mark where free space would turn warn and another where it would turn
 * critical, each cut out of the bar it sits on.
 */
function DiskBar({ block }: { block: DiskBlock }): ReactElement {
  const marks: [number | null, MacLevel][] = [
    [block.warnMark, "warn"],
    [block.criticalMark, "critical"],
  ];
  return (
    <div className="panel-bar">
      <div
        className="panel-disk-fill"
        data-level={block.level ?? "none"}
        style={{ width: `${(block.used * 100).toFixed(2)}%` }}
      />
      {marks.map(
        ([share, level]) =>
          share !== null && (
            <div
              key={level}
              className="panel-bar-mark panel-disk-mark"
              data-level={level}
              style={{ left: `${(share * 100).toFixed(2)}%` }}
            />
          ),
      )}
    </div>
  );
}
