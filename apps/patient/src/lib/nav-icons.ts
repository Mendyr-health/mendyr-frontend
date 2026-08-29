import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Key,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  Stethoscope,
  User,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";

/**
 * Icons referenced by name from the NAV_LINKS constants.
 *
 * Listed explicitly rather than via `import * as LucideIcons` so the dev server
 * only compiles these modules instead of all ~1800 icons in the lucide barrel.
 * Add an entry here when a nav link starts using a new icon.
 */
export const NAV_ICONS = {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Key,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquare,
  Settings,
  Shield,
  Stethoscope,
  User,
  UserCheck,
  Users,
  Wrench,
} satisfies Record<string, React.ComponentType<{ className?: string }>>;
