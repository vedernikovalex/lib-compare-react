import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
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

  return (
    <Dialog open={card !== null} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("modal.title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label={t("modal.fields.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            size="small"
            autoFocus
          />
          <TextField
            label={t("modal.fields.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="small"
          />
          <FormControl size="small" fullWidth>
            <InputLabel>{t("modal.fields.priority")}</InputLabel>
            <Select
              label={t("modal.fields.priority")}
              value={priority}
              onChange={(e) => setPriority(e.target.value as KanbanPriority)}
            >
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p}>
                  {t(`priority.${p}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t("modal.fields.assignee")}
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("modal.cancel")}</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!title.trim()}
        >
          {t("modal.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KanbanEditModal;
