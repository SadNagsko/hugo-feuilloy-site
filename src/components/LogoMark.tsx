export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      <rect width="64" height="64" rx="18" fill="#6A48F2" />
      <g fill="#FFFFFF">
        <rect x="10" y="19" width="6" height="26" rx="1" />
        <rect x="20" y="19" width="6" height="26" rx="1" />
        <rect x="10" y="29.5" width="16" height="5" rx="1" />
        <rect x="31" y="19" width="6" height="26" rx="1" />
        <rect x="31" y="19" width="13" height="5.5" rx="1" />
        <rect x="31" y="29.5" width="11" height="5" rx="1" />
        <circle cx="50.5" cy="41.5" r="3.5" />
      </g>
    </svg>
  );
}
