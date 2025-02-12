import { getWishListedProducts } from "@/api/apiProducts";
import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react"
import { Anchor, LucideHeartCrack } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const WishList = () => {

  const { isLoaded, user } = useUser()


  const { data: wishProductData, loading: wishProductLoading, error: wishProductError, fn: fnWishProduct } = useFetch(getWishListedProducts);
 const [paginatedProducts, setPaginatedProducts] = useState(null)



  useEffect(() => {
    window.scrollTo(0, 0);
    fnWishProduct();
  }, [isLoaded])

  if (!isLoaded || wishProductLoading) {
    return (<BarLoader className='z-10' width="100%" color='yellow' />)
  }


  if (wishProductData?.length === 0 || wishProductData === null) {
    return     <div className='text-center place-content-center h-[90vh]'>
    <div className='flex items-center justify-center mb-5'>
      <LucideHeartCrack size={80} color='yellow' strokeWidth={2} />
    </div>
    <p className='text-sm md:text-xl'>No Product In Wishlist</p>
  </div>
  }



  return (
    (wishProductData&&wishProductData.length>0) &&
    <>
      <div className="flex justify-center">
        <h1 className=' text-4xl mt-8 pt-8 mb-16 border-t uppercase'> My WishList</h1>
      </div>
      <div className='grid w-full xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>

        {paginatedProducts?.map((product) => {
          return <ProductCard className="sm:col-span-2" id={product.products?.id} name={product.products?.name} price={product.products?.price} image_url={product.products?.image_url} key={product.products?.name} stock_quantity={product.products?.stock_quantity} isWishInit={true} product={product?.products} ProductWishListed={fnWishProduct} />

        })

        }
      </div>
      <PaginationBar productsData={wishProductData}  setPaginatedProducts={setPaginatedProducts} itemsPerPage={12} />

    </>
  
  )
}

export default WishList
