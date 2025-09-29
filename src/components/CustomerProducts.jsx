/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtreProduit, setFiltreProduit] = useState([]);
  const [ouvrirModal, setOuvrirModal] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
    client: {
      name: "",
      address: "",
      telephone: ""
    }
  });

  // Recherche par nom
  const Recherche = (e) => {
    setFiltreProduit(
      products.filter(product =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  // Filtre par catégorie
  const RechercheCategorie = (e) => {
    const value = e.target.value;
    if (!value) {
      setFiltreProduit(products);
      return;
    }
    setFiltreProduit(
      products.filter(product => product.categoryId?._id === value)
    );
  };

  // Affichage des produits depuis API
  const AfficherProduits = async () => {
    
    try {
      const response = await axios.get(
        "http://localhost:3000/api/produits/obtenir",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.categories || []);
        setProducts(response.data.products || []);
        setFiltreProduit(response.data.products || []);
      }
    } catch (error) {
      console.error("Erreur récupération produits:", error);
    }
  };

  const handleOrderChange = (product) => {
  setOrderData((prev) => ({
    ...prev, // garde tout ce qui existe déjà
    productId: product._id,
    quantity: 1,
    total: product.price,
    stock: product.stock,
    price: product.price,
    // si prev.client est défini on le garde, sinon on met un objet vide
    client: prev.client || { name: "", address: "", telephone: "" }
  }));
  setOuvrirModal(true);
};


  // Fermeture du modal
  const closeModal = () => {
    setOuvrirModal(false);
  };

  // Changement dans le modal

const increaseQuantity = (e) => {
  if(e.target.value > orderData.stock) {
    alert("Not enought stock")
  } else {
    setOrderData((prev) => ({
      ...prev,
      quantity: parseInt(e.target.value),
      total: parseInt(e.target.value) * parseInt(orderData.price)
      }
    ))
  }
}
const handleClientChange = (e) => {
  const { name, value } = e.target;

  setOrderData((prev) => ({
    ...prev,
    client: {
      ...prev.client,
      [name]: value   // met à jour uniquement le champ modifié
    }
  }));
};

  // Soumission du formulaire du modal
  const handleSubmit = async(e) => {
    e.preventDefault();
    try
    {
      const response = await axios.post("http://localhost:3000/api/commandes/ajout",orderData, {
        headers: {
          Authorization : `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if(response.data.success){
        toast.success("Commande ajouté avec succés")
        setOuvrirModal(false);
        setOrderData({
          productId: "",
          quantity: 1,
          stock: 0,
          total: 0,
          price: 0,
          client: {
          name: "",
          address: "",
          telephone: ""
  }
        });
      

      }

    }
    // Ici, tu peux appeler ton API pour enregistrer la commande
    catch(error){
      toast.error("Erreur" + error)
    }
  };

  useEffect(() => {
    AfficherProduits();
  }, []);

  return (
    <div>
      <div className="py-4 px-6">
        <h2 className='font-bold text-xl'>Produits</h2>
      </div>

      {/* Filtre et recherche */}
      <div className="py-4 px-6 flex justify-between items-center">
        <div>
          <select
            name="category"
            className="bg-white border p-1 rounded"
            onChange={RechercheCategorie}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.categories}</option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder='Search'
            className='border p-1 bg-white rounded px-4'
            onChange={Recherche}
          />
        </div>
      </div>

      {/* Tableau produits */}
      <div>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S No</th>
              <th className="border border-gray-300 p-2">Nom Produit</th>
              <th className="border border-gray-300 p-2">Catégorie</th>
              <th className="border border-gray-300 p-2">Prix</th>
              <th className="border border-gray-300 p-2">Stock</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtreProduit.length > 0 ? filtreProduit.map((product, index) => (
              <tr key={product._id}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.categoryId?.categories}</td>
                <td className="border border-gray-300 p-2">{product.price} xof</td>
                <td className="border border-gray-300 p-2">
                  <span className="px-2 py-1 rounded-full font-semibold">
                    {product.stock === 0 ? (
                      <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">{product.stock}</span>
                    ) : product.stock < 5 ? (
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">{product.stock}</span>
                    ) : (
                      <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>
                    )}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleOrderChange(product)}
                    className='px-2 py-1 bg-green-500 hover:bg-green-700 text-white rounded cursor-pointer'
                  >
                    Commander
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center p-4">No records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {ouvrirModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-20">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-lg font-bold">Ajouter Produit</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              type="button"
              onClick={closeModal}
            >
              X
            </button>

            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <input type="text" 
              name='name'
              placeholder='Nom du client'
              value={orderData.client.name}
              onChange={handleClientChange}
              className='border p-1 bg-white rounded px-4'
              />
              <input type="text" 
              name='address'
              placeholder='Adresse du client'
              value={orderData.client.address}
              onChange={handleClientChange}
              className='border p-1 bg-white rounded px-4'
              />

              <input type="text" 
              name='telephone'
              placeholder='telephone du client'
              value={orderData.client.telephone}
              onChange={handleClientChange}
              className='border p-1 bg-white rounded px-4'
              />
              <input
                type="number"
                name="quantity"
                placeholder="Augmenter la quantité"
                className="border p-1 bg-white rounded px-4"
                value={orderData.quantity}
                onChange={increaseQuantity}
                min="1"
              />
                <p>{orderData.quantity * orderData.price}</p>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer"
                >
                  Enregister la modification
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full mt-2 bg-red-500 text-white rounded cursor-pointer p-3"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
