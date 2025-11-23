import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import { useEffect, useState } from "react";
import { palettes } from "@/common/palettes";


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const simpleIconCdn = (slug) =>
  `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/${slug}.svg`;




