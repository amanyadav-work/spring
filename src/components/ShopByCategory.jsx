
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowRight, LucideArrowUpFromDot, ShoppingBasket } from 'lucide-react'

const ShopByCategory = () => {
    return (
        <section className="mt-7 flex flex-col gap-1">
            <div className='flex justify-between items-center'>
                <h2>Shop By Category</h2>
                <Link to='/shop'>
                    <Button variant="link">View All</Button>
                </Link>
            </div>


            <div className='lg:flex gap-7 mt-4 text-white relative'>
                <div className='lg:w-6/12 bg-yellow-100 rounded-sm flex p-9 relative bg-cover text-white min-h-72  mb-6 lg:mb-0 border' style={{ backgroundImage: "url(https://img.freepik.com/premium-photo/blank-black-t-shirt-design-mockup-wallpapers-hd-wallpapers-style-post-processing-ligh_910325-6029.jpg)", boxShadow: 'inset 1px 1px 100px 53px #000000' }}>
                    
                    <h3 className='text-xl sm:text-xl lg:text-xl font-semibold'>Trendy Apparels</h3>
                    <Link to="/apparels">
                        <Button variant="destructive" className="absolute top-0 right-0 max-w-[300px] rounded-none">Shop Now<ShoppingBasket /></Button></Link>
                </div>
                <div className='lg:w-6/12 grid sm:grid-cols-2 gap-7' >
                    <div className='bg-gray-100 rounded-sm p-9 bg-cover relative min-h-52 border' style={{ backgroundImage: "url(https://t3.ftcdn.net/jpg/01/10/24/34/360_F_110243449_7SHALLFfuzJq2j33dsfRWTElxxKOag9Y.jpg)", boxShadow: 'inset 1px 1px 100px 53px #000000' }}>
                        <h3 className='text-xl sm:text-xl lg:text-xl font-semibold'>Accesories</h3>
                        <Link to="/accesories">
                            <Button variant="outline" className="absolute top-0 right-0 max-w-[300px] rounded-none">Take Look<LucideArrowUpFromDot className='rotate-90' /></Button></Link>

                    </div>
                    <div className='bg-gray-100 rounded-sm p-9 bg-cover relative min-h-52 border' style={{ backgroundImage: "url(https://img.freepik.com/premium-photo/modern-phone-cover-design_1148167-101816.jpg)", boxShadow: 'inset 1px 1px 100px 53px #000000' }}>
                        <h3 className='text-xl sm:text-xl lg:text-xl font-semibold'>Phone Cases</h3>
                        <Link to="/phone-cases">
                            <Button variant="outline" className="absolute top-0 right-0 max-w-[300px] rounded-none">Take Look<LucideArrowUpFromDot className='rotate-90' /></Button></Link>
                    </div>
                    <div className='bg-gray-100 rounded-sm p-9 bg-cover relative min-h-52' style={{ backgroundImage: "url(https://img.freepik.com/premium-photo/photo-school-stationary-items-books-table_763111-29747.jpg)", boxShadow: 'inset 1px 1px 100px 53px #000000' }}>
                        <h3 className='text-xl sm:text-xl lg:text-xl font-semibold'>Stationery</h3>
                        <Link to="/stationery">
                            <Button variant="outline" className="absolute top-0 right-0 max-w-[300px] rounded-none">Take Look<LucideArrowUpFromDot className='rotate-90' /></Button></Link>
                    </div>
                    <div className='bg-gray-100 rounded-sm p-9 bg-cover relative min-h-52 border' style={{ backgroundImage: "url(https://m.media-amazon.com/images/I/712fD7+IeeL._AC_UF1000,1000_QL80_.jpg)", boxShadow: 'inset 1px 1px 100px 53px #000000' }}>
                        <h3 className='text-xl sm:text-xl lg:text-xl font-semibold'>Wall Art</h3>
                        <Link to="/wall-art">
                            <Button variant="outline" className="absolute top-0 right-0 max-w-[300px] rounded-none border">Take Look<LucideArrowUpFromDot className='rotate-90' /></Button></Link>
                    </div>

                </div>
            </div>


            <div>

            </div>
        </section>
    )
}

export default ShopByCategory
