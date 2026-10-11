import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, isStore, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/items" className="navbar-brand">
        SaveBite
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>
            <Link to="/items">Items</Link>
            {isStore && <Link to="/dashboard">Dashboard</Link>}
            <button type="button" className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
