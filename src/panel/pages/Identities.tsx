import type { ReactElement } from "react";
import { ChevronDown, ChevronRight } from "../components/Glyph";
import { IdentityMarkGlyph } from "../components/IdentityMark";
import { PageHeader } from "../components/PageHeader";
import { identityDisclosure, identityFooter } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { IdentityRow } from "../types";

const CAVEAT = "A commit made with -c, --author or GIT_AUTHOR_EMAIL set is not covered.";
const VERDICT = "Every repository commits under the name its forge expects.";
const HIDE = "Hide the rest";

interface IdentitiesProps {
  rows: IdentityRow[];
  focus: string | null;
  open?: OpenPage;
}

/**
 * `PanelIdentities` under `identitiesHeader`: which repositories commit under
 * a name their forge does not expect. The page opens folded, on the findings
 * and the repository it was opened about.
 */
export function Identities({ rows, focus, open }: IdentitiesProps): ReactElement {
  return (
    <>
      <PageHeader
        title="Identities"
        backLabel="Back to today"
        back={open && (() => open(OVERVIEW, BACK))}
      />
      <IdentitiesBlock rows={rows} focus={focus} showsAll={false} />
    </>
  );
}

/**
 * The page's one block. `showsAll` is the disclosure's state, which the app
 * keeps local to the page; here the caller picks it, because no panel on the
 * site toggles it.
 */
export function IdentitiesBlock({
  rows,
  focus,
  showsAll,
}: {
  rows: IdentityRow[];
  focus: string | null;
  showsAll: boolean;
}): ReactElement {
  const standing = rows.filter((row) => row.mark !== "agrees" || row.id === focus);
  const shown = showsAll ? rows : standing;
  const verdict = rows.length > 0 && standing.length === 0 && !showsAll;
  return (
    <div className="panel-section panel-identities">
      <div className="panel-label">
        Commit identity
        <span className="panel-label-end panel-identities-footer">
          {identityFooter(rows.length)}
        </span>
      </div>
      {verdict && <div className="panel-identity-verdict">{VERDICT}</div>}
      {shown.length > 0 && (
        <div className="panel-identity-rows">
          {shown.map((row) => (
            <IdentityRowView key={row.id} row={row} focused={row.id === focus} />
          ))}
        </div>
      )}
      {rows.length > standing.length && (
        <div className="panel-disclosure">
          {showsAll ? <ChevronDown /> : <ChevronRight />}
          {showsAll ? HIDE : identityDisclosure(rows.length)}
        </div>
      )}
      <div className="panel-identity-caveat">{CAVEAT}</div>
    </div>
  );
}

/**
 * `IdentityRowView`: the mark in a column of its own so every name starts at
 * the same x, and the details hung under the name, because an address is
 * longer than any column the panel can spare.
 */
function IdentityRowView({ row, focused }: { row: IdentityRow; focused: boolean }): ReactElement {
  const unexpected = row.mark === "unexpected";
  return (
    <div className="panel-identity-row" data-focused={focused || undefined}>
      <span className="panel-identity-mark">
        <IdentityMarkGlyph mark={row.mark} />
      </span>
      <div className="panel-identity-detail">
        <span className="panel-identity-name">{row.name}</span>
        <span className="panel-identity-author" data-unexpected={unexpected || undefined}>
          {row.author}
        </span>
        {row.expectation !== null && (
          <span className="panel-identity-expectation">{row.expectation}</span>
        )}
        {row.origin !== null && <span className="panel-identity-origin">{row.origin}</span>}
        {row.fix !== null && <span className="panel-small-button">Copy the fix</span>}
      </div>
    </div>
  );
}
