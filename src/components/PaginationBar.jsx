import usePagination from "@/hooks/usePagination";
import { useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const PaginationBar = ({ productsData, setPaginatedProducts, itemsPerPage }) => {
    const { paginatedProducts, currentPage: pageNo, getPaginatedProducts } = usePagination(itemsPerPage);
    
    
    useEffect(() => {
        if (productsData && productsData !== undefined) {
            getPaginatedProducts(productsData, 1);
        }
    }, [productsData])

    useEffect(() => {
        window.scrollTo(0, 0);
        if (paginatedProducts) {
            setPaginatedProducts(paginatedProducts) // This will only be triggered when paginatedProducts changes
        }
    }, [paginatedProducts, setPaginatedProducts]);

    return (
        (Math.ceil(productsData?.length / itemsPerPage) !== 1 && productsData && productsData !== undefined) &&
        <Pagination className="my-16">
            <PaginationContent>
                <PaginationItem className="min-w-[98.89px] text-xs sm:text-sm">
                    {pageNo !== 1 && <PaginationPrevious className="cursor-pointer" onClick={() => getPaginatedProducts(productsData, pageNo - 1)} />}
                </PaginationItem>
                {(pageNo !== 1 && pageNo !== 2) && <PaginationItem className=" hidden sm:block">
                    <PaginationEllipsis className="cursor-pointer" onClick={() => getPaginatedProducts(productsData, 1)} />
                </PaginationItem>}
                {pageNo !== 1 && <PaginationItem>
                    <PaginationLink className="hover:bg-transparent cursor-pointer" onClick={() => getPaginatedProducts(productsData, pageNo - 1)}>{pageNo - 1}</PaginationLink>
                </PaginationItem>}
                <PaginationItem>
                    <PaginationLink className="hover:bg-transparent" isActive>{pageNo}</PaginationLink>
                </PaginationItem>
                {pageNo !== Math.ceil(productsData?.length / itemsPerPage) && <PaginationItem>
                    <PaginationLink className="hover:bg-transparent cursor-pointer" onClick={() => getPaginatedProducts(productsData, pageNo + 1)}>{pageNo + 1}</PaginationLink>
                </PaginationItem>}
                {(pageNo !== Math.ceil(productsData?.length / itemsPerPage) - 1 && pageNo !== Math.ceil(productsData?.length / itemsPerPage)) && (
                    <PaginationItem className="hidden sm:block">
                        <PaginationEllipsis className="cursor-pointer" onClick={() => getPaginatedProducts(productsData, Math.ceil(productsData?.length / itemsPerPage))} />
                    </PaginationItem>
                )}

                <PaginationItem className="min-w-[98.89px]">
                    {pageNo !== Math.ceil(productsData?.length / itemsPerPage) && <PaginationNext className="cursor-pointer" onClick={() => getPaginatedProducts(productsData, pageNo + 1)} />}
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}

export default PaginationBar
