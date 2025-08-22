import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [ouvrirModal, setouvrirModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    description: "",
    categoryId: "",
    fournisseurId: "",
  });

  // Gérer les changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/produits/ajout",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setFormData({
          name: "",
          stock: "",
          price: "",
          description: "",
          categoryId: "",
          fournisseurId: "",
        });
        setouvrirModal(false);
        alert("✅ Produit ajouté avec succès");
        AfficherProduits(); // Mise à jour de la liste
      } else {
        console.error("Erreur d'ajout", response.data.error);
      }
    } catch (error) {
      console.error("Erreur d'ajout", error);
      alert("Erreur d'ajout. Veuillez réessayer.");
    }
  };

  // Charger fournisseurs + catégories
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
      console.log("Résultat:", response.data);
      setFournisseurs(response.data.fournisseurs || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Erreur récupération fournisseurs:", error);
    }
  };

  useEffect(() => {
    AfficherProduits();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Gestion de produits</h1>

      {/* Barre de recherche + bouton */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-1 rounded px-4"
        />
        <button
          className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer"
          onClick={() => setouvrirModal(true)}
        >
          Ajouter Produit
        </button>
      </div>

      {/* Modal */}
      {ouvrirModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-lg font-bold">Ajouter Produit</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              type="button"
              onClick={() => setouvrirModal(false)}
            >
              X
            </button>

            <form
              className="flex flex-col gap-4 mt-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Nom du produit"
                className="border p-1 bg-white rounded px-4"
                value={formData.name}
                onChange={handleChange}
                name="name"
              />

              <input
                type="text"
                placeholder="Description"
                className="border p-1 bg-white rounded px-4"
                value={formData.description}
                onChange={handleChange}
                name="description"
              />

              <input
                type="number"
                placeholder="Prix"
                className="border p-1 bg-white rounded px-4"
                value={formData.price}
                onChange={handleChange}
                name="price"
              />

              <input
                type="number"
                placeholder="Stock"
                className="border p-1 bg-white rounded px-4"
                value={formData.stock}
                onChange={handleChange}
                name="stock"
              />

              {/* Sélection fournisseur */}
              <div className="w-full">
                <select
                  name="fournisseurId"
                  className="w-full border p-2"
                  value={formData.fournisseurId}
                  onChange={handleChange}
                >
                  <option value="">Sélection Fournisseur</option>
                  {fournisseurs.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection catégorie */}
              <div className="w-full">
                <select
                  name="categoryId"
                  className="w-full border p-2"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Sélection Catégorie</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categories}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer"
                >
                  Ajouter Produit
                </button>

                <button
                  type="button"
                  onClick={() => setouvrirModal(false)}
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

export default Products;
