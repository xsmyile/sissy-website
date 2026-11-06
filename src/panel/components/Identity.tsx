import type { ReactElement } from "react";
import { inUseCaption } from "../format";
import type { AccountIdentity } from "../types";
import { ChevronUpDown, UserSwitch } from "./Glyph";

/**
 * `PanelProviderPage.identity`: who this account is, under the name the header
 * already prints.
 *
 * The account's name with its plan beside it, the shape the Overview's rows
 * take, then what that name leaves out, and the picker, which changes what the
 * page reads and never what a CLI is signed in as. Under them, how many running
 * sessions are on the account, while any are. The picker is drawn and inert,
 * like every other control the replica does not route.
 */
export function Identity({ identity }: { identity: AccountIdentity }): ReactElement {
  const inUse = inUseCaption(identity.runningSessions);
  return (
    <div className="panel-identity">
      <div className="panel-identity-account">
        <div className="panel-identity-lines">
          <div className="panel-account-name">
            <span className="panel-account-title">{identity.name}</span>
            <span className="panel-badge">{identity.plan}</span>
          </div>
          {identity.detail !== null && (
            <div className="panel-account-detail">{identity.detail}</div>
          )}
        </div>
        {identity.hasPicker && (
          <span className="panel-picker">
            <UserSwitch />
            <ChevronUpDown />
          </span>
        )}
      </div>
      {inUse !== null && <div className="panel-account-caption">{inUse}</div>}
    </div>
  );
}
