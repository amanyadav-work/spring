
import { deleteCartItem, getCartItems, updateQn } from "@/api/apiCartnOrders"
import { getProducts } from "@/api/apiProducts"
import CartWish from "@/components/CartWish"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import { Anchor, Ghost, HeartIcon, LucideArrowUpFromDot, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"
import { useDispatch } from 'react-redux'
import { decrement } from '../redux/cart/cartSlice'


const Cart = () => {
  const dispatch = useDispatch()
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { data: dataProduct, loading: loadingProduct, error: errorProduct, fn: fnProduct } = useFetch(getCartItems)
  const { data: dataDeleteItem, loading: loadingDeleteItem, error: errorDeleteItem, fn: fnDeleteItem } = useFetch(deleteCartItem)
  const { data: dataPop, loading: popLoading, error: popError, fn: fnPop } = useFetch(getProducts);
  const { data: dataUpdateQn, loading: updateQnLoading, error: updateQnError, fn: fnUpdateQn } = useFetch(updateQn);

  const [wished, setWished] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!updateQnLoading && isLoaded && !loadingDeleteItem) {
      fnProduct();
    }

  }, [isLoaded, loadingDeleteItem, wished, updateQnLoading])

  useEffect(() => {
    fnPop();
  }, [isLoaded])


  const calculateDiscount = (price, discount) => {
    price = price - ((discount / 100) * price)
    return Math.round(price)
  }

  const calculateTotalPrice = (orderData) => {
    // Calculate the total price by iterating over each product
    return orderData.reduce((total, item) => {
      const { price, discount } = item.products;


      // Calculate discounted price for the product
      const discountedPrice = calculateDiscount(price, discount);

      // Add the price of the current item to the total
      return total + (discountedPrice * item.quantity);
    }, 0);
  };


  const handleDeleteItem = async (itemId) => {
   await fnDeleteItem(itemId);
    dispatch(decrement())
    toast("Item deleted from cart", {
      description: "Keep shopping and find more awesome deals!",

    }); 
  }


  const handleQuantityChange = async (itemId, newQuantity) => {
    await fnUpdateQn(itemId, newQuantity);
    toast("Quantity updated for your product", {
      description: "Keep browsing for more amazing deals!",
    });

  };




  if (!isLoaded || loadingProduct || popLoading) {
    return <BarLoader className='z-10' width="100%" color='yellow' />;
  }

  if (isLoaded && !loadingProduct && !popLoading) {
    // Check if the user is loaded and has the appropriate role
    if (user?.unsafeMetadata?.role === 'seller') {
      return (
        <div className='text-center place-content-center h-[90vh]'>
          <div className='flex items-center justify-center mb-5'>
            <Ghost size={80} color='yellow' strokeWidth={2.5} />
          </div>
          <p className='text-sm md:text-xl'>Please Login With Customer Account</p>
        </div>
      );
    }
  }

  if (dataProduct?.length === 0 || dataProduct === null) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <Anchor size={80} color='yellow' strokeWidth={3} />
      </div>
      <p className='text-sm md:text-xl'>No Items Found In Cart</p>

    </div>
  }


  return (
    (dataProduct && dataProduct.length > 0 && dataPop && dataPop.length > 0) && <>
      <Button variant="outline" className="mt-7 mb-3" onClick={() => navigate('/wishlist')}><HeartIcon /> Saved Items <LucideArrowUpFromDot className='rotate-90' /></Button>
      <section className="flex flex-col lg:flex-row justify-between gap-12 ;g:relative">
        <div className="lg:w-8/12 shadow-md p-6 text-left border border-yellow-[#4f4f4f]">
          <div className="flex md:justify-between items-center pb-3 gap-4">
            <div className="h-[30px] w-[30px] hidden md:block  place-content-center mb-[0.8px]">
              Sr.
            </div>
            <h1 className="w-7/12 ">Products</h1>
            <p className="hidden md:block w-3/12">Quantity</p>
            <p className="hidden md:block w-2/12">Subtotal</p>
          </div>
          <hr className="mb-6" />
          {dataProduct.map((item, idx) => {
            const attributes = JSON.parse(item.product_attributes);
            return <div key={item.id} className="md:flex gap-4 text-left md:justify-between items-center pb-3 mt-3 border-b last:border-0 relative">
              <div className="flex pb-3 md:pb-0 md:flex-col gap-1 xs:gap-3 absolute right-0 md:relative z-10 scale-[0.8] md:scale-[unset]">
                <div className="hidden md:block  h-[30px] w-[30px] place-content-center text-center mb-[0.8px]  text-sm">
                  {idx + 1}
                </div>
                <CartWish id={item.product_id} isWishInit={item.products?.wishlist_products?.length > 0} setWished={setWished} />
                <Button variant="none" className="h-[33px] w-[30px] border rounded-full bg-black " onClick={() => handleDeleteItem(item.id)} disabled={loadingDeleteItem}><Trash /></Button>

              </div>
              <div className="xs:flex md:w-7/12 gap-7 md:gap-5 items-center relative ">
                <Link className="w-4/12" to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                  <img src={item.products.image_url} alt={`${item.products.name} image`} className="md:w-[150px] rounded-sm" />
                </Link>
                <div className="w-full xs:w-8/12 ">
                  <span className='bg-yellow-400 absolute top-0 xs:top-[unset] xs:relative w-fit text-[9px] xs:text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold flex mb-2'>{item.products.sellers.name}'s</span>
                  <Link to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                    <h2 className="text-sm pt-4 xs:pt-0 xs:text-base font-semibold ">{item.products.name}</h2>
                  </Link>

                  <div className="flex gap-2 my-1 xs:my-0 items-center">

                    <p className="text-sm sm:text-base">$ {calculateDiscount(item.products.price, item.products.discount)}</p>
                    {item.products.discount ? <> <p className='line-through text-xs sm:text-md text-opacity-40 relative'>{item.products.price}<span className='absolute top-0 text-[8px] sm:text-[9px] font-bold bg-yellow-400 min-w-[26px] text-center rounded-sm text-black -ml-1'>-{item.products.discount}%</span></p> </>:null}
                  </div>
                  {Object.entries(attributes).map(([key, value], index) => (
                    <div className="flex text-sm" key={index}>
                      <p>{key}:&nbsp;</p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="inline-block md:block w-7/12 md:w-3/12 pt-5 pr-3 md:pt-0 md:pr-0">
                <Select className="text-sm xs:text-xl" defaultValue={item.quantity} onValueChange={(value) => handleQuantityChange(item.id, value)} >
                  <SelectTrigger className="md:w-[80px]" >
                    <SelectValue placeholder={item.quantity} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className='cursor-pointer' value={1}>1</SelectItem>
                    <SelectItem className='cursor-pointer' value={2}>2</SelectItem>
                    <SelectItem className='cursor-pointer' value={3}>3</SelectItem>
                    <SelectItem className='cursor-pointer' value={4}>4</SelectItem>
                    <SelectItem className='cursor-pointer' value={5}>5</SelectItem>
                    <SelectItem className='cursor-pointer' value={6}>6</SelectItem>
                  </SelectContent>
                </Select>
              </p>
              <p className="inline-block md:block w-5/12 md:w-2/12 text-sm xs:text-xl ">$ {calculateDiscount(item.products.price, item.products.discount) * item.quantity}</p>
            </div>
          })}
        </div>




        {/* SideBar */}

        <div className="lg:w-4/12 lg:sticky lg:top-[90px] lg:h-fit">
          <div className="border p-5">
            <h2 className="text-lg lg:text-2xl pb-3 mb-[0.8px]">Summary</h2>
            <hr className="mb-6" />
            <div className="text-base lg:text-xl flex justify-between pb-4 mb-[0.8px]">
              <p>Total <sub className="text-xs">(excluding delivery)</sub></p>
              <p className="text-lg lg:text-2xl font-semibold ">  <span className="text-yellow-300">$ </span>{calculateTotalPrice(dataProduct)}</p>
            </div>
            <hr className="mb-6" />
            <p className="text-sm lg:text-base">
              Next steps include providing your shipping address, name, and phone number. Then, choose your delivery method and payment option.  And if you're still in the mood to shop, feel free to keep browsing—there’s more to discover!
            </p>
          </div>
          <Button className='w-full mt-4 bg-yellow-300 text-sm font-medium' onClick={() => navigate('/checkout')}>Proceed to Checkout Securely <LucideArrowUpFromDot className='rotate-90' strokeWidth={2.5} /></Button>
        </div>



      </section>

      <section>
        <div className='flex justify-between items-center mt-9'>
          <h2>Popular Products</h2>
          <Link to='/shop?ispop=true'>
            <Button variant="link">View All</Button>
          </Link>
        </div>
        <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {dataPop.slice(0, 8).sort((a, b) => b.view_count - a.view_count).map(product => {
            return <ProductCard  id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.id} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />
          })}
        </div>
      </section >
{/* 
      <pre className="whitespace-pre-wrap break-words overflow-auto max-w-full"> ALL:
        {JSON.stringify(dataProduct, null, 2)}</pre> */}
    </>
  )
}

export default Cart
