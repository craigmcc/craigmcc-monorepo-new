type AvailabilityTagProps = {
  label: string;
  value: string;
};

export function AvailabilityTag({ label, value }: AvailabilityTagProps) {
  return (
    <span className="badge badge-outline text-xs" title={label}>
      {label}: {value}
    </span>
  );
}

