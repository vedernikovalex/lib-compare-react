import { Box, IconButton, Text } from "@chakra-ui/react";
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
  high: "#ff4d4f",
  medium: "#faad14",
  low: "#1677ff",
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
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={3}
      mb={2}
      cursor="grab"
      opacity={isDragging ? 0.5 : 1}
      style={{ transform: CSS.Translate.toString(transform) }}
      _hover={{ borderColor: "blue.400", boxShadow: "sm" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1}
      >
        <Text fontSize="sm" fontWeight="semibold" flex={1} pr={2}>
          {card.title}
        </Text>
        <IconButton
          aria-label={`Edit ${card.title}`}
          size="xs"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ✎
        </IconButton>
      </Box>
      <Text fontSize="xs" color="gray.500" mb={2}>
        {card.description.slice(0, 60)}
        {card.description.length > 60 ? "…" : ""}
      </Text>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          as="span"
          display="inline-block"
          px={2}
          py={0.5}
          borderRadius="full"
          fontSize="xs"
          fontWeight="medium"
          bg={PRIORITY_COLORS[card.priority] + "22"}
          color={PRIORITY_COLORS[card.priority]}
          border="1px solid"
          borderColor={PRIORITY_COLORS[card.priority] + "66"}
        >
          {card.priority}
        </Box>
        <Text fontSize="xs" color="gray.400">
          {card.assignee}
        </Text>
      </Box>
    </Box>
  );
};

export default KanbanCardItem;
