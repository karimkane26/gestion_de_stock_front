import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [ouvrirModal, setouvrirModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [products,setProducts] = useState([])
  const [filtreProduit,setfiltreProduit] = useState([])
  const[ModifierProduit, setModiferProduit] = useState(null)
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

  const closeModal = () => {
    setouvrirModal(false)
    setModiferProduit(null)
    setFormData({
      name:"",
       stock:"" ,
          price: "",
          description: "",
          categoryId: "",
          fournisseurId: "",
    })
  }
   const modification = (product) => {
    setFormData({
      name: product.name,
          stock: product.stock,
          price: product.price,
          description: product.description,
          categoryId: product.categoryId._id,
          fournisseurId: product.fournisseurId._id,
    });
    setouvrirModal(true);
    setModiferProduit(product._id);
    console.log("ID fournisseur à modifier :", product._id);

  }
 
   const Suppression = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette produit ?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('pos-token');
      if(!token){
        alert("Token manquant ou non défini")
      }
      const supprimerProduit = await axios.delete(`http://localhost:3000/api/produits/${id}`,{
        headers : {
        Authorization: `Bearer ${token}`
      }
      }
        
      );
      if (supprimerProduit.data.success) {
        alert("Fournisseur supprimée avec succès")
        AfficherProduits()
      } else {
        alert("Erreur lors de la suppression")
      }
      
    } catch (error) {
       console.error("Erreur de suppression :", error)
      alert("Erreur de suppression, veuillez réessayer")
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
     if (ModifierProduit) {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/produits/${ModifierProduit}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      }
    );

    // ✅ on vérifie si la modification a réussi
    if (response.status === 200 || response.data) {
      alert("Fournisseur modifié avec succès");

      setFormData({
       name: "",
          stock: "",
          price: "",
          description: "",
          categoryId: "",
          fournisseurId: "",
      });
      setouvrirModal(false);
      setModiferProduit(null); // 🆗 réinitialisation
      AfficherProduits();
    } else {
      alert("Échec de la modification du produits");
      console.error("Réponse inattendue :", response);
    }
  } catch (error) {
    console.error("Erreur de modification :", error);
    alert("Erreur lors de la modification");
  }
}
else {
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
      setProducts(response.data.products || [])
      setfiltreProduit(response.data.products || [])
    } catch (error) {
      console.error("Erreur récupération fournisseurs:", error);
    }
  };

   const Recherche = (e) => {
    setfiltreProduit(
      products.filter((product)=>(
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) 
      ) )
    )
  }

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
        onChange={Recherche}
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
            onClick={closeModal}
          >
            X
          </button>

          {/* Formulaire */}
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
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
              min="0"
              name="stock"
              className="border p-1 bg-white rounded px-4"
              value={formData.stock}
              onChange={handleChange}
            />

            {/* Fournisseur */}
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

            {/* Catégorie */}
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

            {/* Boutons */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer"
              >
                {ModifierProduit ? "Enregister la modification" : " Ajouter Produit"}
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

    {/* ✅ Tableau placé DANS le div principal */}
    <table className="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2">S No</th>
          <th className="border border-gray-300 p-2">Nom Produit</th>
          <th className="border border-gray-300 p-2">Description</th>
          <th className="border border-gray-300 p-2">Prix</th>
          <th className="border border-gray-300 p-2">Stock</th>
          <th className="border border-gray-300 p-2">Catégorie</th>
          <th className="border border-gray-300 p-2">Fournisseur</th>
          <th className="border border-gray-300 p-2">Action</th>

          
        </tr>
      </thead>
      <tbody>
        {filtreProduit && filtreProduit.map((product, index) => (
          <tr key={product._id}>
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{product.name}</td>
            <td className="border border-gray-300 p-2">{product.description}</td>
            <td className="border border-gray-300 p-2">{product.price} €</td>
            <td className="border border-gray-300 p-2">
              <span className="px-2 py-1 rounded-full font-semibold">
              {product.stock === 0 ? (
                <span className="bg-red-100 text-red-500 px-2 py-1 rounded-full">{product.stock}</span>
              ):product.stock < 5 ? (
                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">{product.stock}</span>
              ): ( <span className="bg-green-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>)} 
              </span>
              </td>
            <td className="border border-gray-300 p-2">
              {product.categoryId.categories || "—"}
            </td>
            <td className="border border-gray-300 p-2">
              {product.fournisseurId?.nom || "—"}
            </td>
            <td className="border border-gray-300 p-2">
                      <button className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer mr-2' onClick={() => modification(product)}>Modifier</button>
                      <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer' onClick={() => Suppression(product._id)}>Supprimer</button>
                    </td>
          </tr>
        ))}
      </tbody>
    </table>
    {filtreProduit.length === 0 & <div> No records </div>}
  </div>
);

};

export default Products;
