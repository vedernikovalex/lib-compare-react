import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Homepage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import KanbanPage from "./pages/KanbanPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
