import type { PropMeta } from "@repo/docs-schema";

import { AvailabilityTag } from "./AvailabilityTag";
import { TypeBadge } from "./TypeBadge";
import { sortProps } from "../utils/sortProps";

type PropsTableProps = {
  props: PropMeta[];
};

export function PropsTable({ props }: PropsTableProps) {
  const sorted = sortProps(props);

  return (
    <div className="overflow-x-auto rounded border border-base-300">
      <table className="table table-zebra border-collapse [&_td]:border [&_td]:border-base-300 [&_th]:border [&_th]:border-base-300">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
              </td>
              <td>
                <TypeBadge typeValue={prop.type} />
              </td>
              <td>{prop.required ? "Yes" : "No"}</td>
              <td>
                <div className="space-y-1">
                  <p>{prop.description}</p>
                  <div className="flex gap-2">
                    {prop.default ? <AvailabilityTag label="default" value={prop.default} /> : null}
                    {prop.since ? <AvailabilityTag label="since" value={prop.since} /> : null}
                    {prop.deprecated
                      ? (
                        <AvailabilityTag
                          label="deprecated"
                          value={typeof prop.deprecated === "string" ? prop.deprecated : "true"}
                        />
                        )
                      : null}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
