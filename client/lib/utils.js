import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const simpleIconCdn = (slug) =>
  `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${slug}.svg`;


export const Icon = ({ name, className = "w-5 h-5" }) => {
  let svgPath;
  switch (name) {
    case 'banknote':
      svgPath = "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM6.5 14.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM18 10h-2v4h2v-4ZM4 10h2v4H4v-4Z";
      break;
    case 'piggy-bank':
      svgPath = "M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM11 15H9V9h2v6Z";
      break;
    case 'credit-card':
      svgPath = "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM2 10h20V8H2v2ZM5 16h2v2H5v-2ZM8 16h2v2H8v-2ZM17 16h3v2h-3v-2Z";
      break;
    case 'trending-up':
      svgPath = "m22 2-7 7-4-4-5 5-2-2";
      break;
    case 'shield-check':
      svgPath = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z";
      break;
    case 'plane':
      svgPath = "M17.8 8.8 14 12l2.6 1.3L22 10l-4.2-1.2Z";
      break;
    case 'plus':
      svgPath = "M12 5v14M5 12h14";
      break;
    default:
      svgPath = "";
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={svgPath} />
    </svg>
  );
};

