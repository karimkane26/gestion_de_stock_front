import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Profile = () => {
    const [user,setUser] = useState({
        name: "",
        email: "",
        address: "",
        // password : ""
    })

    const [modifier,setModifier] = useState(false)
    const AfficherUtilisateur = async() => {
        try{
            const response = await axios.get("http://localhost:3000/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                }
            });

            if(response.data.success){
                setUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    address: response.data.user.address,
                    
                })
              
            }
           
        }

        catch(error){
            console.error("Erreur d'affichage utilisateur",error)
            alert("Erreur d'affichage utilisateur, veuillez resaillez")
        }
    }
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(
      "http://localhost:3000/api/users/profile",
      user,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      }
    );

    if (response.data.success) {
      alert("Profil modifié avec succès");
    console.log(response.data);
    
      setModifier(false);
    
    } else {
      alert("Échec de mise à jour");
    }
  } catch (error) {
    console.error("Échec de mise à jour :", error);
    alert("Échec de mise à jour. Veuillez réessayer svp");
  }
};

    useEffect(() => {
        AfficherUtilisateur()
    },[])
  return (
    <div>
      <h2>Profile Utilisateur</h2>
      <form action="" className='bg-white p-6 rounded-lg shadow max-w-md' onSubmit={handleSubmit} >
        <div className='mb-4 mt-4'>
            <label htmlFor="Nom" className='block text-sm font-medium text-gray-700 mb-1'>Nom</label>
                  <input 
                    type="text" 
                    id='username'
                    name='name' 
                    value={user.name}
                    disabled={!modifier}
                    onChange={(e) => setUser({...user,name: e.target.value })}
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50' />
        </div>
        <div className='mb-4 mt-4'>
            <label htmlFor="Email" className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input type="email"
                 id='email' 
                 name='email'
                value={user.email}
                disabled={!modifier}
                onChange={(e) => setUser({...user,email: e.target.value })}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50'/>
        </div>
      

        <div className='mb-4 mt-4'>
            <label htmlFor="adresse" className='block text-sm font-medium text-gray-700 mb-1'>Adresse</label>
            <input type="text"
             id='address'
             name='address' 
            value={user.address}
            disabled={!modifier}
            onChange={(e) => setUser({...user,address: e.target.value })}
             className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50' />
        </div>
        {
            modifier &&(
                 <div className='mb-4 mt-4'>
            <label htmlFor="password" 
            className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input type="password" id='password' name='password' className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-50' placeholder='Entrer un nouveau password'
             value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}/>

        </div>
            )
        }
         

         {!modifier ? (
             <button 
        type='button'
            onClick={() => setModifier(!modifier)}
            disabled={modifier}
         className='bg-yellow-600 rounded-md text-white px-4 py-2 hover:bg-yellow-700 disabled:bg-yellow-300 cursor-pointer'>
            Modifier Profile
            </button>
         ):
         (
            <>
            <button type='submit'className='bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 cursor-pointer'>Enregistrer les modifications</button>
            <button type='button' className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2 cursor-pointer' onClick={()=> setModifier(!modifier)}>Cancel</button>
            </> 
         )
         }
       
      </form>
    </div>
  )
}

export default Profile
