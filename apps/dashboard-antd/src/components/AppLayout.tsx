import { Layout, Menu, Typography } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslations } from "@shared/src/hooks/useTranslations";

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: "/", labelKey: "home" as const },
  { key: "/dashboard", labelKey: "dashboard" as const },
  { key: "/kanban", labelKey: "kanban" as const },
] as const;

const AppLayout = () => {
  const { t } = useTranslations("nav");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = NAV_ITEMS.map(({ key, labelKey }) => ({
    key,
    label: t(labelKey),
  }));

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          padding: "0 24px",
        }}
      >
        <Typography.Text
          strong
          style={{ color: "#fff", fontSize: 18, whiteSpace: "nowrap" }}
        >
          AntD App
        </Typography.Text>
        <nav aria-label="Main navigation" style={{ flex: 1 }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ flex: 1, border: "none" }}
          />
        </nav>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
