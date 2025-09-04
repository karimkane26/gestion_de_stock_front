import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Orders = () => {
  const[orders, setOrders] = useState([]);

   const AfficherCommande = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/commandes/recupcommande",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        console.log(response.data);
        
        if(response.data.success){
          setOrders(response.data.orders  );
        }
        else {
          console.error("Erreur d'afffichage produits", response.data.message);
          alert("Erreur D'affichage produits . Veuillez ressailler svp");
          
        }
      } catch (error) {
        console.error("Erreur récupération produits:", error);
      }
    };

    useEffect(() => {
      AfficherCommande()
    },[]);
  return (
     <div className="w-full h-full flex flex-col gap-4 p-4">
    <h1 className="text-2xl font-bold">Commande</h1>
    <div>
         <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2">S No</th>
          <th className="border border-gray-300 p-2">Nom Produit</th>
          <th className="border border-gray-300 p-2">Nom Categorie </th>
          <th className="border border-gray-300 p-2">Quantité</th>
          <th className="border border-gray-300 p-2">Total Price</th>
          <th className="border border-gray-300 p-2">Date</th>
         

          
        </tr>
      </thead>
      <tbody>
        {orders && orders.map((order, index) => (
          <tr key={order._id}>
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{order.product.name}</td>
            <td className="border border-gray-300 p-2">{order.product.categoryId.categories}</td>
            <td className="border border-gray-300 p-2">{order.quantity} </td>
            <td className="border border-gray-300 p-2">{order.totalPrice} </td>
            <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()} </td>

            
          </tr>
        ))}
      </tbody>
    </table>
    {orders.length === 0 && <div> No records </div>}
    </div>
    {/* ✅ Tableau placé DANS le div principal */}
   
  </div>
  )
}

export default Orders
