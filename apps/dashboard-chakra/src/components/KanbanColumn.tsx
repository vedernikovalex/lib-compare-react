import { Box, Text } from "@chakra-ui/react";
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
    <Box
      flex={1}
      minW="280px"
      bg={isOver ? "blue.50" : "gray.50"}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      transition="background-color 0.15s"
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        px={3}
        py={2}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Text fontWeight="bold" fontSize="sm">
          {label}
        </Text>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w={5}
          h={5}
          borderRadius="full"
          bg="gray.300"
          fontSize="xs"
          fontWeight="bold"
        >
          {cards.length}
        </Box>
      </Box>
      <Box ref={setNodeRef} flex={1} p={2} minH="120px">
        {cards.map((card) => (
          <KanbanCardItem key={card.id} card={card} onEdit={onEditCard} />
        ))}
      </Box>
    </Box>
  );
};

export default KanbanColumn;
