import { getProducts } from '@/api/apiProducts'
import ProductCard from '@/components/ProductCard'
import ShopByCategory from '@/components/ShopByCategory'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { LockKeyholeIcon, LucideArrowUpFromDot, ShoppingBasket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'



const Home = () => {

  const { user, isLoaded } = useUser()

  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState(null)
  const { data: productsData, loading: productsLoading, error: productsError, fn: fnProducts } = useFetch(getProducts);
  useEffect(() => {
    window.scrollTo(0, 0);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed'));
    setRecentlyViewedProducts(recentlyViewed)
    fnProducts()

  }, [isLoaded])





  return (
    <>
      <div className='h-[25vh] sm:min-h-[60vh] bg-cover flex flex-col items-center w-full justify-center' style={{ backgroundImage: "url(https://s3.amazonaws.com/teespring-ass/categories/homepage/shop_hero_image.jpg)", }}>
        <h1 className='text-base sm:text-2xl md:text-4xl'>Discover. Customize. Make it Yours.</h1>
      </div>
      <section className="mt-7">
        <div className='flex justify-between items-center'>
          <h2>Popular Products</h2>
          <Link to='/shop?ispop=true'>
            <Button variant="link">View All</Button>
          </Link>
        </div>

        {(isLoaded && user) ? (productsData ?
          <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...productsData].sort((a, b) => b.view_count - a.view_count).slice(0, 8).map(product => {
              return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />
            })}
          </div> : <SyncLoader speedMultiplier={1.1} className='z-10 place-content-center text-center min-h-[50vh] sticky' width="100%" color='#fde047' />)

          : <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 locked relative'>
            <div className='absolute top-0 z-10 text-white w-full h-full flex items-center justify-center flex-col gap-1'>
              <LockKeyholeIcon color='yellow' strokeWidth={2} size={25} />
              <p className="text-xs text-yellow-300 font-medium"> Please Login</p>
            </div>
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/0/a022e60TRAJECTORY-BLACK_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/0/a022e60BLACKSPACE-BLACK_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/8/38ad1867009846701_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/c/7/c719ec5AWICSCSMAWJK4062_1.jpg?rnd=20200526195200&tr=w-512" />
          </div>
        }
      </section>

      <section className='mt-7 bg-slate-300 text-black sm:flex sm:items-center sm:justify-between relative'>
        <div className="flex sm:w-6/12 p-10 pt-14 sm:p-16 sm:border-r-2 ">
          <h2 className='text-2xl sm:text-3xl lg:text-5xl font-bold'>Discover creativity <br />
            and the products</h2>
          <Link to="/shop">
            <Button variant="destructive" className="absolute top-0 right-0 max-w-[300px] rounded-none">Shop Now<ShoppingBasket /></Button></Link>
        </div>
        <div className="flex sm:w-6/12 place-content-center sm:p-5 object-cover">
          <img src="https://teespring-ass.s3.amazonaws.com/HP/whitelabel/searchProducts.png" alt="" className='lg:h-80 p-8' />
        </div>

      </section>


      <section className="mt-7">
        <div className='flex justify-between items-center'>
          <h2>Recent Launches</h2>
          <Link to='/shop'>
            <Button variant="link">View All</Button>
          </Link>
        </div>

        {productsData ?
          <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...productsData]
              .sort((a, b) => b.id - a.id)  // Sort by ID in descending order
              .slice(0, 8).map(product => {
                return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />
              })}
          </div>

          : <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 locked relative '>
            <div className='absolute top-0 z-10 text-white w-full h-full flex items-center justify-center flex-col gap-1'>
              <LockKeyholeIcon color='yellow' strokeWidth={2} size={25} />
              <p className="text-xs text-yellow-300 font-medium"> Please Login</p>
            </div>
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/0/a022e60TRAJECTORY-BLACK_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/a/0/a022e60BLACKSPACE-BLACK_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/8/38ad1867009846701_1.jpg?rnd=20200526195200&tr=w-512" />
            <ProductCard image_url="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/c/7/c719ec5AWICSCSMAWJK4062_1.jpg?rnd=20200526195200&tr=w-512" />
          </div>
        }
      </section>

      <ShopByCategory />
      {(recentlyViewedProducts?.length !== 0 && recentlyViewedProducts !== null) &&
        <section className="mt-7">
          <div className='flex justify-between items-center'>
            <h2>Recent Viewed</h2>
            <Link to='/shop'>
              <Button variant="link">Go To Shop <LucideArrowUpFromDot className='rotate-90' /></Button>
            </Link>
          </div>


          <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {recentlyViewedProducts?.map(product => {
              return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isMyWishList={true} product={product} />
            })}
          </div>
        </section >
      }


    </>
  )
}

export default Home
