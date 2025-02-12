import { getAllSubCatProducts, getCategory } from '@/api/apiProducts';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Anchor, ChevronDownIcon, HouseIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarLoader } from 'react-spinners';
import ProductCard from '@/components/ProductCard';

const Categories = () => {

    let { category } = useParams();
    const { isLoaded } = useUser()

    category = category.replace(/-/g, ' ') .split(' ') .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) .join(' ');


    const { data: catData, loading: catLoading, error: catError, fn: fnCat } = useFetch(getCategory, {}, category);
    const { data: catProductsData, loading: catProductsLoading, error: catProductsError, fn: fnCatProducts } = useFetch(getAllSubCatProducts);


    useEffect(() => {
        window.scrollTo(0, 0);
        fnCat(false,category)
    }, [isLoaded,category])


    useEffect(() => {
        if (catData) {
            fnCatProducts(category)
        }

    }, [catData,category])

    
    


    const randomBannerImg = () => {
        let imgArray = ["assets/undraw_web-shopping_m3o2.svg", "assets/undraw_window-shopping_9l2k.svg", "assets/undraw_shopping-app_b80f.svg", "assets/undraw_urban-design_tz8n.svg", "assets/undraw_deliveries_2m9t.svg", "assets/undraw_jewelry_39lx.svg", "assets/undraw_shopping_a55o.svg"]
        let random = Math.floor(Math.random() * imgArray.length)
        return imgArray[random]
    }


    const lightColors = () => {
        const lightTailwindColors = [
            "#fbbf24",  // amber-300
            "#60a5fa",  // blue-300
            "#22d3ee",  // cyan-300
            "#d946ef",  // fuchsia-300
            "#d1d5db",  // gray-300
            "#4ade80",  // green-300
            "#818cf8",  // indigo-300
            "#a3e635",  // lime-300
            "#fb923c",  // orange-300
            "#f472b6",  // pink-300
            "#a855f7",  // purple-300
            "#f87171",  // red-300
            "#fda4af",  // rose-300
            "#38bdf8",  // sky-300
            "#2dd4bf",  // teal-300
            "#7c3aed",  // violet-300
            "#facc15"   // yellow-300
        ];


        let random = Math.floor(Math.random() * lightTailwindColors.length)


        return lightTailwindColors[random]
    }

    if (!isLoaded || catLoading || catProductsLoading) {
        return <BarLoader className='z-10' width="100%" color='yellow' />;
    }

    if (catProductsData?.length === 0 || catProductsData === null) {
        return <div className='text-center place-content-center h-[90vh]'>
          <div className='flex items-center justify-center mb-5'>
            <Anchor size={80} color='yellow' strokeWidth={3} />
          </div>
          <p className='text-sm md:text-xl'>Nothing to see here</p>
    
        </div>
      }


    return (
        (catData && catProductsData) &&
        <>

            <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5 mb-5 ">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/"><HouseIcon strokeWidth={1.5} size={16} /></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="text-xs sm:text-sm">
                        <BreadcrumbPage href="/">

                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
                                    {catData[0].name}
                                    <ChevronDownIcon size={15} className='mt-[1.5px]' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">

                                    {catData[0].subcategories.map(sub => {
                                        return <Link key={sub.name} to={`/${catData[0].name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}><DropdownMenuItem className='cursor-pointer text-xs sm:text-sm' >{sub.name}</DropdownMenuItem></Link>
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </BreadcrumbPage>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>


            <section className={`min-h-[40vh] rounded-sm pl-5 xs:pl-14 pr-5 lg:pl-20 lg:pr-10 gap-24 items-center md:flex`} style={{ backgroundColor: lightColors() }} >
                <div className=' md:w-7/12 pt-5 xs:pt-14  md:pt-5 md:pb-5'>
                    <h1 className='text-3xl lg:text-4xl font-bold text-black pb-1.5'>
                        {catData[0].name}
                    </h1>
                    <p className='text-black text-sm font-medium'>{catData[0].description}</p>

                </div>
                <div className='md:w-5/12 pt-7'>
                    <img src={randomBannerImg()} alt="banner-demonstration-of-category" className='w-[100%] h-[20vh] xs:h-[200px] lg:h-[280px] object-cover object-top' />
                </div>
            </section>

            {catProductsData.map(subcat => {
                return <section className="mt-7" key={subcat.subcategory}>
                    <div className='flex justify-between items-center'>
                        <h2>{subcat.subcategory}</h2>
                        <Link to={`/${catData[0].name.toLowerCase()}/${subcat.subcategory.toLowerCase()}`}>
                            <Button variant="link">View All</Button>
                        </Link>
                    </div>

                    <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {subcat.products.slice(0, 8).map(product => {
                            return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product}/>
                        })

                        }

                    </div>
                </section>
            })

            }

            <section>
                <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-y-[40px] gap-4 p-5 pt-7 mt-7 pb-7 bg-[#facc15]  place-items-center text-black rounded-sm">
                    <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
                        <img src="https://www.redbubble.com/boom/client/11e577ece42959a779dad50443e2640d.svg" className='mix-blend-multiply' alt="features-we-offer" width={100} />
                        <h2 className='text-xl font-medium'>All India Shipping</h2>
                        <p className='text-md mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <Button variant="outline" className="text-md bg-transparent text-black">Learn More</Button>
                    </div>
                    <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
                        <img src="https://www.redbubble.com/boom/client/4399b2507b789bbd378c3fbe71e23b16.svg" className='mix-blend-multiply' alt="features-we-offer" width={100} />
                        <h2 className='text-xl font-medium'>Secure Payments</h2>
                        <p className='text-md mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <Button variant="outline" className="text-md bg-transparent text-black">Learn More</Button>
                    </div>
                    <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
                        <img src="https://www.redbubble.com/boom/client/d13bc377413e95979719bf36f522db21.svg" className='mix-blend-multiply' alt="features-we-offer" width={100} />
                        <h2 className='text-xl font-medium'>Free Return</h2>
                        <p className='text-md mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <Button variant="outline" className="text-md bg-transparent text-black">Learn More</Button>
                    </div>
                    <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
                        <img src="https://www.redbubble.com/boom/client/bd7df1563ed67eaef3fc82b2a423dffd.svg" className='mix-blend-multiply' alt="features-we-offer" width={100} />
                        <h2 className='text-xl font-medium'>Local Support</h2>
                        <p className='text-md mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <Button variant="outline" className="text-md bg-transparent text-black">Learn More</Button>
                    </div>


                </div>
            </section>

        </>
    )
}

export default Categories
