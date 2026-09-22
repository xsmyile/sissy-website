import type { ReactElement } from "react";
import type { AccountIdentity } from "../types";
import { ChevronUpDown, PersonTwo } from "./Glyph";

/** `ClaudeAccountSwitchCopy.useInCLI` and the badge that marks its opposite. */
const USE_IN_CLI = "Use in CLI";
const IN_CLI_BADGE = "· in CLI";

/**
 * `PanelProviderPage.identity`: who this account is, under the name the header
 * already prints.
 *
 * The address, then the organisation and the plan on one line where the vendor
 * names either, then the two controls. The plan sits here rather than against
 * the provider's name in the header, because it qualifies the account and not
 * the CLI.
 *
 * The switch and the badge are the two halves of one state and never both
 * show: the app draws `Use in CLI` only on an account the CLI is not on, and
 * the badge only on the one it is, and only where a second account exists to
 * tell it from. Both are drawn and inert here, like every other control the
 * replica does not route.
 */
export function Identity({ identity }: { identity: AccountIdentity }): ReactElement {
  return (
    <div className="panel-identity">
      <div className="panel-identity-lines">
        <div className="panel-email">{identity.email}</div>
        <div className="panel-organisation">
          {identity.organization !== null && <span>{identity.organization}</span>}
          <span className="panel-badge">{identity.plan}</span>
          {identity.inCLI && identity.hasPicker && <span>{IN_CLI_BADGE}</span>}
        </div>
      </div>
      {!identity.inCLI && identity.switchable && (
        <span className="panel-use-in-cli">{USE_IN_CLI}</span>
      )}
      {identity.hasPicker && (
        <span className="panel-picker">
          <PersonTwo />
          <ChevronUpDown />
        </span>
      )}
    </div>
  );
}
