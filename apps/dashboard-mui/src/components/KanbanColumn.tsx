import { Box, Chip, Paper, Typography } from "@mui/material";
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
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 280,
        bgcolor: isOver ? "action.hover" : "grey.50",
        transition: "background-color 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={2}
        py={1.5}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {label}
        </Typography>
        <Chip
          label={cards.length}
          size="small"
          sx={{ height: 20, fontSize: 11 }}
        />
      </Box>
      <Box ref={setNodeRef} flex={1} p={1.5} minHeight={120}>
        {cards.map((card) => (
          <KanbanCardItem key={card.id} card={card} onEdit={onEditCard} />
        ))}
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
