import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
const Orders = () => {
  const[orders, setOrders] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [selectedOrder, setSelectedOrder] = useState(null); 
  // 📄 Fonction pour générer un PDF

 
const generatePDF = (order) => {
  const doc = new jsPDF();
  doc.text("Facture de commande", 14, 20);

  autoTable(doc, {
    head: [["Produit", "Catégorie", "Quantité", "Prix Total"]],
    body: [
      [
        order.product?.name || "N/A",
        order.product?.categoryId?.categories || "N/A",
        order.quantity || 0,
        (order.totalPrice || 0) + " FCFA",
      ],
    ],
    startY: 30,
  });

  const lastY = doc.lastAutoTable.finalY || 40; // sécurité si pas de table

  doc.text(`Client : ${order.client?.name || "N/A"}`, 14, lastY + 10);
  doc.text(
    `Date : ${new Date(order.orderDate).toLocaleDateString()}`,
    14,
    lastY + 20
  );

  doc.save(`facture-${order._id}.pdf`);
};

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
          <th className="border border-gray-300 p-2">Nom du client</th>
          <th className="border border-gray-300 p-2">Nom Produit</th>
          <th className="border border-gray-300 p-2">Nom Categorie </th>
          <th className="border border-gray-300 p-2">Quantité</th>
          <th className="border border-gray-300 p-2">Total Price</th>
          <th className="border border-gray-300 p-2">Date</th>
         <th>Action</th>
{/* cette partie je dois implementer modifier ,voir commande et telecharger facture */}
          
        </tr>
      </thead>
      <tbody>
        {orders && orders.map((order, index) => (
          <tr key={order._id}>
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{order.client.name}</td>

            <td className="border border-gray-300 p-2">{order.product.name}</td>
            <td className="border border-gray-300 p-2">{order.product.categoryId.categories}</td>
            <td className="border border-gray-300 p-2">{order.quantity} </td>
            <td className="border border-gray-300 p-2">{order.totalPrice} </td>
            <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()} </td>
              <td
                    className="border border-gray-300 p-2 cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    <FaEye className="mx-2" />
                  </td>
            
          </tr>
        ))}
      </tbody>
    </table>
    {orders.length === 0 && <div> No records </div>}
    </div>
      {/* ✅ Modal pour voir les détails */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-[500px]">
            <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>
            <p><b>Client :</b> {selectedOrder.client.name}</p>
            <p><b>Produit :</b> {selectedOrder.product.name}</p>
            <p><b>Catégorie :</b> {selectedOrder.product.categoryId.categories}</p>
            <p><b>Quantité :</b> {selectedOrder.quantity}</p>
            <p><b>Total :</b> {selectedOrder.totalPrice} FCFA</p>
            <p><b>Date :</b> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => generatePDF(selectedOrder)}
              >
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
   
  </div>
  )
}

export default Orders
