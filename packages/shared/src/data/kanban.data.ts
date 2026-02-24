import type { KanbanCard, KanbanColumnDef } from "../types/kanban.types";

const ASSIGNEES = ["Alice Chen", "Bob Martinez", "Clara Kim", "David Patel"];

export const initialKanbanCards: KanbanCard[] = [
  {
    id: "card-1",
    title: "Set up CI pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment on every push.",
    assignee: ASSIGNEES[0],
    priority: "high",
    columnId: "todo",
  },
  {
    id: "card-2",
    title: "Write unit tests for auth module",
    description:
      "Cover login, logout, and token refresh flows with Jest unit tests.",
    assignee: ASSIGNEES[1],
    priority: "high",
    columnId: "todo",
  },
  {
    id: "card-3",
    title: "Add error boundary components",
    description:
      "Wrap top-level routes with React error boundaries to prevent blank-screen crashes.",
    assignee: ASSIGNEES[2],
    priority: "medium",
    columnId: "todo",
  },
  {
    id: "card-4",
    title: "Integrate Sentry for error tracking",
    description:
      "Set up Sentry SDK, configure source maps, and add environment-based DSN config.",
    assignee: ASSIGNEES[3],
    priority: "medium",
    columnId: "todo",
  },
  {
    id: "card-5",
    title: "Document API endpoints",
    description:
      "Write OpenAPI 3.0 spec for all REST endpoints and publish to internal docs site.",
    assignee: ASSIGNEES[0],
    priority: "low",
    columnId: "todo",
  },
  {
    id: "card-6",
    title: "Implement dark mode",
    description:
      "Add theme toggle using CSS custom properties. Persist preference in localStorage.",
    assignee: ASSIGNEES[1],
    priority: "medium",
    columnId: "in-progress",
  },
  {
    id: "card-7",
    title: "Migrate to React Query v5",
    description:
      "Update all data fetching hooks from v4 to v5 API; handle breaking changes in cache keys.",
    assignee: ASSIGNEES[2],
    priority: "high",
    columnId: "in-progress",
  },
  {
    id: "card-8",
    title: "Refactor navigation component",
    description:
      "Extract nav items into config array, support role-based visibility, add keyboard shortcuts.",
    assignee: ASSIGNEES[3],
    priority: "low",
    columnId: "in-progress",
  },
  {
    id: "card-9",
    title: "Add table virtualization",
    description:
      "Use TanStack Virtual to render only visible rows for large datasets (10k+ rows).",
    assignee: ASSIGNEES[0],
    priority: "medium",
    columnId: "in-progress",
  },
  {
    id: "card-10",
    title: "Set up monorepo workspace",
    description:
      "Configure yarn workspaces with shared packages, path aliases, and root-level scripts.",
    assignee: ASSIGNEES[1],
    priority: "high",
    columnId: "done",
  },
  {
    id: "card-11",
    title: "Design token system",
    description:
      "Define color, spacing, typography, and radius tokens in tokens.json; wire to all three UI libs.",
    assignee: ASSIGNEES[2],
    priority: "high",
    columnId: "done",
  },
  {
    id: "card-12",
    title: "Implement translation hook",
    description:
      "Build type-safe useTranslations hook with namespace support and compile-time key checking.",
    assignee: ASSIGNEES[3],
    priority: "medium",
    columnId: "done",
  },
  {
    id: "card-13",
    title: "Build homepage across all apps",
    description:
      "Create identical homepage with highlights grid, CTAs, and translation-driven copy.",
    assignee: ASSIGNEES[0],
    priority: "medium",
    columnId: "done",
  },
  {
    id: "card-14",
    title: "Configure ESLint and Prettier",
    description:
      "Shared ESLint config at root, per-app overrides, Prettier integration, and pre-commit hook.",
    assignee: ASSIGNEES[1],
    priority: "low",
    columnId: "done",
  },
  {
    id: "card-15",
    title: "Set up Vite build for all apps",
    description:
      "Configure Vite per app with @shared alias, port assignment, and optimizeDeps settings.",
    assignee: ASSIGNEES[2],
    priority: "low",
    columnId: "done",
  },
];

export const kanbanColumnDefs: KanbanColumnDef[] = [
  { id: "todo", labelKey: "kanban.columns.todo" },
  { id: "in-progress", labelKey: "kanban.columns.inProgress" },
  { id: "done", labelKey: "kanban.columns.done" },
];
