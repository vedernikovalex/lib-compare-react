import { Button, Tag, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type {
  KanbanCard,
  KanbanPriority,
} from "@shared/src/types/kanban.types";

interface Props {
  card: KanbanCard;
  onEdit: (card: KanbanCard) => void;
}

const PRIORITY_COLORS: Record<KanbanPriority, string> = {
  high: "error",
  medium: "warning",
  low: "processing",
};

const KanbanCardItem = ({ card, onEdit }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
      data: { card },
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: 12,
        marginBottom: 8,
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 6,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Translate.toString(transform),
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <Typography.Text
          strong
          style={{ flex: 1, paddingRight: 8, fontSize: 13 }}
        >
          {card.title}
        </Typography.Text>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{ padding: "0 4px", minWidth: 24, height: 24 }}
          aria-label={`Edit ${card.title}`}
        />
      </div>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 12, display: "block", marginBottom: 8 }}
      >
        {card.description.slice(0, 60)}
        {card.description.length > 60 ? "…" : ""}
      </Typography.Text>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tag
          color={PRIORITY_COLORS[card.priority]}
          style={{ margin: 0, fontSize: 11 }}
        >
          {card.priority}
        </Tag>
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          {card.assignee}
        </Typography.Text>
      </div>
    </div>
  );
};

export default KanbanCardItem;
