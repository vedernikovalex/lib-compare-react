import { useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
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
import type { TranslationKey } from "@shared/src/lang/index";
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
    <Box display="flex" flexDirection="column" gap={6}>
      <Text fontSize="3xl" fontWeight="bold" as="h1">
        {t("title")}
      </Text>

      <DndContext onDragEnd={handleDragEnd}>
        <HStack gap={4} alignItems="flex-start" overflowX="auto">
          {kanbanColumnDefs.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter((c) => c.columnId === column.id)}
              label={t(column.labelKey as TranslationKey)}
              onEditCard={setEditingCard}
            />
          ))}
        </HStack>
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
