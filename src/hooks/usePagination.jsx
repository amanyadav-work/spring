import { useState } from "react";

const usePagination = (itemsPerPage=0) => {

    const [paginatedProducts, setPaginatedProducts] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    function getPaginatedProducts(productsData,value) {
      
        const startIndex = (value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentPage(value)
        console.log("Paginated", productsData.slice(startIndex, endIndex));
        setPaginatedProducts(productsData.slice(startIndex, endIndex))
    }
    return {paginatedProducts, currentPage, getPaginatedProducts}
}

export default usePagination 
