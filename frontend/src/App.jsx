import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Items from './pages/Items.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddItem from './pages/AddItem.jsx';
import EditItem from './pages/EditItem.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="store">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/items/new"
            element={
              <ProtectedRoute allowedRole="store">
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/items/:id/edit"
            element={
              <ProtectedRoute allowedRole="store">
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
