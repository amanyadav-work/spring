import { getSellerProducts } from "@/api/apiProducts";
import ProductCard from "@/components/ProductCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Anchor, HouseIcon } from "lucide-react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import PaginationBar from "@/components/PaginationBar";

const MyProducts = () => {
  const { user, isLoaded } = useUser()
  const { data: productsData, loading: productsLoading, error: productsError, fn: fnProducts } = useFetch(getSellerProducts);
    const [paginatedProducts, setPaginatedProducts] = useState(null)

  useEffect(() => {

    if (isLoaded) {
      fnProducts(user.id)
    }
  }, [isLoaded])



  const deleteDone = () => {
    fnProducts(user.id)
    toast("Product Successfully Deleted", {
    });
  }
  if (!isLoaded || productsLoading) {
    return (<BarLoader className='z-10' width="100%" color='yellow' />)
  }
  if (productsData?.length === 0 ) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <Anchor size={80} color='yellow' strokeWidth={3} />
      </div>
      <p className='text-sm md:text-xl'>No products found </p>

    </div>
  }
  return (
    productsData && <>
      <div className="flex justify-center">
        <h1 className='text-4xl mt-8 pt-8 mb-16 border-t uppercase'>My Products</h1>
      </div>
      <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/"><HouseIcon strokeWidth={1.5} size={16} /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs sm:text-sm">
            <BreadcrumbPage>My Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="mt-7">
        <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {paginatedProducts?.map(product => {
            return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} isMyProductsPage={true} ProductWishListed={deleteDone} />
          })}</div>
      </section>
       <PaginationBar productsData={productsData} setPaginatedProducts={setPaginatedProducts} itemsPerPage={12} />

    </>
  )
}

export default MyProducts
