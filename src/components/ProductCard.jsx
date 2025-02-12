import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { FullscreenIcon, HeartIcon, Share2Icon, ShoppingCart, Trash } from 'lucide-react'
import { Link } from "react-router-dom"
import { Badge } from "./ui/badge"
import { deleteProduct, wishList } from "@/api/apiProducts"
import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"

import ShareButton from "./ShareButton"
import { toast } from "sonner"
import LightboxPopup from "./LightboxPopup"


const ProductCard = ({ product, id, name, price, image_url, stock_quantity, className, isMyProductsPage = false, isWishInit = false, ProductWishListed = () => { } }) => {

  const [wishlisted, setWishlisted] = useState(isWishInit)
  const { data: wishListData, loading: wishListLoading, error: wishListError, fn: fnWishList } = useFetch(wishList, { alreadyWishlisted: wishlisted });
  const { data: deletedProductData, loading: deletingProductLoading, error: deletingProductError, fn: deleteProductFn } = useFetch(deleteProduct);
  const { isLoaded, user } = useUser()

  const handleWishList = async () => {
    await fnWishList({
      user_id: user.id,
      product_id: product.id,
    })
    if (wishlisted) {
      toast("Removed from wishlist", {
        description: "Find even more great deals ahead!",
      });
    } else {
      toast("Added to wishlist!", {
        description: "Keep shopping for awesome deals!",
      });
    }

    ProductWishListed()
  }

  useEffect(() => {
    wishListData !== undefined && setWishlisted(wishListData?.length > 0)
  }, [wishListData])

  const handleDelete = async () => {
    await deleteProductFn(id)
    ProductWishListed()

  }

  return (
    <>

      <Card className="relative">
        {(stock_quantity <= 500 && stock_quantity !== 0) &&
          (
            <Badge variant="destructive" className="2xl absolute rounded-none z-10 ">Only {stock_quantity} Left</Badge>

          )}
        {stock_quantity === 0 &&
          (
            <Badge variant="secondary" className="2xl absolute rounded-none z-10">Currently Unavailable</Badge>

          )}
        <CardContent className="p-0 relative">
          <Link className={className} to={`/shop/${name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${id}`}>
            <img src={image_url} alt={`${name} Product`} className={`w-full h-[400px] sm:h-[400px] object-cover object-top ${stock_quantity == 0 && "saturate-0"}`} />
          </Link>
          {isMyProductsPage && (
            <Dialog>
              <DialogTrigger className="absolute top-0 right-0 p-2 bg-red-900 rounded-bl"><Trash size={15} /></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="flex gap-2">
                    Once you delete this product, it cannot be undone. This action will permanently remove the product from your inventory and it will no longer be available for sale.
                  </DialogDescription>

                </DialogHeader>
                <DialogFooter className="justify-start">
                  <Button variant="destructive" onClick={handleDelete} disabled={deletingProductLoading}>
                    Delete Permanently <Trash />
                  </Button>

                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          )}
        </CardContent>

        <CardHeader className="relative">
          <Badge variant="secondary" className="text-xl absolute rounded-none top-0 -translate-y-2/4 right-0">$ {price}</Badge>
          <CardTitle className="text-md/7">
            {name?.length > 56 ? `${name.substring(0, 60)}...` : name} </CardTitle>
          <div className='flex justify-between item'>

            <div className="flex  gap-3">
              <Button variant="none" className="p-0">
                <Link className={className} to={`/shop/${name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${id}`}><ShoppingCart /></Link>
              </Button>
              <Button variant="none" className="p-0" onClick={handleWishList} disabled={wishListLoading}>
                <HeartIcon fill={wishlisted ? "red" : ""} />
              </Button>
              <ShareButton relativeLink={`/shop/ ${name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${id}`} image_url={image_url}>
                <Share2Icon size={18} />
              </ShareButton>

            </div>

            <div>
              <LightboxPopup src={image_url}>
                <FullscreenIcon size={22} className="cursor-pointer p-[5px] rounded-full bg-gray-300 text-black" fill='black' />
              </LightboxPopup>
            </div>
          </div>
        </CardHeader>

      </Card >

    </>
  )
}

export default ProductCard
