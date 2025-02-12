import { getOrders, updateOrder } from "@/api/apiCartnOrders";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react"
import { CheckSquareIcon, ChevronDown, HouseIcon, Mail, PackageXIcon, Phone, Trash, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderDetailsWithChart from "@/components/CircleChart";
import { BarLoader } from "react-spinners";
import PaginationBar from "@/components/PaginationBar";


const MyOrders = () => {

  const { isLoaded, user } = useUser();
  const { data: dataOrders, loading: loadingOrders, error: errorOrders, fn: fnOrders } = useFetch(getOrders)
  const { data: updatedOrderData, loading: updatingOrder, error: errorUpdatingOrder, fn: fnUpdateOrder } = useFetch(updateOrder);
  const [paginatedProducts, setPaginatedProducts] = useState(null)

  useEffect(() => {

    window.scrollTo(0, 0);
    if (isLoaded && user.id && user.unsafeMetadata.role === "customer") {
      fnOrders(user.id);
    } else {
      fnOrders(false, user.id);

    }
  }, [isLoaded, updatingOrder])

  const calculateDiscount = (price, discount) => {
    price = price - ((discount / 100) * price)
    return Math.round(price)
  }

  const handleCancellation = async (orderId,ProductId, qn) => {
    await fnUpdateOrder({
      id: orderId,
      product_id: ProductId,
      status: 'Cancelled',
    }, qn)

  }
  const handleStatusChange = async (orderId, ProductId, value, qn) => {
    await fnUpdateOrder({
      id: orderId,
      product_id: ProductId,
      status: value,
    }, qn)

  }





  if (!isLoaded || loadingOrders || updatingOrder) {
    return (<BarLoader className='z-10' width="100%" color='yellow' />)
  }

  if (dataOrders?.length === 0) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <PackageXIcon size={80} color='yellow' strokeWidth={1.5} />
      </div>
      <p className='text-sm md:text-xl'>No orders made yet </p>

    </div>
  }

  return (

    (dataOrders) && <>
      <div className="flex justify-center">
        <h1 className='text-4xl mt-8 pt-8 mb-16 border-t uppercase'>My Orders</h1>
      </div>
      <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/"><HouseIcon strokeWidth={1.5} size={16} /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs sm:text-sm">
            <BreadcrumbPage>My Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {user.unsafeMetadata.role === "customer" ?
        <section className="flex flex-col-reverse lg:flex-row gap-3 mt-7 relative">
          <div className="lg:w-8/12 -mt-3 text-left">
            <div className=" ">
              {paginatedProducts?.reverse()?.map(item => {
                const attributes = JSON.parse(item.product_attributes);
                const formattedDate = new Date(item.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const formattedTime = new Date(item.order_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


                return <div key={item.id} className={`shadow-md ${item.status !== "Cancelled" && "p-3 sm:p-6 "}  border border-yellow-[#4f4f4f] md:flex gap-4 text-left md:justify-between items-center pb-3 mt-3 relative`}>

                  {item.status === 'Cancelled' && <div className='absolute top-0 z-20 bg-black bg-opacity-50 backdrop-blur w-full h-full flex items-center justify-center flex-col gap-1'>
                    <Trash color='red' strokeWidth={2} size={25} />
                    <p className="text-xs text-red-700 font-medium"> Order Cancelled</p>
                  </div>}

                  <div className='absolute z-10 top-0 right-0 p-3'>
                    {<Dialog>
                      <DialogTrigger className={`bg-[#010309] rounded-bl p-2 lg:p-0 md:bg-transparent text-xs ${item.status === "Delivered" ? "text-green-600" : "text-red-600"} `} disabled={item.status === "Delivered"}>{item.status === "Delivered" ? "Delivered" : "Cancel"} &nbsp;{item.status === "Delivered" ? <CheckSquareIcon className="inline -mt-1" size={13} /> : <TrashIcon className="inline -mt-1" size={13} />}  </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure you want to cancel?</DialogTitle>
                          <DialogDescription>
                            Cancelling this product will remove it from your order. Once it’s gone, it’s gone!
                            Are you sure you want to cancel this order?
                            <span className="flex gap-3 mt-2.5">
                              <DialogClose asChild>
                                <Button variant="destructive" onClick={() => handleCancellation(item.id,item.product_id, item.quantity)}>I'm Sure</Button>

                              </DialogClose>
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>}

                  </div>

                  <div className={`xs:flex md:w-7/12 gap-7 md:gap-5 items-center relative ${item.status === "Cancelled" && "p-3 sm:p-0 sm:pt-6 sm:pl-6"}`}>
                    <Link className="w-4/12" to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                      <img src={item.products.image_url} alt={`${item.products.name} image`} className="md:w-[150px] rounded-sm" />
                    </Link>
                    <div className="w-full xs:w-8/12 ">
                      <span className='bg-yellow-400 hidden  absolute top-0 xs:top-[unset] xs:relative w-fit text-[9px] xs:text-xs items-center pl-2 pr-2 gap-1 rounded-sm text-black font-bold sm:flex mb-2'>{item.products.sellers.name}'s </span>
                      <Link to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                        <h2 className="text-sm pt-4 xs:pt-0 xs:text-base font-semibold">
                          {item.products.name.length > 64 ? item.products.name.slice(0, 64) + "..." : item.products.name}
                        </h2>

                      </Link>
                      <div className="flex">

                        {Object.entries(attributes).map(([key, value], index) => (
                          <div className="flex text-[13.5px] opacity-45" key={index}>
                            <p>{index !== 0 && "| "}{key}:&nbsp;</p>
                            <p className="pr-1">{value}</p>
                          </div>
                        ))}
                      </div>

                      <Popover>
                        <PopoverTrigger className="p-0 -mt-[2px] mb-1 border-b border-white text-xs opacity-60">Contact Seller</PopoverTrigger>
                        <PopoverContent className="p-0 w-fit border-none">
                          <div className="flex gap-2 text-xs mb-1">
                            <a href={`tel:${item.products.sellers.phone_number}`} className="border-2 rounded-full p-3">
                              <Phone size={14} />
                            </a>
                            <a href={`mailto:${item.products.sellers.email}`} className="border-2 rounded-full p-3">
                              <Mail size={14} />
                            </a>
                          </div>


                        </PopoverContent>
                      </Popover>

                      <div className="flex gap-2 my-1 xs:my-0 items-center">
                        <Popover>
                          <PopoverTrigger className="text-sm pt-1">Order Details <ChevronDown className="inline" size={13} /></PopoverTrigger>
                          <PopoverContent className="p-3">
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order ID:</h3>
                              <p>#{item.id}</p>
                            </div>
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Date:</h3>
                              <p>{formattedDate}</p>
                            </div>
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Time:</h3>
                              <p>{formattedTime}</p>
                            </div>
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Status:</h3>
                              <p>{item.status}</p>
                            </div>
                            {item.note && <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Note:</h3>
                              <p>{item.note}</p>
                            </div>}

                          </PopoverContent>
                        </Popover>


                      </div>

                    </div>
                  </div>
                  <p className="inline-block text-xs xs:text-base md:block w-7/12 md:w-3/12 pt-2 pr-3 md:pt-0 md:pr-0">
                    <p className="inline">Qn:</p> × {item.quantity}
                  </p>
                  <p className="inline-block md:block w-5/12 md:w-2/12 text-xs xs:text-base text-right md:text-left">$ {item.amount}</p>

                </div>

              })}

            </div>
          </div>

          <div className="lg:w-4/12 shadow-md p-6 text-left border border-yellow-[#4f4f4f] lg:sticky h-fit top-20">

            <h2>Your Stats</h2>
            <OrderDetailsWithChart dataOrders={dataOrders} />
            <div className="flex flex-col">
              <div className="pb-5 mt-5 flex items-center justify-center border-b">
                <p className="text-sm "><strong>Total Amount: </strong> $ {dataOrders.reduce((acc, order) => acc + order.amount, 0)}</p>

              </div>
              <div className="pt-3 pb-3 flex items-center justify-between border-b">
                <p className="text-sm"><strong>Cancelled Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status === "Cancelled")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-red-500"></div>
              </div>
              <div className="pt-3 pb-3 flex items-center justify-between border-b">
                <p className="text-sm"><strong>Delivered Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status === "Delivered")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-green-500"></div>
              </div>
              <div className="pt-3 flex items-center justify-between">
                <p className="text-sm"><strong>Pending Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status !== "Delivered" && order.status !== "Cancelled")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-gray-500"></div>
              </div>




            </div>


          </div>
        </section>
        : <section className="flex flex-col-reverse lg:flex-row  gap-3 mt-7 relative">
          <div className="lg:w-8/12 -mt-3 text-left">
            <div className=" ">
              {dataOrders?.reverse()?.map(item => {
                const attributes = JSON.parse(item.product_attributes);
                const formattedDate = new Date(item.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const formattedTime = new Date(item.order_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


                return <div key={item.id} className={`shadow-md p-3 sm:p-6  border-2 ${item.status === "Delivered" ? "border-green-900" : item.status === "Cancelled" && " border-red-900"} md:flex gap-4 text-left md:justify-between items-center pb-3 mt-3 relative`}>

                  <div className={`xs:flex md:w-7/12 gap-7 md:gap-5 items-center relative `}>
                    <Link className="w-4/12" to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                      <img src={item.products.image_url} alt={`${item.products.name} image`} className="md:w-[150px] rounded-sm" />
                    </Link>
                    <div className="w-full xs:w-8/12 ">
                      <Link to={`/shop/${item.products.name?.replace(/[\s\:]+/g, '-').toLowerCase()}:${item.products.id}`}>
                        <h2 className="text-sm pt-4 pr-3 xs:pt-0 xs:text-base font-semibold">
                          {item.products.name.length > 64 ? item.products.name.slice(0, 64) + "..." : item.products.name}
                        </h2>

                      </Link>
                      <div className="flex">

                        {Object.entries(attributes).map(([key, value], index) => (
                          <div className="flex text-[13.5px] opacity-45" key={index}>
                            <p>{index !== 0 && "| "}{key}:&nbsp;</p>
                            <p className="pr-1">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col mt-0.5  text-[13.5px] opacity-70">
                        <p>Qn: × {item.quantity}</p>
                        <p>Amount: $ {item.amount}</p>
                      </div>

                      <div className="flex gap-2 my-1 xs:my-0 items-center">
                        <Popover>
                          <PopoverTrigger className="text-sm pt-1">Order Details <ChevronDown className="inline" size={13} /></PopoverTrigger>
                          <PopoverContent className="p-3">
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order ID:</h3>
                              <p>#{item.id}</p>
                            </div>
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Date:</h3>
                              <p>{formattedDate}</p>
                            </div>
                            <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Time:</h3>
                              <p>{formattedTime}</p>
                            </div>
                            {item.note && <div className="flex gap-2 text-xs mb-1">
                              <h3 className="w-4/12">Order Note:</h3>
                              <p>{item.note}</p>
                            </div>}

                          </PopoverContent>
                        </Popover>


                      </div>
                    </div>
                  </div>

                  <div className="inline-block md:block w-full border mt-3 md:mt-0 md:w-5/12 text-xs xs:text-sm p-5 ">
                    <div className="flex items-start"> <p className="w-[60px]">
                      Name:
                    </p> {item.customer.name}</div>
                    <div className="flex items-start">
                      <p className="w-[60px]">Address:</p>
                      {item.customer.street_address}, {item.customer.city}, {item.customer.state} - {item.customer.zip_code}</div>
                    <div className="flex items-start">
                      <p className="w-[60px]"> Phone:</p>  {item.customer.phone}</div>
                    <div className="flex items-start">
                      <p className="w-[60px]">Email:</p>  {item.customer.email}</div>
                    <div className="flex items-start mt-2">
                      <p className="w-[60px]">Status:</p>

                      <Select className="text-xs xs:text-sm" defaultValue={item.status} onValueChange={(value) => handleStatusChange(item.id, item.product_id, value, item.quantity)} >
                        <SelectTrigger className={`md:w-[125px] ${item.status === "Delivered" ? "border border-green-500 text-green-500" : item.status === "Cancelled" && "border border-red-500 text-red-500"} py-1 px-2 h-fit`} disabled={item.status === "Delivered" || item.status === "Cancelled"}>
                          <SelectValue placeholder={item.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className='cursor-pointer' value="Order Placed">Order Placed</SelectItem>
                          <SelectItem className='cursor-pointer' value="Shipped">Shipped</SelectItem>
                          <SelectItem className='cursor-pointer' value="Delivered">Delivered</SelectItem>
                          <SelectItem className='cursor-pointer' value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                </div>

              })}


            </div>
          </div>

          <div className="lg:w-4/12 shadow-md p-6 text-left border border-yellow-[#4f4f4f] lg:sticky h-fit top-20">

            <h2>Your Stats</h2>
            <OrderDetailsWithChart dataOrders={dataOrders} />
            <div className="flex flex-col">
              <div className="pb-5 mt-5 flex items-center justify-center border-b">
                <p className="text-sm "><strong>Total Amount: </strong> $ {dataOrders.reduce((acc, order) => acc + order.amount, 0)}</p>

              </div>
              <div className="pt-3 pb-3 flex items-center justify-between border-b">
                <p className="text-sm"><strong>Cancelled Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status === "Cancelled")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-red-500"></div>
              </div>
              <div className="pt-3 pb-3 flex items-center justify-between border-b">
                <p className="text-sm"><strong>Delivered Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status === "Delivered")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-green-500"></div>
              </div>
              <div className="pt-3 flex items-center justify-between">
                <p className="text-sm"><strong>Pending Orders Amount: </strong>
                  $ {dataOrders
                    .filter(order => order.status !== "Delivered" && order.status !== "Cancelled")
                    .reduce((acc, order) => acc + order.amount, 0)}</p>
                <div className="w-4 h-4 bg-gray-500"></div>
              </div>




            </div>


          </div>
        </section>
      }
      <PaginationBar productsData={dataOrders} setPaginatedProducts={setPaginatedProducts} itemsPerPage={12} />




    </>
  )
}

export default MyOrders
