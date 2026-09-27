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

export interface SettingsSnapshot {
  providers: ProviderSettings[];
  forge: ForgeSettings;
}
