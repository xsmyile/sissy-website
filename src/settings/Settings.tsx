import "./settings.css";
import type { ReactElement, ReactNode } from "react";
import { InfoCircle } from "../panel/components/Glyph";
import { ProviderMark } from "../panel/components/Sprite";
import { CredentialAddRow, CredentialRow } from "./CredentialRow";
import type { ForgeSettings, ProviderSettings, SettingsSnapshot } from "./types";

/** `ClaudeAccountLinkCopy.addTitle`, which `CodexAccountLinkCopy` shares. */
const ADD_ACCOUNT = "Add account…";
/** `ForgeConnectCopy.label`, `.caption` and `.connect`. */
const FORGE_LABEL = "Contributions";
const FORGE_CAPTION = "Read your own activity counts from GitHub and GitLab";
const FORGE_CONNECT = "Connect…";

/**
 * `ProvidersSettingsView.row`: the vendor's mark and name with its ⓘ, the
 * line saying where it is reading, and the switch that decides whether it
 * does. The switch is drawn on and inert.
 */
function ProviderRow({ provider }: { provider: ProviderSettings }): ReactElement {
  return (
    <div className="settings-row settings-provider">
      <div className="settings-provider-lines">
        <div className="settings-heading">
          <span className="settings-provider-mark">
            <ProviderMark provider={provider.provider} />
          </span>
          <span className="settings-headline">{provider.name}</span>
          <InfoCircle className="settings-info" />
        </div>
        <div className="settings-detail">{provider.detail}</div>
      </div>
      <span className="settings-switch" />
    </div>
  );
}

/**
 * Settings ▸ Providers, one section per vendor: its row, the accounts linked
 * under it, and `Add account…`. The status-check section under them is left
 * out, because it says nothing about accounts.
 */
export function ProvidersCrop({
  settings,
  label,
}: {
  settings: SettingsSnapshot;
  label: string;
}): ReactElement {
  return (
    <SettingsCrop label={label}>
      {settings.providers.map((provider) => (
        <div className="settings-section" key={provider.provider}>
          <ProviderRow provider={provider} />
          {provider.accounts.map((row) => (
            <CredentialRow key={row.id} row={row} />
          ))}
          <CredentialAddRow title={ADD_ACCOUNT} />
        </div>
      ))}
    </SettingsCrop>
  );
}

/**
 * Settings ▸ Forge's first section: the heading with its ⓘ, one row per
 * connected forge, and `Connect…`. The counter switches below it are left
 * out: the panel's contributions block beside this one is what they govern.
 */
export function ForgeSettingsCrop({
  forge,
  label,
}: {
  forge: ForgeSettings;
  label: string;
}): ReactElement {
  return (
    <SettingsCrop label={label}>
      <div className="settings-section">
        <div className="settings-row settings-forge-heading">
          <div className="settings-heading">
            <span className="settings-headline">{FORGE_LABEL}</span>
            <InfoCircle className="settings-info" />
          </div>
          <div className="settings-subtitle">{FORGE_CAPTION}</div>
        </div>
        {forge.connections.map((row) => (
          <CredentialRow key={row.id} row={row} />
        ))}
        <CredentialAddRow title={FORGE_CONNECT} />
      </div>
    </SettingsCrop>
  );
}

/**
 * A part of the Settings window, in the window's own ground and never
 * operable, the way `Crop` draws a block of the panel.
 */
function SettingsCrop({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div className="settings-wrap">
      <div className="settings" role="img" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
