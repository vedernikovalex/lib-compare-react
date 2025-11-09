import { Button, Card, Divider, Flex, List, Typography } from "antd";
import { highlightKeys } from "@shared/src/data/homepage.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const { Title, Text } = Typography;

const HomePage = () => {
  const { t } = useTranslations("homepage");
  const { t: tGlobal } = useTranslations("global");

  const typedKeys = highlightKeys as Array<
    "featureParity" | "performanceBenchmarks" | "accessibilityGoals"
  >;

  return (
    <Flex
      vertical
      gap={32}
      style={{ padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}
    >
      <Flex vertical gap={16}>
        <Text type="secondary">{tGlobal("appTitle")}</Text>
        <Title level={2} style={{ margin: 0 }}>
          {tGlobal("appTagline")}
        </Title>
        <Text type="secondary">{t("intro.description")}</Text>
        <Flex gap={16} wrap>
          <Button type="primary">
            {tGlobal("cta.viewMeasurementProtocol")}
          </Button>
          <Button>{tGlobal("cta.browseLatestResults")}</Button>
        </Flex>
      </Flex>

      <Card bordered>
        <Flex vertical gap={16}>
          <Title level={4} style={{ margin: 0 }}>
            {t("section.whatYouWillFind")}
          </Title>
          <Divider style={{ margin: 0 }} />
          <List
            dataSource={typedKeys}
            grid={{ gutter: 16, xs: 1, sm: 1, md: 3 }}
            renderItem={(key) => (
              <List.Item key={key}>
                <Flex vertical gap={8}>
                  <Title level={5} style={{ margin: 0 }}>
                    {t(`highlights.${key}.title`)}
                  </Title>
                  <Text type="secondary">
                    {t(`highlights.${key}.description`)}
                  </Text>
                </Flex>
              </List.Item>
            )}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

export default HomePage;
