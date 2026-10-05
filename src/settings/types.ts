import type { ForgeHost, ProviderId } from "../panel/types";

/**
 * What a credential row leads on: an account's initials in its vendor's tint
 * (`CredentialMonogram`), or a forge's mark on a neutral disc (`CredentialDisc`
 * around `ForgeMark`).
 */
export type CredentialLead =
  | { kind: "monogram"; name: string; provider: ProviderId }
  | { kind: "forge"; host: ForgeHost };

/**
 * `CredentialRow`: one credential Sissy holds, as Settings lists it. Only a
 * healthy row is drawn, so there is no attention line and no fix.
 */
export interface CredentialRowData {
  id: string;
  title: string;
  badge: string | null;
  subtitle: string | null;
  lead: CredentialLead;
}

/**
 * One section of Settings ▸ Providers: the vendor's own row with its switch
 * and `ProviderRowSnapshot.detail` under it, then the accounts linked to it.
 * The account the CLI is signed into is read for free and gets no row.
 */
export interface ProviderSettings {
  provider: ProviderId;
  name: string;
  detail: string;
  accounts: CredentialRowData[];
}

/** Settings ▸ Forge's connections, each in the row shape a linked account takes. */
export interface ForgeSettings {
  connections: CredentialRowData[];
}

/** A `LabeledContent` row with a pop-up `Picker`: its heading, its caption and the value it shows. */
export interface PickerRowData {
  title: string;
  caption: string;
  value: string;
}

/** A `SettingsSwitchRow`: its heading, its caption, and whether the switch is on. */
export interface SwitchRowData {
  title: string;
  caption: string;
  on: boolean;
}

/**
 * Settings ▸ Awake, `AwakeSettingsView`: the mode and how long `Always`
 * holds, then what a hold covers. The captions are the ones the app words
 * for the state each control is in.
 */
export interface AwakeSettings {
  mode: PickerRowData;
  ceiling: PickerRowData;
  coversTitle: string;
  covers: SwitchRowData[];
}

export interface SettingsSnapshot {
  providers: ProviderSettings[];
  forge: ForgeSettings;
  awake: AwakeSettings;
}
