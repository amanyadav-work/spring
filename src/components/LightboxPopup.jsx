import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

const LightboxPopup = ({ children, src }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[90%] md:max-w-fit place-items-center border-0 bg-transparent p-0">
                <div className="relative  h-[fit] md:h-[90vh] md:w-full overflow-clip rounded-md bg-transparent shadow-md">
                    <img src={src}
                        alt={`lightBox-zoomable-preview-of-${src}`} className="h-full w-full object-contain" />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LightboxPopup
