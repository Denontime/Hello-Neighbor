import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Login } from './pages/Login';
import { Board } from './pages/Board';
import { Governance } from './pages/Governance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route path="boards/:boardId" element={<Board />} />
          <Route path="governance" element={<Governance />} />
          <Route index element={<Navigate to="/app/boards/DINNER" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
