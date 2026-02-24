import { useState } from "react";
import { Typography } from "antd";
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        {t("title")}
      </Typography.Title>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            overflow: "auto",
          }}
        >
          {kanbanColumnDefs.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter((c) => c.columnId === column.id)}
              label={t(column.labelKey as TranslationKey)}
              onEditCard={setEditingCard}
            />
          ))}
        </div>
      </DndContext>

      <KanbanEditModal
        card={editingCard}
        onSave={handleSave}
        onClose={() => setEditingCard(null)}
      />
    </div>
  );
};

export default KanbanPage;
