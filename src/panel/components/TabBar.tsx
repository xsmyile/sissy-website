import type { CSSProperties, ReactElement } from "react";
import { DRAWN_TABS, type SelectTab, tabTarget } from "../page";
import type { PanelTab, TabEntry } from "../types";
import {
  ArrowTriangleBranch,
  ArrowUpArrowDown,
  GaugeWithDotsNeedle33,
  type GlyphProps,
  Internaldrive,
  Memorychip,
  Terminal,
} from "./Glyph";

/** `PanelTab.title`: the name a tab answers to on the hover and to a screen reader. */
export const TAB_TITLES: Record<PanelTab, string> = {
  usage: "Usage",
  sessions: "Sessions",
  mac: "Mac",
  disk: "Disk",
  network: "Network",
  forge: "Forge",
};

/** `PanelTab.symbol`, each at the bar's 14 pt medium. */
const TAB_SYMBOLS: Record<PanelTab, (props: GlyphProps) => ReactElement> = {
  usage: GaugeWithDotsNeedle33,
  sessions: Terminal,
  mac: Memorychip,
  disk: Internaldrive,
  network: ArrowUpArrowDown,
  forge: ArrowTriangleBranch,
};

/**
 * `PanelTabBar`: the panel's modules as icons on one glass capsule under the
 * header, the selection a lighter fill inside it that slides to the tab
 * pressed. A badge tints the tab's own symbol, since a dot or a mark beside it
 * would cost the segment width it does not have.
 *
 * The hover names the tab and adds the badge's reason, and leaves out the
 * app's ⌘ digit: on a web page that key already belongs to the browser.
 */
export function TabBar({
  tabs,
  selected,
  select,
}: {
  tabs: TabEntry[];
  selected: PanelTab;
  select?: SelectTab;
}): ReactElement {
  const index = tabs.findIndex((entry) => entry.tab === selected);
  const style = { "--tab-count": tabs.length, "--tab-index": index } as CSSProperties;
  return (
    <div className="panel-tabs" style={style}>
      <span className="panel-tab-selection" aria-hidden="true" />
      {tabs.map((entry) => (
        <Tab
          key={entry.tab}
          entry={entry}
          selected={entry.tab === selected}
          live={select !== undefined}
          select={select !== undefined && DRAWN_TABS.has(entry.tab) ? select : undefined}
        />
      ))}
    </div>
  );
}

/**
 * One tab. On an operable bar a tab with no page behind it is still named, on
 * the hover and to a screen reader, as the app names every tab.
 */
function Tab({
  entry,
  selected,
  live,
  select,
}: {
  entry: TabEntry;
  selected: boolean;
  live: boolean;
  select?: SelectTab;
}): ReactElement {
  const TabSymbol = TAB_SYMBOLS[entry.tab];
  const title = TAB_TITLES[entry.tab];
  const tint = entry.badge?.tint;
  const help = entry.badge === null ? title : `${title}\n${entry.badge.reason}`;
  if (select === undefined && live) {
    return (
      <span
        className="panel-tab"
        data-selected={selected || undefined}
        data-badge={tint}
        role="img"
        aria-label={title}
        title={help}
      >
        <TabSymbol />
      </span>
    );
  }
  if (select === undefined) {
    return (
      <span className="panel-tab" data-selected={selected || undefined} data-badge={tint}>
        <TabSymbol />
      </span>
    );
  }
  return (
    <button
      type="button"
      className="panel-tab panel-live"
      data-target={tabTarget(entry.tab)}
      data-selected={selected || undefined}
      data-badge={tint}
      title={help}
      aria-label={title}
      aria-current={selected || undefined}
      onClick={() => select(entry.tab)}
    >
      <TabSymbol />
    </button>
  );
}
