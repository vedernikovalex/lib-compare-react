import { Button, Card, Col, Flex, Row, Typography } from "antd";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const libraryKeys = ["mui", "antd", "chakra"] as const;
type LibraryKey = (typeof libraryKeys)[number];

const criteriaKeys = [
  "performance",
  "accessibility",
  "dx",
  "ecosystem",
  "theming",
] as const;
type CriterionKey = (typeof criteriaKeys)[number];

const HomePage = () => {
  const { t } = useTranslations("homepage");
  const { t: tGlobal } = useTranslations("global");
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      gap={48}
      style={{ padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}
    >
      <Flex vertical gap={16}>
        <Text type="secondary">{tGlobal("appTitle")}</Text>
        <Title level={2} style={{ margin: 0 }}>
          {tGlobal("appTagline")}
        </Title>
        <Text type="secondary">{t("intro.description")}</Text>
        <Flex gap={16} wrap>
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            {tGlobal("cta.goToDashboard")}
          </Button>
          <Button onClick={() => navigate("/kanban")}>
            {tGlobal("cta.goToKanban")}
          </Button>
        </Flex>
      </Flex>

      <Flex vertical gap={16}>
        <Title level={4} style={{ margin: 0 }}>
          {t("libraries.title")}
        </Title>
        <Row gutter={[16, 16]}>
          {libraryKeys.map((key: LibraryKey) => (
            <Col xs={24} sm={8} key={key}>
              <Card bordered style={{ height: "100%" }}>
                <Flex vertical gap={8}>
                  <Title level={5} style={{ margin: 0 }}>
                    {t(`libraries.${key}.name`)}
                  </Title>
                  <Text type="secondary">
                    {t(`libraries.${key}.description`)}
                  </Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      </Flex>

      <Flex vertical gap={16}>
        <Title level={4} style={{ margin: 0 }}>
          {t("criteria.title")}
        </Title>
        <Flex vertical gap={8}>
          {criteriaKeys.map((key: CriterionKey) => (
            <Card bordered key={key} size="small">
              <Flex gap={16} align="baseline">
                <Text strong style={{ minWidth: 160 }}>
                  {t(`criteria.${key}.label`)}
                </Text>
                <Text strong type="success" style={{ minWidth: 48 }}>
                  {t(`criteria.${key}.weight`)}
                </Text>
                <Text type="secondary">{t(`criteria.${key}.description`)}</Text>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomePage;
