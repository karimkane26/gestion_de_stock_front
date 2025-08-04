import axios from 'axios';
import React, { useState } from 'react'

export default function Fournisseurs() {
  // const [fournisseurs,setFournisseur] = useState(null);
  const [ajoutModifModal, setAjoutModifModal] = useState(null);
  const[formData, setFormData ] = useState({
    nom: "",
    email: "",
    number: "",
    addresse: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/fournisseurs/ajout",formData,
        {
          headers: {
            Authorization : `Bearer ${localStorage.getItem('pos-token')}`,
          }
        }
      );
      if(response.data.success){
        setAjoutModifModal(null)
        alert("Fournisseur  ajouté avec succés")
      }
      else{
        console.error("Erreur d'ajout de fournisseur",response.data.error);
      }
    } catch (error) {
      console.error("Erreur d'ajout de fournisseur",error);
      alert('Erreur d\'ajout de fournisseur . Veuillez ressaiser')      
    }



  }
  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
      <h1 className="text-2xl font-bold">Management des fournisseurs</h1>
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Rechercher"  className='border p-1 bg-white rounded px-4'/>
        <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer' onClick={() => setAjoutModifModal(1)}>Ajouter Fournisseur</button>

        {ajoutModifModal && ( 
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1>Ajouter Fournisseur</h1>
            <form action="" className='flex flex-col gap-4 mt-4'>
              <button className=' absolute flex top-4 right-4 font-bold text-lg cursor-pointer'  onClick={() => setAjoutModifModal(null)} >X</button>
              <input type="text"
               placeholder='Nom Fournisseur' 
              className='border p-1 bg-white rounded px-4'
              value={formData.nom}
              onChange={handleChange}
              name='nom'
               />
              <input type="email"
               placeholder='Email  Fournisseur'
               className='border p-1 bg-white rounded px-4'
               value={formData.email}
               onChange={handleChange}
               name='email' 
               />
              <input type="number"
               placeholder='Telephone  Fournisseur'
               className='border p-1 bg-white rounded px-4'
               value={formData.number}
               onChange={handleChange}
               name='number'
                />
              <input type="text" 
              placeholder='Addresse  Fournisseur'
               className='border p-1 bg-white rounded px-4'
               value={formData.addresse}
               onChange={handleChange}
               name='addresse'
                />
              <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer' onClick={handleSubmit}>Ajouter Fournisseur</button>
            </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
