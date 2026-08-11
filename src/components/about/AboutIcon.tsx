import type { ReactNode } from "react";
import {
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiCompass,
  FiDroplet,
  FiGlobe,
  FiHeart,
  FiLayers,
  FiPackage,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

// Icon-key → element map. The admin stores an icon as a key string (see
// ABOUT_ICON_KEYS in data/about.ts); BOTH the public /about page and the admin
// About editor resolve keys through here, so the glyph an admin previews is
// exactly what visitors see and the two can never drift. Unknown keys fall
// back to a neutral check.
const ICONS: Record<string, ReactNode> = {
  target: <FiTarget />,
  shield: <FiShield />,
  heart: <FiHeart />,
  "trending-up": <FiTrendingUp />,
  zap: <FiZap />,
  droplet: <FiDroplet />,
  package: <FiPackage />,
  users: <FiUsers />,
  compass: <FiCompass />,
  layers: <FiLayers />,
  award: <FiAward />,
  "check-circle": <FiCheckCircle />,
  globe: <FiGlobe />,
  activity: <FiActivity />,
};

/** Resolve an About icon key to its element, with a safe fallback. */
export function AboutIcon({ name }: { name: string }): ReactNode {
  return ICONS[name] ?? <FiCheckCircle />;
}
