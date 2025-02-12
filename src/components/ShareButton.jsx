import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Link } from "react-router-dom"

const ShareButton = ({children,relativeLink,image_url}) => {
    return (
        <>
            <Popover>
                <PopoverTrigger>{children}</PopoverTrigger>
                <PopoverContent className="flex items-center justify-center gap-2 w-fit">

                    <Link to={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + relativeLink)}&text=${encodeURIComponent('Check out this product!')}`} target="_blank" variant="none" className="p-0">
                        <img src="/assets/twitter-x.svg" alt="twitter-share-icon" width={20} />
                    </Link>

                    <Link to={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin + relativeLink)}&media=${encodeURIComponent(image_url)}&description=${encodeURIComponent('Check out this awesome product!')}`} target="_blank" variant="none" className="p-0">
                        <img src="/assets/pinterest.svg" alt="pinterest-share-icon" width={20} />
                    </Link>

                    <Link to={`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.origin + relativeLink)}&title=${encodeURIComponent('Check out this awesome product!')}`} target="_blank" variant="none" className="p-0">
                        <img src="/assets/reddit.svg" alt="twitter-share-icon" width={20} />
                    </Link>

                    <Link to={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + relativeLink)}&text=${encodeURIComponent('Check out this awesome product!')}`} target="_blank" variant="none" className="p-0">
                        <img src="/assets/telegram.svg" alt="twitter-share-icon" width={20} />
                    </Link>

                    <Link to={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out this awesome product: ' + window.location.origin + relativeLink)}`} target="_blank" variant="none" className="p-0">
                        <img src="/assets/whatsapp.svg" alt="twitter-share-icon" width={20} />
                    </Link>


                </PopoverContent>
            </Popover>
        </>
    )
}

export default ShareButton
