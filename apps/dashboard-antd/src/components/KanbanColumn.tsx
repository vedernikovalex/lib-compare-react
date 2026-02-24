import { Badge, Typography } from "antd";
import { useDroppable } from "@dnd-kit/core";
import type {
  KanbanCard,
  KanbanColumnDef,
} from "@shared/src/types/kanban.types";
import KanbanCardItem from "./KanbanCardItem";

interface Props {
  column: KanbanColumnDef;
  cards: KanbanCard[];
  label: string;
  onEditCard: (card: KanbanCard) => void;
}

const KanbanColumn = ({ column, cards, label, onEditCard }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      style={{
        flex: 1,
        minWidth: 280,
        background: isOver ? "#f0f5ff" : "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography.Text strong>{label}</Typography.Text>
        <Badge count={cards.length} style={{ backgroundColor: "#8c8c8c" }} />
      </div>
      <div ref={setNodeRef} style={{ flex: 1, padding: 10, minHeight: 120 }}>
        {cards.map((card) => (
          <KanbanCardItem key={card.id} card={card} onEdit={onEditCard} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
