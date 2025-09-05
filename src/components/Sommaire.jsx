import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Sommaire = () => {

    const [dashboardData,setDashboardData] = useState({
        totalProducts : 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outOfStock: [],
        highestSaleProduct: null,
        lowStock: []
    })
    const [loading,setLoading] = useState(false)
    const AfficherOrderData =  async() => {

        try{
            setLoading(true)
            const response = await axios.get('http://localhost:3000/api/dashboard',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            setDashboardData(response.data.dashboardData)
        } catch(error){
            if(error){
                alert(error.message)
            }
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        AfficherOrderData();
    },[])

    if(loading){
        return <div>Loading ...</div>
    }
  return (
    <div className='p-5'>
      <h2 className="text-3xl font-bold">Tableau de bord</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6'>

        <div className='bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center'>
            <p>Total Produits</p>
            <p>{dashboardData.totalProducts}</p>
        </div>

              <div className='bg-green-500 text-white p-4  rounded-lg shadow-md flex flex-col items-center justify-center'>
            <p>Total Stock</p>
            <p>{dashboardData.totalStock}</p>
        </div>

          <div className='bg-yellow-500 text-white p-4  rounded-lg shadow-md flex flex-col items-center justify-center'>
            <p>commandes aujourd'hui</p>
            <p>{dashboardData.ordersToday}</p>
        </div>

          <div className='bg-purple-500 text-white p-4  rounded-lg shadow-md flex flex-col items-center justify-center'>
            <p>Revenue</p>
            <p>{dashboardData.revenue} XOF</p>
        </div>

      </div>
        
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className='text-xl front-semibold text-gray-800 '>
                Rupture de stock
                 </h3>
                 {dashboardData.outOfStock.length > 0 ? (
                    <ul className='space-y-2'>
                       {
                        dashboardData.outOfStock.map((product,index)=> (
                             <li key={index} className='text-gray-600'>{product.name} 
                        <span className='text-gray-400'>{product.category.name}</span>
                        </li>
                        ))
                       }
                    </ul>
                 ) : (
                    <p>Pas de ripture de stock</p>
                 )}
        </div>

         <div className="bg-white p-4 rounded-lg shadow-md">
  <h3 className='text-xl font-semibold text-gray-800'>
    Produits les plus vendus 
  </h3>

  {dashboardData.highestSaleProduct?.name ? (
    <div className='text-gray-600'>
      <p><strong>Nom :</strong> {dashboardData.highestSaleProduct.name}</p>
      <p><strong>Catégorie :</strong> {dashboardData.highestSaleProduct.category}</p>
      <p><strong>Total vendu :</strong> {dashboardData.highestSaleProduct.totalQuantity}</p>
    </div>
  ) : (
    <p className='text-gray-500'>
      {dashboardData.highestSaleProduct?.message || 'Aucune donnée disponible'}
    </p>
  )}
</div>


        <div className="bg-white p-4 rounded-lg shadow-md">
  <h3 className='text-xl font-semibold text-gray-800'>
    Produits en rupture de stock
  </h3>
  {dashboardData.lowStock.length > 0 ? (
    <ul className='space-y-2'>
      {dashboardData.lowStock.map((product, index) => (
        <li key={index} className='text-gray-600'>
          <strong>{product.name}</strong> - {product.stock} restant(s){" "}
          <span className='text-gray-400'>
            {product.categoryId?.categories}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className='text-gray-500'>Pas de produits en rupture de stock</p>
  )}
</div>

        
      </div>
    </div>
    
  )
}

export default Sommaire
