import React, { useEffect, useState } from 'react';
import {
  FaCog,
  FaShoppingCart,
  FaSignOutAlt,
  FaTable,
  FaTruck,
  FaHome,
   
} from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { LiaSellsy } from "react-icons/lia";
const Barre_lateral = () => {
  const menuItems = [
    { id: 1, name: 'Tableau de bord', path: '/admin-dashboard', icon: <FaHome />,isParent: true },
    { id: 2, name: 'Catégories', path: '/admin-dashboard/categories', icon: <FaTable />,isParent: false },
    { id: 4, name: 'Fournisseur', path: '/admin-dashboard/fournisseurs', icon: <FaTruck />,isParent: false },
    { id: 6, name: 'Utilisateurs', path: '/admin-dashboard/utilisateurs', icon: <FaUsers />, isParent: false },
    { id: 7, name: 'Produits', path: '/admin-dashboard/produits', icon: <FaTable />,isParent: false },
    { id: 8, name: 'Commandes', path: '/admin-dashboard/commandes', icon: <FaShoppingCart />, isParent: false },
    { id: 11, name: 'Ventes', path: '/admin-dashboard/ventes', icon: <LiaSellsy />, isParent: false },
    { id: 9, name: 'Profil', path: '/admin-dashboard/profile', icon: <FaCog />, isParent: false},
    { id: 10, name: 'Déconnexion', path: '/admin-dashboard/logout', icon: <FaSignOutAlt />, isParent: false }, 
  ];
 
  const customerItems = [
    { id: 11, name: 'Produits', path: '/customer-dashboard', icon: <FaTable />,isParent: true },
       { id: 12, name: 'Commandes', path: '/customer-dashboard/commandes', icon: <FaShoppingCart />, isParent: false },
    { id: 13, name: 'Profil', path: '/customer-dashboard/profile', icon: <FaCog />, isParent: false},
    { id: 14, name: 'Déconnexion', path: '/customer-dashboard/logout', icon: <FaSignOutAlt />, isParent: false }, 
  ]
  const {user} = useAuth();
  const[menuLinks, setMenuLinks] = useState(customerItems);  
  useEffect(()=> {
    if(user && user.role === "admin"){
      setMenuLinks(menuItems)
    }
  },[])
  return (
    <div className="flex flex-col h-screen p-3 bg-black text-white w-16 md:w-60 shadow-lg fixed">
      <div className="h-16 flex justify-center items-center">
        <span className="hidden md:block text-lg font-bold">Inventaire MS</span>
        <span className="md:hidden text-lg font-bold">IMS</span>
      </div>

      <div className="flex-1 mt-4">
        <ul className="space-y-1 p-1">
          {menuLinks.map((items) => (
            <li key={items.id}>
              <NavLink
              end={items.isParent}
                to={items.path}
                className={({ isActive }) =>
                  (isActive ? 'bg-gray-700 ' : '') +
                  'flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200'
                }
              >
                <span className="text-xl">{items.icon}</span>
                <span className="hidden md:block ml-4">{items.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Barre_lateral;
