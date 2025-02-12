import { getCategory, getProductAttributes, getProductDetails, getProducts, getReviews, insertReviews, wishList } from '@/api/apiProducts';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import { Anchor, BoxIcon, Calendar, ChevronDownIcon, FullscreenIcon, HeartIcon, HouseIcon, LockKeyhole, Mail, MapPin, Phone, PlusSquareIcon, Share2Icon, User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BarLoader, SyncLoader } from 'react-spinners';
import { useDispatch } from 'react-redux'
import { increment } from '../redux/cart/cartSlice'
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ShopByCategory from '@/components/ShopByCategory';
import { Input } from '@/components/ui/input';
import { Helmet } from 'react-helmet';
import ShareButton from '@/components/ShareButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { addToCart } from '@/api/apiCartnOrders';
import { toast } from "sonner"
import MDEditor from '@uiw/react-md-editor';
import LightboxPopup from '@/components/LightboxPopup';
import StarRating from '@/components/StarRating';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const schema = z.object({
  reviewTitle: z.string().min(1, 'Review Title is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5')
    .refine((val) => !isNaN(val), { message: 'Rating must be a valid number' }), // Ensure it's a valid number
  reviewDescription: z.string().min(1, 'Review Description is required'),
});




const ProductDetails = () => {

  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { user, isLoaded } = useUser()
  const navigate = useNavigate();
  const { id } = useParams();
  const [qn, setQn] = useState(1)
  const [currentImg, setCurrentImg] = useState(null)
  const { data: dataProduct, loading: loadingProduct, error: errorProduct, fn: fnProduct } = useFetch(getProductDetails)
  const { data: dataCat, loading: loadingCat, error: errorCat, fn: fnCat } = useFetch(getCategory)
  const { data: catProductsData, loading: catProductsLoading, error: catProductsError, fn: fnCatProducts } = useFetch(getProducts);
  const { data: productAttributesData, loading: productAttributesLoading, error: productAttributesError, fn: fnProductAttributes } = useFetch(getProductAttributes);
  const [wishlisted, setWishlisted] = useState(null)
  const [showAddReview, setShowAddReview] = useState(false)
  const { data: wishListData, loading: wishListLoading, error: wishListError, fn: fnWishList } = useFetch(wishList, { alreadyWishlisted: wishlisted });
  const { data: dataAddCart, loading: addCartLoading, error: addCartError, fn: fnAddCart } = useFetch(addToCart);
  const { data: reviewDataInsert, loading: insertReviewLoading, error: reviewError, fn: fnSubmitReview } = useFetch(insertReviews);
  const { data: reviewsData, loading: reviewsLoading, error: reviewsError, fn: fnGetReviews } = useFetch(getReviews);



  useEffect(() => {
    if (isLoaded) {
      setQn(1)
      fnProduct(id.split(':')[1])
    }
    window.scrollTo(0, 0);
  }, [isLoaded, id])



  useEffect(() => {
    if (dataProduct) {
      setCurrentImg(dataProduct[0].image_url)
      setWishlisted(dataProduct[0].wishlist_products?.length > 0)
      fnCat(dataProduct[0].category_id);
      fnCatProducts(dataProduct[0].category_id)
      let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      if (!recentlyViewed.some(product => product.id === dataProduct[0].id)) {
        recentlyViewed.push(dataProduct[0]);
      }

      if (recentlyViewed.length > 4) {
        recentlyViewed.shift();
      }
      // recentlyViewed=null

      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [dataProduct, loadingProduct])

  useEffect(() => {
    fnProductAttributes(id.split(':')[1])
  }, [isLoaded, id])



  useEffect(() => {
    if (isLoaded) {

      fnGetReviews(id.split(':')[1]);
    }

  }, [isLoaded, insertReviewLoading, id])


  const [orientation, setOrientation] = useState('vertical');

  // Update orientation on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOrientation('horizontal');
      } else {
        setOrientation('vertical');
      }
    };

    // Set initial orientation
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (productAttributesData) {
      // Set default selected values based on the first options available for each attribute
      const initialSelections = {};
      Object.entries(productAttributesData).forEach(([attribute, values]) => {
        initialSelections[attribute] = values[0].value; // Defaulting to the first value of each attribute
      });
      setSelectedAttributes(initialSelections);
    }
  }, [productAttributesData]); // Runs when productAttributesData changes


  const [selectedAttributes, setSelectedAttributes] = useState({});
  // Handle radio button selection
  const handleSelection = (attribute, value) => {
    setSelectedAttributes(prevState => ({
      ...prevState,
      [attribute]: value,  // Update the selected attribute with its new value
    }));

  };



  const handleWishList = async () => {
    await fnWishList({
      user_id: user.id,
      product_id: dataProduct[0].id,
    })
    setWishlisted(!wishlisted)
  }

  const onSubmit = (data) => {

    fnSubmitReview({
      user_id: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress.emailAddress,
      rating: data.rating,
      review_title: data.reviewTitle,
      review_description: data.reviewDescription,
      avatar_url: user.imageUrl,
      product_id: id.split(':')[1],
    })

    if (!reviewError) {
      setShowAddReview(false)
    }
  };

  const handleAddToCart = async () => {
    if (selectedAttributes && qn) {
      await fnAddCart({
        customer_id: user.id,
        product_id: dataProduct[0].id,
        product_attributes: selectedAttributes,
        quantity: qn,
      })
      toast.success("Item just added to your cart", {

        action: {
          label: "View Cart",
          onClick: () => {
            navigate('/cart')
          },
        },
      });
      dispatch(increment())
    } else {

    }

  }


  if (!isLoaded || loadingProduct || loadingCat || catProductsLoading) {
    return <BarLoader className='z-10' width="100%" color='yellow' />;
  }

  if (dataProduct?.length === 0 || dataProduct === null || dataProduct === undefined) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <Anchor size={80} color='yellow' strokeWidth={3} />
      </div>
      <p className='text-sm md:text-xl'>No product found</p>

    </div>
  }

  const calculateDiscount = (price, discount) => {
    price = price - ((discount / 100) * price)
    return Math.round(price)
  }
  const totalRating = reviewsData?.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = totalRating / reviewsData?.length;

  return (
    <>
      {(dataProduct && dataCat && catProductsData && productAttributesData) &&

        <div>

          {/* 
          <Helmet>

            <meta property="og:title" content={dataProduct[0].name} />
            <meta property="og:description" content={dataProduct[0].short_description} />
            <meta property="og:image" content={dataProduct[0].image_url} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:type" content="product" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={dataProduct[0].name} />
            <meta name="twitter:description" content={dataProduct[0].short_description} />
            <meta name="twitter:image" content={dataProduct[0].image_url} />
          </Helmet> */}


          <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5">
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
                  <DropdownMenuContent align="start" >
                    <Link to={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}`} ><DropdownMenuItem className='cursor-pointer text-xs sm:text-sm'>All {dataCat[0].name}</DropdownMenuItem></Link>

                    {dataCat[0].subcategories.map(sub => {
                      return <Link key={sub.name} to={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}><DropdownMenuItem className='cursor-pointer text-xs sm:text-sm'>{sub.name}</DropdownMenuItem></Link>
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-xs sm:text-sm">
                <BreadcrumbLink href={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}/${dataProduct[0].subcategories.name.toLowerCase().replace(/\s+/g, '-')}`}>{dataProduct[0]?.subcategories?.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="  hidden md:block" />
              <BreadcrumbItem className="  hidden md:block">
                <BreadcrumbPage>{dataProduct[0].name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className='sm:flex  mt-7 gap-6 lg:gap-14 '>
            <div className='sm:w-7/12  relative flex justify-end flex-col-reverse lg:flex-row gap-3 h-fit'>
              {/* <Button variant="none" className="p-0 absolute top-0 right-2" onClick={handleWishList} disabled={wishListLoading}>
                <HeartIcon fill={wishlisted ? "red" : ""} />
              </Button> */}
              <LightboxPopup src={currentImg}>
                <FullscreenIcon size={30} className="cursor-pointer absolute top-2 right-2 p-2 rounded-full bg-yellow-300 text-black" fill='black' />
              </LightboxPopup>
              <div className="w-full lg:w-4/12">
                <Carousel className="w-full " orientation={orientation} opts={{
                  align: "start",
                  loop: true,
                }}>
                  <CarouselContent className="max-h-[700px]">
                    <CarouselItem key={dataProduct[0].image_url} onClick={() => setCurrentImg(dataProduct[0].image_url)} className='basis-1/3 md:basis-1/2 cursor-pointer'><img src={dataProduct[0].image_url} className='aspect-square object-cover md:h-full' alt={dataProduct[0].name + " secondary-image"} /></CarouselItem>
                    {dataProduct[0].product_secondary_imgs.map(secImgs => {
                      return <CarouselItem key={secImgs.secondary_img_url} onClick={() => setCurrentImg(secImgs.secondary_img_url)} className='basis-1/3 md:basis-1/2 cursor-pointer'><img src={secImgs.secondary_img_url} className='aspect-square object-cover md:h-full' alt={dataProduct[0].name + " secondary-image"} /></CarouselItem>
                    })}
                  </CarouselContent>
                </Carousel>


              </div>

              <div className='w-full lg:w-8/12'>
                <img src={currentImg} className='h-full' alt={dataProduct[0].name + " current-image"} />

              </div>

            </div>

            <div className='sm:w-5/12 mt-10 sm:mt-0'>
              <h1 className='text-xl lg:text-4xl'>{dataProduct[0].name}</h1>
              <div className="flex items-end gap-2 mt-3 border-t border-b pt-2 pb-2">
                <p className='text-xl lg:text-4xl'>$ {calculateDiscount(dataProduct[0].price, dataProduct[0].discount)}</p>
                {dataProduct[0].discount ? <> <p className='line-through relative'>{dataProduct[0].price}<span className='absolute top-0 text-[9px] font-bold bg-yellow-400 min-w-[26px] text-center rounded-sm text-black -ml-1'>-{dataProduct[0].discount}%</span></p> </> : ""}
              </div>
              <div className='flex flex-col gap-2 items-start md:flex-row justify-between md:items-center mt-3 mb-3  text-xs sm:text-sm '>

                <div className='flex gap-3 w-[unset] sm:w-full '><p>Brand:</p> <span className='bg-yellow-400 sm:place-content-center sm:w-full md:w-[unset] text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold flex'>{dataProduct[0].sellers.name}</span></div>
                <div className='flex  w-[unset] sm:w-full gap-3 sm:justify-end'><p>Status:</p> {dataProduct[0].stock_quantity > 1000 ? <span className='bg-yellow-400 sm:place-content-center sm:w-full md:w-[unset] text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold flex'>In Stock<BoxIcon size={14} className='w-2' strokeWidth={3} /></span> : (dataProduct[0].stock_quantity === 0 ? <span className='bg-red-400 sm:place-content-center sm:w-full md:w-[unset] text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold flex'>No Stock<BoxIcon size={14} strokeWidth={3} /></span> : <span className='bg-yellow-600 sm:place-content-center sm:w-full md:w-[unset] text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold flex'>Low Stock<BoxIcon size={14} strokeWidth={3} /></span>)}</div>
              </div>

              <pre className='text-xs sm:text-sm whitespace-pre-wrap break-words overflow-auto w-full border-t border-gray-900 border-b py-3'>{dataProduct[0].short_description}</pre>

              {Object.entries(productAttributesData).map(([attribute, values]) => (
                <div key={attribute}>
                  <p className="text-xs sm:text-sm mt-4 -mb-2">{attribute}:</p>
                  <RadioGroup onValueChange={(value) => handleSelection(attribute, value)} className="flex flex-wrap gap-5 mt-3 border-t border-gray-900 border-b pt-3 pb-3" defaultValue={values[0].value}>
                    {values.map(pair => {
                      return <div key={pair.id} className="flex items-center space-x-2">
                        <RadioGroupItem className="lg:h-8 lg:w-8 rounded-sm" value={pair.value} id={pair.id} />
                        <Label htmlFor={pair.id}>{pair.value}</Label>
                      </div>
                    })}
                  </RadioGroup>
                </div>
              ))
              }




              <div className={`mt-3 flex flex-col lg:flex-row items-center justify-center gap-3 sm:border sm:p-7 lg:p-5 lg:py-3  relative`}>
                {user.unsafeMetadata.role === "seller" &&
                  <div className="absolute text-xs w-full h-full top-0 backdrop-blur-md bg-black bg-opacity-70 text-yellow-300 z-10 flex items-center gap-3 justify-center">
                    <LockKeyhole size={13} color='yellow' />Please Login With Customers Account</div>
                }
                <Select className="text-sm xs:text-xl" defaultValue={1} onValueChange={(value) => setQn(value)} >
                  <SelectTrigger className="" >
                    <SelectValue placeholder={1} />
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
                {/* <Input type="number"
                  min={1}
                  max={6} value={qn} onChange={e => setQn(e.target.value)} /> */}
                <div className='flex items-center lg:justify-center gap-3 w-full'>
                  <Button className="text-xs sm:text-sm h-[30px] sm:h-[unset]" onClick={handleAddToCart} disabled={addCartLoading || dataProduct[0].stock_quantity === 0 || user.unsafeMetadata.role === "seller"}>Add To Cart</Button>
                  <Button variant="none" onClick={handleWishList} disabled={wishListLoading}>
                    <HeartIcon className="h-32
                    " fill={wishlisted ? "red" : ""} />
                  </Button>

                  <ShareButton relativeLink={`/shop/${dataProduct[0].name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${dataProduct[0].id}`} image_url={dataProduct[0].image_url}>
                    <Share2Icon className='' />
                  </ShareButton>

                </div>

              </div>


            </div>
          </section>

          <div className='mt-7 p-5 text-xs sm:text-sm sm:p-10 rounded-sm border border-yellow-300 border-opacity-30'>
            <Tabs defaultValue="description">
              <TabsList className="mb-2">
                <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
                <TabsTrigger value="seller-details" className="text-xs sm:text-sm">Seller Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <MDEditor.Markdown className='bg-transparent w-full text-xs md:text-base' source={dataProduct[0].long_description} style={{ whiteSpace: 'pre-wrap' }} />
              </TabsContent>
              <TabsContent value="reviews">
                {reviewsLoading ?
                  <SyncLoader speedMultiplier={1.1} className='z-10 place-content-center text-center min-h-[50vh] sticky' width="100%" color='#fde047' />
                  :
                  <>
                    <div className="flex items-center justify-between pb-2 border-b">
                      {reviewsData.length > 0 ?
                        <div>
                          <p className='text-3xl'>{averageRating.toFixed(2)}<span className='text-sm'> / 5</span></p>
                          <h2 className='text-xl'>Avg Ratings</h2>
                          <StarRating rating={averageRating.toFixed(2)} classes="text-2xl" />
                        </div> : <p className='xs:block hidden'>Product reviews appear here</p>}
                      <Button variant="outline" className="text-xs sm:text-base" onClick={() => { setShowAddReview(true) }}><PlusSquareIcon /> Add a review</Button>
                    </div>
                    {showAddReview && (
                      user.unsafeMetadata.role === "customer" ?
                        <div className="flex md:flex-row flex-col pb-2 gap-5 border-b justify-center">
                          <div className='w-full lg:w-3/12 flex items-center py-14 justify-center gap-2 flex-col'>
                            <img src={user.imageUrl} alt={`${user.fullName}-review-avatar-img`} className='rounded-full max-w-[50%]' />
                            <p>Reviewing as <span className='text-yellow-300'>{user.fullName}</span></p>
                            <p>Email: {user.primaryEmailAddress.emailAddress}</p>
                          </div>
                          <form className='w-full lg:w-6/12 place-content-center' onSubmit={handleSubmit(onSubmit)}>
                            <div className='flex  xs:flex-row flex-col gap-2 pb-3'>
                              <div className='w-full lg:w-10/12'>
                                <Label htmlFor="reviewTitle" className="text-xs">Review Title *</Label>
                                <Input
                                  id="reviewTitle"
                                  placeholder="Enter review title"
                                  {...register('reviewTitle')}
                                  className="w-full p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                {errors.reviewTitle && <p className="text-xs text-red-500">{errors.reviewTitle.message}</p>}
                              </div>
                              <div className='w-full lg:w-2/12'>
                                <Label htmlFor="rating" className="text-xs">Rating (0-5) *</Label>
                                <Input
                                  id="rating"

                                  placeholder="Rating"
                                  {...register('rating', { valueAsNumber: true })}
                                  className="w-full p-2  rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" // Custom input classes
                                />
                                {errors.rating && <p className="text-xs text-red-500">{errors.rating.message}</p>}
                              </div>
                            </div>

                            <div className='pb-3'>
                              <Label htmlFor="reviewDescription" className="text-xs">Review Description *</Label>
                              <Textarea
                                id="reviewDescription"
                                placeholder="Enter review description"
                                {...register('reviewDescription')}
                                className="w-full p-2 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" // Custom textarea classes
                              />
                              {errors.reviewDescription && <p className="text-xs text-red-500">{errors.reviewDescription.message}</p>}
                            </div>

                            <Button type="submit" className="bg-yellow-300 text-black">Add Your Review</Button>
                          </form>
                        </div> : <p className='w-full py-6 border-b place-content-center text-center'>Please login with customer account</p>)}


                    <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {reviewsData.length > 0 ?
                        reviewsData.map((review, idx) => {

                          return <div key={idx} className=' xs:p-5 xs:border my-3 xs:my-0 xs:rounded-sm'>
                            <div className='flex gap-4 items-center pb-4'>
                              <img className='w-3/12 max-w-[110px] rounded-full' src={review.avatar_url} alt={`avatar of ${name}`} />
                              <div className='w-9/12'>
                                <span className='text-xs opacity-80 block'>{review.email}</span>
                                <p className='text-base'>{review.review_title}</p>
                                <span className='text-xs opacity-80'>{review.name}</span>
                                <p className='flex gap-2'>
                                  {review.rating.toFixed(2)}
                                  <StarRating rating={review.rating} />
                                </p>
                              </div>
                            </div>
                            <p className='bg-[#242424] p-2 text-xs mb-2'><Calendar className='inline -mt-1 pr-[2px]' size={14} />  {new Date(review.created_at).toLocaleString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}</p>

                            <p>{review.review_description}</p>
                          </div>
                        })
                        : <p>No Reviews Found</p>

                      }
                    </div>
                  </>}

              </TabsContent>
              <TabsContent value="seller-details">

                <p className='pt-4 text-xs md:text-base opacity-95'> <User2Icon className='inline -mt-1 pr-1' size={15} /> {dataProduct[0].sellers.name} </p>
                <p className='mt-2 text-xs md:text-base opacity-95'> <Phone className='inline -mt-1 pr-1' size={15} /> {dataProduct[0].sellers.phone_number} </p>
                <p className='mt-2 text-xs md:text-base opacity-95'> <Mail className='inline -mt-1 pr-1' size={15} /> {dataProduct[0].sellers.email} </p>
                <p className='mt-2 text-xs md:text-base opacity-95'> <MapPin className='inline -mt-1 pr-1' size={15} /> {dataProduct[0].sellers.address} </p>


              </TabsContent>
            </Tabs>
          </div>

          {(catProductsData?.length !== 0 && catProductsData?.length !== 1 && catProductsData?.length !== undefined) && <section className="mt-7">
            <div className='flex justify-between items-center'>
              <h2>Related Products</h2>
              <Link to={`/${dataCat[0].name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button variant="link">View All</Button>
              </Link>
            </div>

            <div className='grid w-full mt-4 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {catProductsData.filter(relatedproduct => relatedproduct.id !== dataProduct[0].id) // Exclude the current product
                .slice(0, 4)
                .map(relatedproduct => {
                  if (relatedproduct.id !== dataProduct[0].id)
                    return <ProductCard id={relatedproduct.id} name={relatedproduct.name} price={relatedproduct.price} image_url={relatedproduct.image_url} key={relatedproduct.name} stock_quantity={relatedproduct.stock_quantity} isWishInit={relatedproduct?.wishlist_products?.length > 0} product={relatedproduct} />

                })
              }
            </div>
          </section>}

          <ShopByCategory />

        </div>
      }
    </>
  )
}

export default ProductDetails
