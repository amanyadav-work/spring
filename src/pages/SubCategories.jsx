import { getCategory, getProducts } from '@/api/apiProducts';
import ProductCard from '@/components/ProductCard';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Anchor, ChevronDownIcon, HouseIcon } from 'lucide-react';
import PaginationBar from '@/components/PaginationBar';

const SubCategories = () => {

  const { isLoaded } = useUser();
  let { subcategory } = useParams()
  subcategory = subcategory.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');



  const { data: subCatProductsData, loading: subCatProductsLoading, error: subCatProductsError, fn: fnSubCatProducts } = useFetch(getProducts);
  const { data: dataCat, loading: loadingCat, error: errorCat, fn: fnCat } = useFetch(getCategory)
  const [paginatedProducts, setPaginatedProducts] = useState(null)


  useEffect(() => {
    window.scrollTo(0, 0);
    fnSubCatProducts(false, false, false, false, subcategory)
  }, [isLoaded, subcategory])

  useEffect(() => {
    subCatProductsData &&
      fnCat(subCatProductsData[0]?.category_id);

  }, [subCatProductsData])


  if (!isLoaded || subCatProductsLoading) {
    return <BarLoader className='z-10' width="100%" color='yellow' />;
  }

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };


  if (subCatProductsData?.length === 0 || subCatProductsData === null) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <Anchor size={80} color='yellow' strokeWidth={3} />
      </div>
      <p className='text-sm md:text-xl'>Nothing to see here </p>
    </div>
  }

  return (
    (subCatProductsData && subCatProductsData?.length !== 0 && dataCat) &&
    <>
      <div className="flex justify-center">

        <h1 className='text-4xl mt-8 pt-8 mb-16 border-t uppercase'> {capitalize(subcategory.split(":")[0])}</h1>
      </div>


      <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5 ">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/"><HouseIcon strokeWidth={1.5} size={16} /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs sm:text-sm">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
                {dataCat[0].name}
                <ChevronDownIcon size={15} className='mt-[1.5px]' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <Link to={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}`}><DropdownMenuItem className='cursor-pointer text-xs sm:text-sm'>All {dataCat[0].name}</DropdownMenuItem></Link>

                {dataCat[0].subcategories.map(sub => {
                  return <Link key={sub.name} to={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}><DropdownMenuItem className='cursor-pointer text-xs sm:text-sm'>{sub.name}</DropdownMenuItem></Link>
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage className="text-xs sm:text-sm">
            {subCatProductsData[0]?.subcategories?.name}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>



      <section className="mt-7">
        <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {paginatedProducts?.map((product, idx) => {
            return idx == 0 ?
              (<ProductCard className="sm:col-span-2" id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />)
              : (<ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />)

          })
          }
        </div>
        <PaginationBar productsData={subCatProductsData}  setPaginatedProducts={setPaginatedProducts} itemsPerPage={12} />


      </section>
    </>

  )
}

export default SubCategories
