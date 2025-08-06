import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Await } from 'react-router';

export default function Fournisseurs() {
  const [loading,setLoading] = useState(false);
  const [fournisseurs,setFournisseur] = useState([]);
  const [ajoutModifModal, setAjoutModifModal] = useState(false);
  const [Modifournisseur, setModifournisseur] = useState(null);
  const [filtreFournisseur,setFiltreFournisseur] = useState([]);
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

  const AfficherFournisseur = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/fournisseurs/recupfournisseur', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      console.log("Résultat:", response.data);
      setFournisseur(response.data.fournisseurs || []);
      setFiltreFournisseur(response.data.fournisseurs)
    } catch (error) {
      console.error("Erreur récupération fournisseurs:", error);
    } finally {
      setLoading(false);
    }
  };
 const handleSubmit = async (e) => { 
  e.preventDefault();

  if (Modifournisseur) {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/fournisseurs/${Modifournisseur}`,
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
        nom: "",
        email: "",
        number: "",
        addresse: "",
      });
      setAjoutModifModal(false);
      setModifournisseur(null); // 🆗 réinitialisation
      AfficherFournisseur();
    } else {
      alert("Échec de la modification du fournisseur");
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
        "http://localhost:3000/api/fournisseurs/ajout",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        setFormData({
          nom: "",
          email: "",
          number: "",
          addresse: "",
        });
        setAjoutModifModal(false);
        alert("Fournisseur ajouté avec succès");
        AfficherFournisseur(); // 🆕 Met à jour la liste
      } else {
        console.error("Erreur d'ajout", response.data.error);
      }
    } catch (error) {
      console.error("Erreur d'ajout", error);
      if (error.code === 11000) {
        alert("Un fournisseur avec cet email existe déjà.");
      } else {
        alert("Erreur d'ajout. Veuillez réessayer.");
      }
    }
  }
};

  const closeModal = () => {
    setAjoutModifModal(false);
    setFormData({
      nom: '',
      email: '',
      number: '',
      addresse: '',
    });
    setModifournisseur(null)
  }
  // const handleCancel = async(e)
  const modification = (fournisseur) => {
    setFormData({
      nom: fournisseur.nom,
      email: fournisseur.email,
      number: fournisseur.number,
      addresse: fournisseur.addresse,
    });
    setAjoutModifModal(true);
    setModifournisseur(fournisseur._id);
    console.log("ID fournisseur à modifier :", fournisseur._id);

  }

  const Suppression = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('pos-token');
      if(!token){
        alert("Token manquant ou non défini")
      }
      const supprimerFournisseur = await axios.delete(`http://localhost:3000/api/fournisseurs/${id}`,{
        headers : {
        Authorization: `Bearer ${token}`
      }
      }
        
      );
      if (supprimerFournisseur.data.success) {
        alert("Fournisseur supprimée avec succès")
        AfficherFournisseur()
      } else {
        alert("Erreur lors de la suppression")
      }
      
    } catch (error) {
       console.error("Erreur de suppression :", error)
      alert("Erreur de suppression, veuillez réessayer")
    }
  }

  const Recherche = (e) => {
    setFiltreFournisseur(
      fournisseurs.filter((fournisseur)=>(
        fournisseur.nom.toLowerCase().includes(e.target.value.toLowerCase()) 
      ) )
    )
  }
  useEffect(()=> {
    AfficherFournisseur();
  },[])
  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
      <h1 className="text-2xl font-bold">Management des fournisseurs</h1>
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Rechercher" onChange={Recherche}  className='border p-1 bg-white rounded px-4'/>
        <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'  onClick={() => setAjoutModifModal(true)}>Ajouter Fournisseur</button>
      </div>
        
        {ajoutModifModal && ( 
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1>Ajouter Fournisseur</h1>
              <button className=' absolute flex top-4 right-4 font-bold text-lg cursor-pointer' type="button"   onClick={closeModal} >X</button>

            <form className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
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
              {/* <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer' onClick={handleSubmit}>Ajouter Fournisseur</button> */}

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 hover:bg-green-600"
                >
                  {Modifournisseur ? "Enregistrer les modifications" : "Ajouter Fournisseur"}
                </button>
                {Modifournisseur && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 hover:bg-red-600"
                    onClick={closeModal}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
            </div>
          </div>
        )}

        {loading ? <div>Loading </div> :
        (<div>
             <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">S No</th>
                  <th className="border border-gray-300 p-2">Nom du Fournisseur</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Telphone</th>
                  <th className="border border-gray-300 p-2">Adresse</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtreFournisseur.map((fournisseur,index) => (
                  <tr key={fournisseur._id}>
                    <td className="border border-gray-300 p-2">{index+1}</td>
                    <td className="border border-gray-300 p-2">{fournisseur.nom}</td>
                    <td className="border border-gray-300 p-2">{fournisseur.email}</td>
                    <td className="border border-gray-300 p-2">{fournisseur.number}</td>
                    <td className="border border-gray-300 p-2">{fournisseur.addresse}</td>
                    <td className="border border-gray-300 p-2">
                      <button className='px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer mr-2' onClick={() => modification(fournisseur)}>Modifier</button>
                      <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer' onClick={() => Suppression(fournisseur._id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtreFournisseur.length === 0 && <div>Pas de données </div>}
            </div>
        )
        }
    </div>
  )
}

