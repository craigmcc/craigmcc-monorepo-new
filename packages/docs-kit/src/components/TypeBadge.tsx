import { formatType } from "../utils/formatType";

type TypeBadgeProps = {
  typeValue: string;
};

export function TypeBadge({ typeValue }: TypeBadgeProps) {
  return <code className="rounded bg-base-200 px-2 py-1 text-xs">{formatType(typeValue)}</code>;
}

