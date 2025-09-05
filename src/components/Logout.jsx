// import React from 'react'
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
// const Logout = () => {
//     const navigate = useNavigate()
//     const {logout} = useAuth();
//     logout();
//     navigate('/login')
// };

// export default Logout;
import React from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // vide le contexte + localStorage
    window.location.href = '/login'; // redirection immédiate
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Déconnexion
    </button>
  );
};

export default LogoutButton;
