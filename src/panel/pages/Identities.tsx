import type { ReactElement } from "react";
import { ChevronDown, ChevronRight } from "../components/Glyph";
import { IdentityMarkGlyph } from "../components/IdentityMark";
import { PageHeader } from "../components/PageHeader";
import { identityCount, identityDisclosure, identityFooter, identityVerdict } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { IdentityMark, IdentityRow } from "../types";

const CAVEAT = "A commit made with -c, --author or GIT_AUTHOR_EMAIL set is not covered.";
/** The order the rows sort in, which is the order the recap counts them in. */
const MARKS: IdentityMark[] = ["unexpected", "agrees", "unjudged"];
const HIDE = "Hide the rest";

interface IdentitiesProps {
  rows: IdentityRow[];
  focus: string | null;
  reading: string;
  open?: OpenPage;
}

/**
 * `PanelIdentities` under `identitiesHeader`: which repositories commit under
 * a name their forge does not expect. The header says when they were last
 * read, and the page opens folded, on a recap and the findings.
 */
export function Identities({ rows, focus, reading, open }: IdentitiesProps): ReactElement {
  return (
    <>
      <PageHeader
        title="Identities"
        subtitle={reading}
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
  const standing = rows.filter((row) => row.mark === "unexpected");
  const rest = rows.filter((row) => row.mark !== "unexpected");
  return (
    <div className="panel-section panel-identities">
      <div className="panel-label">
        Commit identity
        <span className="panel-label-end panel-identities-footer">
          {identityFooter(rows.length)}
        </span>
      </div>
      {rows.length > 0 && <Recap rows={rows} />}
      {standing.length > 0 && <IdentityRows rows={standing} focus={focus} />}
      {rest.length > 0 && (
        <>
          <div className="panel-disclosure">
            {showsAll ? <ChevronDown /> : <ChevronRight />}
            {showsAll ? HIDE : identityDisclosure(rows.length)}
          </div>
          {showsAll && <IdentityRows rows={rest} focus={focus} />}
        </>
      )}
      <div className="panel-identity-caveat">{CAVEAT}</div>
    </div>
  );
}

/**
 * The recap that leads the page whatever is folded under it: whether anything
 * is wrong, then a count per mark, so what the fold holds is said before it is
 * opened. Marks no row carries are left out.
 */
function Recap({ rows }: { rows: IdentityRow[] }): ReactElement {
  const count = (mark: IdentityMark): number => rows.filter((row) => row.mark === mark).length;
  return (
    <div className="panel-identity-recap">
      <div className="panel-identity-verdict">
        {identityVerdict(count("unexpected"), count("unjudged"))}
      </div>
      <div className="panel-identity-counts">
        {MARKS.filter((mark) => count(mark) > 0).map((mark) => (
          <span className="panel-identity-count" key={mark}>
            <IdentityMarkGlyph mark={mark} />
            {identityCount(mark, count(mark))}
          </span>
        ))}
      </div>
    </div>
  );
}

function IdentityRows({
  rows,
  focus,
}: {
  rows: IdentityRow[];
  focus: string | null;
}): ReactElement {
  return (
    <div className="panel-identity-rows">
      {rows.map((row) => (
        <IdentityRowView key={row.id} row={row} focused={row.id === focus} />
      ))}
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
