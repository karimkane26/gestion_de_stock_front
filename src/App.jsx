import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Root from './utils/Root';
import Login from './pages/Login';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import Categories from './components/Categories';
import Fournisseurs from './components/Fournisseurs';
import Products from './components/Products';
import Logout from './components/Logout';
import Users from './components/Users';
import CustomerProducts from './components/CustomerProducts';
function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Root />} />
        <Route
        path="/admin-dashboard" 
        element={
        <ProtectedRoutes requireRole={["admin"]}>
          <Dashboard />
        </ProtectedRoutes>}
        >
          <Route
           index
           element={<h1>Résumé du  Tableau de bord</h1>}
          />

          <Route
           path='categories'
           element={<Categories />}
          />
           <Route
           path='produits'
           element={<Products />}
          />

           <Route
           path='fournisseurs'
           element={<Fournisseurs />}
          />

          <Route
           path='commandes'
           element={<h1>Commandes</h1>}
          />


           <Route
           path='Utilisateurs'
           element={<Users />}
          />

            <Route
           path='profile'
           element={<h1>Profil</h1>}
          />
        </Route>
        <Route path='logout' element={<Logout />} />


        <Route path="/customer-dashboard" element={<Dashboard />}>
        <Route index element={<CustomerProducts />} />
        </Route>
        <Route path='/login' element={<Login />}/>
        <Route path='unauthorized' element={<p className='font-bold text-3xl ml-20'>Unauthorized</p>}/>
      </Routes>
    </Router>
  )
}

export default App