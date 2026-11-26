const ICONS = {
  Facebook: (
    <path d="M13.5 21.95V14h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.3 0-1.25-.12-2.4-.12-2.38 0-4 1.45-4 4.1v2.3H7.6V14h2.7v7.95a10 10 0 1 1 3.2 0Z" fill="currentColor" />
  ),
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  YouTube: (
    <g>
      <path d="M22 12c0 2.6-.2 4.3-.5 5.2a2.7 2.7 0 0 1-1.9 1.9C18 19.5 12 19.5 12 19.5s-6 0-7.6-.4a2.7 2.7 0 0 1-1.9-1.9C2.2 16.3 2 14.6 2 12s.2-4.3.5-5.2a2.7 2.7 0 0 1 1.9-1.9C6 4.5 12 4.5 12 4.5s6 0 7.6.4a2.7 2.7 0 0 1 1.9 1.9c.3.9.5 2.6.5 5.2Z" fill="currentColor" />
      <path d="m10 15.2 5.2-3.2L10 8.8v6.4Z" fill="var(--social-cutout, #0b1220)" />
    </g>
  ),
  X: (
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" fill="currentColor" />
  ),
};

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "X", href: "https://x.com" },
];

export function SocialIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

export function SocialLinks({ className = "" }) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {SOCIAL_LINKS.map(({ name, href }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={name === "X" ? "X (Twitter)" : name}
            className="social-link flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:border-lime-300/50 hover:bg-lime-300 hover:text-[#0b1220]"
          >
            <SocialIcon name={name} />
          </a>
        </li>
      ))}
    </ul>
  );
}
