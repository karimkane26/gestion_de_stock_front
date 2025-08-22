import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Products = () => {
  const [ouvrirModal,setouvrirModal] = useState(false)
  const [categories,setCategories] = useState([])
  const [fournisseurs,setFournisseurs] = useState([])
  
  const AfficherProduits = async() => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/obtenir', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      console.log("Résultat:", response.data);
      setFournisseurs(response.data.fournisseurs || []);
      setCategories(response.data.categories || []);

    } catch (error) {
      console.error("Erreur récupération fournisseurs:", error);
    } 
  }

  useEffect(() => {
    AfficherProduits();
  },[])
  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
      <h1 className="text-2xl  font-bold">Gestion de produits</h1>
      <div className="flex justify-between items-center">
        <input
         type="text"
         placeholder='Search'
         className='border p-1 rounded px-4'
         />
        <button 
        className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer' onClick={() => {setouvrirModal(true)}}>
           
           Ajouter Produit
        </button>
      </div>
      

      {/* Modal */}
        {ouvrirModal && ( 
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1>Ajouter Fournisseur</h1>
              <button className=' absolute flex top-4 right-4 font-bold text-lg cursor-pointer' type="button"   onClick={() => setouvrirModal(false)} >
                X
                </button>

            <form className='flex flex-col gap-4 mt-4'>
              <input type="text"
               placeholder='Nom du produit' 
              className='border p-1 bg-white rounded px-4'
              // value={formData.nom}
              // onChange={handleChange}
              name='name'
               />
              <input type="text"
               placeholder='description'
               className='border p-1 bg-white rounded px-4'
              //  value={formData.email}
              //  onChange={handleChange}
               name='description' 
               />
              <input type="number"
               placeholder='Prix'
               className='border p-1 bg-white rounded px-4'
              //  value={formData.number}
              //  onChange={handleChange}
               name='price'
                />
              <input type="number" 
              placeholder='stock'
               className='border p-1 bg-white rounded px-4'
              //  value={formData.addresse}
              //  onChange={handleChange}
               name='stock'
                />
              {/* <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer' onClick={handleSubmit}>Ajouter Fournisseur</button> */}
            <div className='w-full'>
              <select name="fournisseur" id=" "className='w-full border p-2'>
                <option value="">selection Fournisseur</option>
                {fournisseurs && fournisseurs.map((fournisseur)=> (
                  <option key={fournisseur._id} value={fournisseur._id}>
                      {fournisseur.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <select name="category" id="" className='w-full border p-2'>
                <option value="">select Catégorie</option>
                {categories && categories.map((categorie)=> (
                  <option key={categorie._id} value={categorie._id}>
                      {categorie.categories}
                  </option>
                ))}
              </select>
            </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className='w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer'
                  onClick={() => setouvrirModal(false)}
                >
                  Ajouter Produit
                </button>
                
                  <button 
  className='w-full mt-2 bg-red-500 text-white rounded cursor-pointer'
> 
  Annuler
</button>

              </div>
            </form>
            </div>
          </div>
        )}
    </div>
  )
}

export default Products
