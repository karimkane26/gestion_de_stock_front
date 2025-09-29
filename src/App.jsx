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
import Orders from './components/Orders';
import Profile from './components/Profile';
import Sommaire from './components/Sommaire';
import FactureList from './components/FactureList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router >
        <ToastContainer />
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
           element={<Sommaire />}
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
           element={<Orders />}
          />


           <Route
           path='Utilisateurs'
           element={<Users />}
          />
         <Route path='ventes' element={<FactureList  />}/>

         <Route path='profile' element={<Profile  />}/>

        <Route path='logout' element={<Logout />} />

        </Route>


        <Route path="/customer-dashboard" element={<Dashboard />}>
        <Route index element={<CustomerProducts />} />
        <Route path='commandes' element={<Orders />}></Route>
        <Route path='profile' element={<Profile  />}/>
        <Route path='logout' element={<Logout />} />
        </Route>
        <Route path='/login' element={<Login />}/>
        <Route path='unauthorized' element={<p className='font-bold text-3xl ml-20'>Unauthorized</p>}/>
      </Routes>
    </Router>
  )
}

export default App