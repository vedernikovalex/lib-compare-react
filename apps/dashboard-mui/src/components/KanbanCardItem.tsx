import { Box, Chip, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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

const PRIORITY_COLORS: Record<KanbanPriority, "error" | "warning" | "info"> = {
  high: "error",
  medium: "warning",
  low: "info",
};

const KanbanCardItem = ({ card, onEdit }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
      data: { card },
    });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        p: 2,
        mb: 1,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Translate.toString(transform),
        "&:hover": { borderColor: "primary.main", boxShadow: 1 },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1}
      >
        <Typography variant="body2" fontWeight={600} flex={1} pr={1}>
          {card.title}
        </Typography>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{ p: 0.5 }}
          aria-label={`Edit ${card.title}`}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={1}
      >
        {card.description.slice(0, 60)}
        {card.description.length > 60 ? "…" : ""}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip
          label={card.priority}
          color={PRIORITY_COLORS[card.priority]}
          size="small"
          sx={{ height: 20, fontSize: 11 }}
        />
        <Typography variant="caption" color="text.secondary">
          {card.assignee}
        </Typography>
      </Box>
    </Box>
  );
};

export default KanbanCardItem;
