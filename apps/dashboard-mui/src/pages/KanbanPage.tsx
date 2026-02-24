import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  initialKanbanCards,
  kanbanColumnDefs,
} from "@shared/src/data/kanban.data";
import type {
  KanbanCard,
  KanbanColumnId,
} from "@shared/src/types/kanban.types";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import KanbanColumn from "../components/KanbanColumn";
import KanbanEditModal from "../components/KanbanEditModal";

const KanbanPage = () => {
  const { t } = useTranslations("kanban");
  const [cards, setCards] = useState<KanbanCard[]>(initialKanbanCards);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }
    const cardId = active.id as string;
    const newColumnId = over.id as KanbanColumnId;
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, columnId: newColumnId } : c)),
    );
  };

  const handleSave = (updated: KanbanCard) => {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCard(null);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        {t("title")}
      </Typography>

      <DndContext onDragEnd={handleDragEnd}>
        <Box
          display="flex"
          gap={2}
          alignItems="flex-start"
          flexWrap="nowrap"
          overflow="auto"
        >
          {kanbanColumnDefs.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter((c) => c.columnId === column.id)}
              label={t(column.labelKey as Parameters<typeof t>[0])}
              onEditCard={setEditingCard}
            />
          ))}
        </Box>
      </DndContext>

      <KanbanEditModal
        card={editingCard}
        onSave={handleSave}
        onClose={() => setEditingCard(null)}
      />
    </Box>
  );
};

export default KanbanPage;
