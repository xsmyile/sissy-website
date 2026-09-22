import type { CSSProperties, ReactElement } from "react";
import { projectFigures, projectsCount } from "../format";
import type { ProjectRow as ProjectRowData } from "../types";
import { ChevronRight } from "./Glyph";
import { ForgeMark } from "./Sprite";

/**
 * `ProjectRowView` with the bar behind the text: the row's share of the day
 * as a wash, which is how both folded sections draw it.
 */
export function ProjectRow({ row }: { row: ProjectRowData }): ReactElement {
  return (
    <div className="panel-project" style={{ "--share": row.share } as CSSProperties}>
      <span className="panel-name">
        {row.owner !== null && <span className="panel-owner">{row.owner}/</span>}
        {row.repo}
      </span>
      {row.forge !== null && <ForgeMark host={row.forge} />}
      <span className="panel-value panel-value-strong">{projectFigures(row.tokens, row.cost)}</span>
    </div>
  );
}

/** `ProjectsSectionLabel`: the way into the whole list, with its length. */
export function ProjectsLabel({ text, count }: { text: string; count: number }): ReactElement {
  return (
    <div className="panel-label">
      {text}
      <span className="panel-count">
        {projectsCount(count)}
        <ChevronRight className="panel-chevron" />
      </span>
    </div>
  );
}

/**
 * The label counts every project of the day rather than the rows under it,
 * because the last row can fold several.
 */
export function ProjectsSection({
  label,
  rows,
  count,
}: {
  label: string;
  rows: ProjectRowData[];
  count: number;
}): ReactElement {
  return (
    <div className="panel-section panel-projects">
      <ProjectsLabel text={label} count={count} />
      <div className="panel-project-list">
        {rows.map((row) => (
          <ProjectRow row={row} key={row.id} />
        ))}
      </div>
    </div>
  );
}
