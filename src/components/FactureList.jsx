/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

const   FactureList = () => {
  const [invoices, setInvoices] = useState([]);

  // Récupération de toutes les factures
  const fetchInvoices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/facture", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if(res.data.success){
        setInvoices(res.data.invoices);
      }
    } catch (error) {
      console.error("Erreur récupération factures :", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Téléchargement de la facture en PDF
  const downloadPDF = async (invoiceId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/invoices/${invoiceId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
          responseType: "blob", // important pour récupérer le PDF
        }
      );

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Facture_${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erreur téléchargement PDF : " + error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Liste des factures</h2>
      {invoices.length === 0 ? (
        <p>Aucune facture pour le moment.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID Facture</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Produit</th>
              <th className="border p-2">Quantité</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv._id}>
                <td className="border p-2">{inv._id}</td>
                <td className="border p-2">{inv.customer?.name}</td>
                <td className="border p-2">{inv.product?.name}</td>
                <td className="border p-2">{inv.quantity}</td>
                <td className="border p-2">{inv.total} €</td>
                <td className="border p-2">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => downloadPDF(inv._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FactureList;
