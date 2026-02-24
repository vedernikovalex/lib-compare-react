import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
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
    <Modal
      open={card !== null}
      title={t("modal.title")}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("modal.cancel")}
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          disabled={!title.trim()}
        >
          {t("modal.save")}
        </Button>,
      ]}
    >
      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label={t("modal.fields.title")} required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </Form.Item>
        <Form.Item label={t("modal.fields.description")}>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </Form.Item>
        <Form.Item label={t("modal.fields.priority")}>
          <Select
            value={priority}
            onChange={setPriority}
            options={PRIORITIES.map((p) => ({
              value: p,
              label: t(`priority.${p}`),
            }))}
          />
        </Form.Item>
        <Form.Item label={t("modal.fields.assignee")}>
          <Input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default KanbanEditModal;
