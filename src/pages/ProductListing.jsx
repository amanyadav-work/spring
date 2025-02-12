
import { getCategory, getProducts } from "@/api/apiProducts";
import ProductCard from "@/components/ProductCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { BarLoader, SyncLoader } from "react-spinners";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button";
import { Anchor, FlameIcon, Sparkles } from "lucide-react";
import PaginationBar from "@/components/PaginationBar";



const ProductListing = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const { isLoaded } = useUser();
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("")
    const query = params.get('q');
    const populars = params.get('ispop')

    const { data: productsData, loading: productsLoading, error: productsError, fn: fnProducts } = useFetch(getProducts, {});
    const { data: catData, loading: catLoading, error: catError, fn: fnCat } = useFetch(getCategory, {});
    const [paginatedProducts, setPaginatedProducts] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isLoaded) {
            fnCat();
            fnProducts(false, false, query, false, false, populars === 'true');
        }
        if (query) {
            setSearchQuery(query);
        }
    }, [isLoaded, populars, query]);




    const handleCategory = (e) => {
        window.scrollTo(0, 0);
        const filter = e.target.value;
        let reg = "^\[a-zA-z]+\:[0-9]\$"
        if (filter.match(reg)) {
            fnProducts(filter.split(":")[1], false);

        } else {
            fnProducts(false, filter.split(":")[1]);
        }

        setSelectedValue(e.target.value)
        setSearchQuery("");

    }

    const handleSearch = () => {
        fnProducts(false, false, searchQuery);
        setSelectedValue('')
    }



    if (!isLoaded || catLoading) {
        return (<BarLoader className='z-10' width="100%" color='yellow' />)
    }
    return (

        <>
            <section className="flex w-full justify-center ">
                <h1 className="text-2xl sm:text-4xl mt-8 pt-8 mb-16 border-t uppercase">The Sh<FlameIcon className="inline -mt-3 text-yellow-300" size={35} />p</h1>
            </section>
            <section className="md:flex gap-5 justify-between md:relative">
                <div className="md:w-4/12 lg:w-3/12 p-2 lg:p-10 lg:border rounded-sm md:sticky md:h-fit md:top-16 pb-20">
                    <Button variant="outline" className="w-full mb-3 text-xs sm:text-sm " onClick={() => { setSearchQuery(""); fnProducts(false, false, false, false, false, true); setParams(''); setSelectedValue(''); window.scrollTo(0, 0); }} >Sort By Popularity <Sparkles color="yellow" /></Button>
                    <div className="w-full grid grid-cols-2 gap-3 mb-4">

                        <Button variant="outline" onClick={() => { setSearchQuery(""); fnProducts(); setParams(''); setSelectedValue(''); window.scrollTo(0, 0); }} className="text-xs sm:text-sm ">Clear Filter</Button>
                        <Button variant="outline" onClick={() => { fnProducts(false, false, false, true); setSearchQuery(""); setParams(''); setSelectedValue(''); window.scrollTo(0, 0); }} className="text-xs sm:text-sm ">Show All In Stock</Button>
                    </div>
                    <h2 className="text-xs sm:text-sm mb-2">Search Items</h2>
                    <div className="flex">

                        <Input type="text" placeholder="Naruto Gara" className="focus-visible:ring-black text-xs sm:text-sm rounded-none mb-5" value={searchQuery || ""} onChange={e => setSearchQuery(e.target.value)} />
                        <Button variant="outline" className="rounded-none text-xs sm:text-sm " onClick={handleSearch}>Search</Button>
                    </div>
                    <h2 className="text-xs sm:text-sm mb-2">Filter By Category</h2>
                    <Accordion type="single" collapsible>
                        {!catData ? <p>No Categories Found</p> :
                            catData?.map(cat => {
                                return (

                                    <AccordionItem value={cat.name} key={"Parent:" + cat.id}>
                                        <AccordionTrigger>{cat.name}</AccordionTrigger>
                                        <AccordionContent>
                                            <RadioGroup value={selectedValue} onClick={handleCategory}>
                                                <div className="flex items-center mt-1 mb-1">
                                                    <RadioGroupItem value={"Parent:" + cat.id} id={cat.name} />
                                                    <Label htmlFor={cat.name} className="cursor-pointer  px-2 text-xs sm:text-sm ">All {cat.name}</Label>
                                                </div>

                                                {cat.subcategories.map(sub => {
                                                    return (
                                                        <div className="flex items-center mt-1 mb-1" key={"Sub:" + sub.id}>
                                                            <RadioGroupItem value={`Sub: ${sub.id}`} id={sub.name} />
                                                            <Label htmlFor={sub.name} className="cursor-pointer  px-2 text-xs sm:text-sm ">{sub.name}</Label>
                                                        </div>

                                                    )
                                                })}
                                            </RadioGroup>


                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })

                        }

                    </Accordion>

                </div>

                <div className="md:w-9/12 relative">

                    {productsLoading ? <SyncLoader speedMultiplier={1.1} className='z-10 place-content-center text-center min-h-[50vh] sticky' width="100%" color='#fde047' /> :<>
                        <div className='grid w-full xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>

                            {productsData?.length === 0 ? <div className='text-center place-content-center h-[90vh] w-full col-span-3'>
                                <div className='flex items-center justify-center mb-5'>
                                    <Anchor size={60} color='yellow' strokeWidth={3} />
                                </div>
                                <p className='text-sm md:text-xl'>No products found </p>

                            </div> :
                                paginatedProducts?.map(product => {
                                    return <ProductCard id={product.id} name={product.name} price={product.price} image_url={product.image_url} key={product.name} stock_quantity={product.stock_quantity} isWishInit={product?.wishlist_products?.length > 0} product={product} />
                                })}

                        </div>
                            {(productsData && productsData.length > 0) &&
                                <PaginationBar productsData={productsData} setPaginatedProducts={setPaginatedProducts} itemsPerPage={12} />}
                    </>
                    }
                  
                  





                </div>
            </section>




        </>
    )
}

export default ProductListing
