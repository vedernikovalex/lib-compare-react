import { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import type {
  KanbanCard,
  KanbanPriority,
} from "@shared/src/types/kanban.types";
import { useTranslations } from "@shared/src/hooks/useTranslations";

interface Props {
  card: KanbanCard | null;
  onSave: (updated: KanbanCard) => void;
  onClose: () => void;
}

const PRIORITIES: KanbanPriority[] = ["low", "medium", "high"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
};

const KanbanEditModal = ({ card, onSave, onClose }: Props) => {
  const { t } = useTranslations("kanban");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<KanbanPriority>("medium");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
      setPriority(card.priority);
      setAssignee(card.assignee);
    }
  }, [card]);

  const handleSave = () => {
    if (!card || !title.trim()) {
      return;
    }
    onSave({ ...card, title: title.trim(), description, priority, assignee });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!card) {
    return null;
  }

  return (
    <Box position="fixed" inset={0} zIndex={1000} onKeyDown={handleKeyDown}>
      <Box
        position="absolute"
        inset={0}
        bg="blackAlpha.600"
        onClick={onClose}
      />
      <Box
        position="relative"
        zIndex={1}
        maxW="500px"
        mx="auto"
        mt="15vh"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        display="flex"
        flexDirection="column"
        gap={4}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kanban-modal-title"
      >
        <Box fontSize="lg" fontWeight="bold" id="kanban-modal-title">
          {t("modal.title")}
        </Box>

        <Box>
          <label htmlFor="edit-title" style={labelStyle}>
            {t("modal.fields.title")}
          </label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </Box>

        <Box>
          <label htmlFor="edit-description" style={labelStyle}>
            {t("modal.fields.description")}
          </label>
          <Textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Box>

        <Box>
          <label htmlFor="edit-priority" style={labelStyle}>
            {t("modal.fields.priority")}
          </label>
          <NativeSelect.Root>
            <NativeSelect.Field
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as KanbanPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`priority.${p}`)}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>

        <Box>
          <label htmlFor="edit-assignee" style={labelStyle}>
            {t("modal.fields.assignee")}
          </label>
          <Input
            id="edit-assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </Box>

        <HStack gap={2} justify="flex-end" mt={2}>
          <Button variant="outline" onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <Button
            colorPalette="blue"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            {t("modal.save")}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default KanbanEditModal;
