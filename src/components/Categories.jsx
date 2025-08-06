import axios from "axios"
import { useEffect, useState } from "react"
import React from "react"

const Categories = () => {
  const [categories, setCategories] = useState("")
  const [categoriesDescription, setCategoriesDescription] = useState("")
  const [categoriesData, setCategoriesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modiferCategorie, setModifierCategorie] = useState(null)

  const AfficherCategorie = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/categorie/obtenir', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      })
      setCategoriesData(response.data.categories)
    } catch (error) {
      console.error("Erreur récupération catégories :", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    AfficherCategorie()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('pos-token')
    if (!token) {
      alert("Token manquant, veuillez vous reconnecter.")
      return
    }

    try {
      let response

      if (modiferCategorie) {
        // Modification
        response = await axios.put(
          `http://localhost:3000/api/categorie/${modiferCategorie}`,
          { categories, categoriesDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          alert("Catégorie modifiée avec succès")
          setModifierCategorie(null)
        } else {
          alert("Erreur lors de la modification")
        }

      } else {
        // Ajout
        response = await axios.post(
          'http://localhost:3000/api/categorie/ajout',
          { categories, categoriesDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          alert("Catégorie ajoutée avec succès")
        } else {
          alert("Erreur lors de l'ajout")
        }
      }

      setCategories("")
      setCategoriesDescription("")
      AfficherCategorie()

    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error)
      alert("Erreur, veuillez réessayer")
    }
  }

  const handleEdit = (categorie) => {
    setModifierCategorie(categorie._id)
    setCategories(categorie.categories)
    setCategoriesDescription(categorie.categoriesDescription)
  }

  const handleCancel = () => {
    setModifierCategorie(null)
    setCategories("")
    setCategoriesDescription("")
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette fournisseur ?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('pos-token')
      if (!token) {
        alert("Token manquant, veuillez vous reconnecter.")
        return
      }

      const response = await axios.delete(`http://localhost:3000/api/categorie/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        alert("Fournisseur supprimée avec succès")
        AfficherCategorie()
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
              {modiferCategorie ? "Modifier Catégorie" : "Ajouter Catégorie"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="m-3">
                <input
                  type="text"
                  placeholder='Nom de la catégorie'
                  className='border w-full p-2 rounded-md'
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                />
              </div>
              <div className="m-3">
                <input
                  type="text"
                  placeholder='Description'
                  className='border w-full p-2 rounded-md'
                  value={categoriesDescription}
                  onChange={(e) => setCategoriesDescription(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 hover:bg-green-600"
                >
                  {modiferCategorie ? "Enregistrer les modifications" : "Ajouter catégorie"}
                </button>
                {modiferCategorie && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center font-bold text-lg mb-4">Liste des Catégories</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">#</th>
                  <th className="border border-gray-200 p-2">Nom</th>
                  <th className="border border-gray-200 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.map((categorie, index) => (
                  <tr key={categorie._id}>
                    <td className="border border-gray-200 p-2">{index + 1}</td>
                    <td className="border border-gray-200 p-2">{categorie.categories}</td>
                    <td className="border border-gray-200 p-2 space-x-2">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        onClick={() => handleEdit(categorie)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(categorie._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Categories
