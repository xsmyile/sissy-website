import type { ReactElement } from "react";
import { BACK } from "../page";
import type { ProviderId } from "../types";
import { ArrowClockwise, ChevronLeft } from "./Glyph";
import { ProviderMark } from "./Sprite";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  provider?: ProviderId;
  backLabel: string;
  back?: () => void;
}

/**
 * The header a page one level in carries instead of Sissy's own: the way
 * back, whose page this is, and the refresh. Mirrors `providerHeader` and
 * `statsHeader` in `UsagePanelView.swift`.
 */
export function PageHeader({
  title,
  subtitle,
  provider,
  backLabel,
  back,
}: PageHeaderProps): ReactElement {
  return (
    <div className="panel-page-header">
      {back === undefined ? (
        <span className="panel-back">
          <ChevronLeft />
        </span>
      ) : (
        <button
          type="button"
          className="panel-back panel-live"
          data-target={BACK}
          title={backLabel}
          aria-label={backLabel}
          onClick={back}
        >
          <ChevronLeft />
        </button>
      )}
      {provider !== undefined && <ProviderMark provider={provider} large />}
      <div>
        <div className="panel-title">{title}</div>
        {subtitle !== undefined && <div className="panel-subtitle">{subtitle}</div>}
      </div>
      <span className="panel-glass panel-glass-quiet">
        <ArrowClockwise />
      </span>
    </div>
  );
}
