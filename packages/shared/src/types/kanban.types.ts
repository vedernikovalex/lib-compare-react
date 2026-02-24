export type KanbanColumnId = "todo" | "in-progress" | "done";
export type KanbanPriority = "low" | "medium" | "high";

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: KanbanPriority;
  columnId: KanbanColumnId;
}

export interface KanbanColumnDef {
  id: KanbanColumnId;
  labelKey: string;
}
