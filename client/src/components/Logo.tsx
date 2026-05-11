import { THEME } from '../theme';

interface LogoProps {
  size?: number;
  primary?: string;
  secondary?: string;
}

export default function Logo({
  size = 28,
  primary = THEME.primary,
  secondary = '#F0F4F8',
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14" stroke={primary} strokeWidth="2" opacity="0.35" />
      <path
        d="M5 12h13a3 3 0 1 0-3-3"
        stroke={primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 17h17a3.5 3.5 0 1 1-3.5 3.5"
        stroke={secondary}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 22h9"
        stroke={primary}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
