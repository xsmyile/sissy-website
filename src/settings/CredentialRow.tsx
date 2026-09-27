import type { ReactElement } from "react";
import { Ellipsis, PlusCircle } from "../panel/components/Glyph";
import { ForgeMark } from "../panel/components/Sprite";
import type { CredentialLead, CredentialRowData } from "./types";

/** The shortest run of letters that reads as a word rather than a fragment. */
const SHORTEST_WORD = 2;
const MAX_INITIALS = 2;

/**
 * `CredentialMonogram.initials`: two letters at most, off whatever names the
 * row. An address is read to its local part first, and a word has to be
 * letters all through, which is what keeps `935` out of `Group 935`'s disc.
 */
export function initials(name: string): string {
  const named = name.split("@")[0] ?? name;
  return named
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= SHORTEST_WORD && /^\p{L}+$/u.test(word))
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/**
 * `CredentialDisc`: the disc a credential row leads on. The badge it draws
 * only when a row needs attention is not drawn, because every row here is
 * healthy.
 */
function Disc({ lead }: { lead: CredentialLead }): ReactElement {
  if (lead.kind === "forge") {
    return (
      <span className="settings-disc" data-tint="secondary">
        <ForgeMark host={lead.host} />
      </span>
    );
  }
  return (
    <span className="settings-disc" data-tint={lead.provider}>
      {initials(lead.name)}
    </span>
  );
}

/** `PlanBadge`: the plan in a capsule, as the panel draws it beside an account. */
function PlanBadge({ plan }: { plan: string }): ReactElement {
  return <span className="settings-badge">{plan}</span>;
}

/**
 * `CredentialRow`: who the credential is, what it is on, and its actions in a
 * menu rather than as bare glyphs. The menu is drawn and inert.
 */
export function CredentialRow({ row }: { row: CredentialRowData }): ReactElement {
  return (
    <div className="settings-row settings-credential">
      <Disc lead={row.lead} />
      <div className="settings-credential-lines">
        <div className="settings-credential-title">
          <span className="settings-title">{row.title}</span>
          {row.badge !== null && <PlanBadge plan={row.badge} />}
        </div>
        {row.subtitle !== null && <div className="settings-subtitle">{row.subtitle}</div>}
      </div>
      <span className="settings-menu">
        <Ellipsis />
      </span>
    </div>
  );
}

/** `CredentialAddRow`: the last row of a list, which is where the control that lengthens it belongs. */
export function CredentialAddRow({ title }: { title: string }): ReactElement {
  return (
    <div className="settings-row settings-add">
      <PlusCircle />
      <span>{title}</span>
    </div>
  );
}
