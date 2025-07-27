import { Layout, Typography, Card } from "antd";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Typography.Title level={3}>Demo Ant Design Dashboard</Typography.Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <Card title="Statistika / Card">Placeholder obsah</Card>
      </Content>
    </Layout>
  );
};

export default App;
