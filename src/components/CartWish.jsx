import { wishList } from "@/api/apiProducts";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
// import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";

const CartWish = ({id,isWishInit = false,setWished}) => {

    const {user} = useUser()
    // const [wishlisted, setWishlisted] = useState(isWishInit)
    const { data: wishListData, loading: wishListLoading, error: wishListError, fn: fnWishList } = useFetch(wishList, { alreadyWishlisted: isWishInit });

    // useEffect(() => {
    //     wishListData !== undefined && setWishlisted(wishListData?.length > 0)
    // }, [wishListData])


    
    const handleWishList = async () => {
        await fnWishList({
            user_id: user.id,
            product_id: id,
        })
        setWished(Math.random())

    }

    return (
        <Button variant="none" className="h-[33px] w-[30px] border rounded-full  bg-black" onClick={handleWishList} disabled={wishListLoading}><HeartIcon fill={isWishInit ? "red" : ""} /></Button>
    )
}

export default CartWish
