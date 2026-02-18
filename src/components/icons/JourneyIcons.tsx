import { memo } from 'react';

export const StruggleIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <circle cx="32" cy="32" r="30" stroke="var(--color-warning)" strokeWidth="2" />
    <path
      d="M22 38C22 38 26 34 32 34C38 34 42 38 42 38"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="2" fill="var(--color-warning)" />
    <circle cx="40" cy="24" r="2" fill="var(--color-warning)" />
    <path d="M32 44V48" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M26 46L32 48L38 46"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
));
StruggleIcon.displayName = 'StruggleIcon';

export const DiscoveryIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <rect
      x="12"
      y="18"
      width="40"
      height="28"
      rx="2"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
    />
    <path d="M32 28L38 34L26 34L32 28Z" fill="var(--color-teal-light)" />
    <circle cx="48" cy="14" r="8" fill="var(--color-warning)" />
    <path
      d="M45 14L47 16L51 11"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
DiscoveryIcon.displayName = 'DiscoveryIcon';

export const TransformationIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <path
      d="M16 32C16 23.163 23.163 16 32 16C40.837 16 48 23.163 48 32C48 40.837 40.837 48 32 48"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32 16V32L40 40"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 44L20 52L28 44"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
TransformationIcon.displayName = 'TransformationIcon';

export const GrowthIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <path
      d="M12 52L24 40L32 48L52 28"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44 28H52V36"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="40" r="3" fill="var(--color-warning)" />
    <circle cx="32" cy="48" r="3" fill="var(--color-warning)" />
    <circle cx="52" cy="28" r="3" fill="var(--color-warning)" />
  </svg>
));
GrowthIcon.displayName = 'GrowthIcon';

export const HandshakeIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <path
      d="M20 32L28 24L36 32L44 24"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 32H20L32 44L44 32H52"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="26" cy="32" r="2" fill="var(--color-teal-light)" />
    <circle cx="38" cy="32" r="2" fill="var(--color-teal-light)" />
  </svg>
));
HandshakeIcon.displayName = 'HandshakeIcon';

export const IdeaIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <path
      d="M32 12C24.268 12 18 18.268 18 26C18 31.5 21 36.5 25 39V44C25 45.105 25.895 46 27 46H37C38.105 46 39 45.105 39 44V39C43 36.5 46 31.5 46 26C46 18.268 39.732 12 32 12Z"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 46H37V50C37 51.105 36.105 52 35 52H29C27.895 52 27 51.105 27 50V46Z"
      stroke="var(--color-warning)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 18V26L36 30"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
IdeaIcon.displayName = 'IdeaIcon';

export const SupportIcon = memo(() => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto"
  >
    <rect
      x="16"
      y="20"
      width="32"
      height="24"
      rx="4"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
    />
    <path
      d="M24 28H40M24 36H36"
      stroke="var(--color-teal-light)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="44" cy="44" r="12" fill="var(--color-warning)" />
    <path
      d="M44 38V44L48 46"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
SupportIcon.displayName = 'SupportIcon';
