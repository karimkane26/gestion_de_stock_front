import axios from "axios"
import { useEffect, useState } from "react"
import React from "react"

const  Users = () => {
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: ""
    })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtreUser,setFiltreUser] = useState([]);

  const Recherche = (e) => {
    setFiltreUser(
      users.filter((user)=>(
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) 
      ) )
    )
  }

  const AfficherUtilisateurs= async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      })
      setUsers(response.data.users)
      setFiltreUser(response.data.users) 
      setLoading(false)
    } catch (error) {
      console.error("Erreur récupération users :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    AfficherUtilisateurs()
  }, [])
const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData((prevData) =>(
        {
        ...prevData,
            [name] : value
    }
    ))
}
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('pos-token')
    if (!token) {
      alert("Token manquant, veuillez vous reconnecter.")
      return
    }

    try {

    //   if (modiferCategorie) {
    //     // Modification
    //     response = await axios.put(
    //       `http://localhost:3000/api/categorie/${modiferCategorie}`,
    //       { categories, categoriesDescription },
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     )

    //     if (response.data.success) {
    //       alert("Catégorie modifiée avec succès")
    //       setModifierCategorie(null)
          // AfficherUtilisateurs()
            
    //     } else {
    //       alert("Erreur lors de la modification")
    //     }

    //   } else {
        // Ajout
       const  response = await axios.post(
          'http://localhost:3000/api/users/ajout',
           formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          alert("Utilisateur ajoutée avec succès");
          setFormData({
            name:"",
            email:"",
            password:"",
            address:"",
            role:"",
          });
          AfficherUtilisateurs()
        } else {
          alert("Erreur lors de l'ajout",response.data);
          alert("Erreur ajout utilisateur , veuillez ressailler")
        }
      }
    //   AfficherCategorie()

 catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error)
      alert("Erreur, veuillez réessayer")
    }
  }

//   const handleEdit = (categorie) => {
//     setModifierCategorie(categorie._id)
//     setCategories(categorie.categories)
//     setCategoriesDescription(categorie.categoriesDescription)
//   }

//   const handleCancel = () => {
//     setModifierCategorie(null)
//     setCategories("")
//     setCategoriesDescription("")
//   }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette Utilisateur ?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('pos-token')
      if (!token) {
        alert("Token manquant, veuillez vous reconnecter.")
        return
      }

      const response = await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        alert("utilisateur  supprimée avec succès")
        AfficherUtilisateurs()
      } else {
        alert("Erreur lors de la suppression")
      }

    } catch (error) {
      console.error("Erreur de suppression :", error)
      alert("Erreur de suppression, veuillez réessayer")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-8'>Gestion de stock</h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className="lg:w-1/3">
          <div className='bg-white shadow-md rounded-lg p-4'>
            <h2 className='text-center text-xl font-bold mb-4'>
              {/* {modiferCategorie ? "Modifier Catégorie" : "Ajouter Catégorie"} */}Ajouter Utilisateur
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="m-3">
                <input
                  type="text"
                  placeholder="Nom de l'utilisateur"
                  className='border w-full p-2 rounded-md'
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="m-3">
                <input
                  type="email"
                  placeholder='email'
                  name="email"
                  className='border w-full p-2 rounded-md'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              

               <div className="m-3">
                <input
                  type="password"
                  placeholder='password'
                  name="password"
                  className='border w-full p-2 rounded-md'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

                  <div className="m-3">
                <input
                  type="text"
                  placeholder='address'
                  name="address"
                  className='border w-full p-2 rounded-md'
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

                <div className="m-3">
               <select name="role" id="" className="border w-full p-2 rounded-md" onChange={handleChange} value={formData.role}>
                <option value="">Choix du role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
               </select>
              </div>




              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 hover:bg-green-600"
                >
                  {/* {modiferCategorie ? "Enregistrer les modifications" : "Ajouter catégorie"} */}
                  Ajouter Utilisateur
                </button>
                {/* {modiferCategorie && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                )} */}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
        <input type="search" placeholder="Search" id="" className="p-2 bg-white w-full mb-4 rounded" onChange={Recherche}/>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">S No</th>
                  <th className="border border-gray-200 p-2">Nom</th>
                  <th className="border border-gray-200 p-2">Email</th>
                  <th className="border border-gray-200 p-2">Adrese</th>
                 <th className="border border-gray-200 p-2">Role</th>

                </tr>
              </thead>
              <tbody>
                {filtreUser && filtreUser.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border border-gray-200 p-2">{index + 1}</td>
                    <td className="border border-gray-200 p-2">{user.name}</td>
                    <td className="border border-gray-200 p-2">{user.email}</td>
                    <td className="border border-gray-200 p-2">{user.address}</td>
                    <td className="border border-gray-200 p-2">{user.role}</td>


                    <td className="border border-gray-200 p-2 space-x-2">
                      {/* <button
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleEdit(categorie)}
                      >
                        Modifier
                      </button> */}
                      <button
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(user._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtreUser.length === 0 && <div>Pas de données </div>}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Users
