import type { ReactElement, SVGProps } from "react";
import { symbolHref } from "../../content/site";
import type { ForgeHost, ProviderId } from "../types";

type SpriteSymbolProps = Omit<SVGProps<SVGSVGElement>, "children" | "aria-hidden"> & {
  id: string;
};

export function SpriteSymbol({ id, ...props }: SpriteSymbolProps): ReactElement {
  return (
    <svg aria-hidden="true" {...props}>
      <use href={symbolHref(id)} />
    </svg>
  );
}

export function ProviderMark({
  provider,
  large = false,
}: {
  provider: ProviderId;
  large?: boolean;
}): ReactElement {
  return (
    <SpriteSymbol
      id={`mark-${provider}`}
      className={large ? "panel-mark panel-mark-header" : "panel-mark"}
      data-provider={provider}
    />
  );
}

export function ForgeMark({ host }: { host: ForgeHost }): ReactElement {
  return <SpriteSymbol id={`mark-${host}`} className="panel-forge" />;
}

export function Cat({ className }: { className: string }): ReactElement {
  return (
    <span className={className}>
      <SpriteSymbol id="sissy-body" className="panel-cat-body" />
      <SpriteSymbol id="sissy-eye" className="panel-cat-eye" />
    </span>
  );
}
