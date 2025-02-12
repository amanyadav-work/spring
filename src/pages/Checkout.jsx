import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Anchor, Ghost, LucideArrowUpFromDot, PartyPopper, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteMultipleCartItems, getCartItems, getUserInfo, insertOrder, updateUserInfo } from "@/api/apiCartnOrders"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import { BarLoader, SyncLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDispatch } from 'react-redux'
import { clear } from '../redux/cart/cartSlice'



const schema = z.object({
  'first-name': z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must not exceed 50 characters'),
  'last-name': z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must not exceed 50 characters'),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits'),
  email: z.string().email('Please provide a valid email address'),
  state: z.string().nonempty('State is required'),
  city: z.string().nonempty('City is required'),
  zip: z.string()
    .regex(/^[0-9]{6}$/, 'Zip code must be 6 digits')
    .min(6, 'Zip code must be exactly 6 digits')
    .max(6, 'Zip code must be exactly 6 digits'),
  'street-address': z.string().min(5, 'Street address must be at least 5 characters'),
});



const Checkout = () => {
  const dispatch = useDispatch()
  const [allowEdit, setAllowEdit] = useState(false)
  const [note, setNote] = useState([])
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { data: userData, loading: userLoading, error: userError, fn: fnUser } = useFetch(getUserInfo);
  const { data: updateData, loading: updateLoading, error: updateError, fn: fnUpdate } = useFetch(updateUserInfo);
  const { data: cartData, loading: loadingCart, error: errorCart, fn: fnProduct } = useFetch(getCartItems)
  const { data: insertOrderData, loading: loadingInsertOrder, error: errorInsertOrder, fn: fnInsertOrder } = useFetch(insertOrder)
  const { data: deleteCartItemsData, loading: loadingDeleteCartItems, error: errorDeleteCartItems, fn: fnDeleteCartItems } = useFetch(deleteMultipleCartItems);

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      'first-name': '',
      'last-name': '',
      phone: '',
      email: '',
      state: '',
      city: '',
      zip: '',
      'street-address': ''
    }

  });



  useEffect(() => {
    if (isLoaded && !updateLoading) {
      fnUser(user.id);
      fnProduct();
    }
    window.scrollTo(0, 0);
  }, [isLoaded, updateLoading])

  useEffect(() => {
    if (cartData && cartData.length > 0 && !loadingCart)
      setNote(new Array(cartData.length).fill(null));

  }, [loadingCart])




  useEffect(() => {
    if (userData && userData.length > 0) {
      setAllowEdit(true)
      setValue('first-name', userData[0].name.split(" ")[0]);
      setValue('last-name', userData[0].name.split(" ")[1] || ''); // Assumes the second name exists
      setValue('phone', userData[0].phone || ''); // Use actual values from your data
      setValue('email', userData[0].email || '');
      setValue('state', userData[0].state || '');
      setValue('city', userData[0].city || '');
      setValue('zip', userData[0].zip_code || '');
      setValue('street-address', userData[0].street_address || '');
    }
  }, [userData])



  const onSubmit = async (data) => {
    const updateData = {
      city: data.city,
      customer_id: user.id,
      name: `${data['first-name']} ${data['last-name']}`,
      phone: data.phone,
      state: data.state,
      email: data.email,
      street_address: data['street-address'],
      zip_code: data.zip,
    };
    if (userData && userData.length > 0) {
      // Call the update function
      await fnUpdate(updateData, user.id, true);

    } else {
      await fnUpdate(updateData, user.id, false);

    }
  };


  const calculateDiscount = (price, discount) => {
    price = price - ((discount / 100) * price)
    return Math.round(price)
  }
  const calculateTotalPrice = (orderData) => {
    // Calculate the total price by iterating over each product
    return orderData.reduce((total, item) => {
      const { price, discount } = item.products;


      // Calculate discounted price for the product
      const discountedPrice = calculateDiscount(price, discount);

      // Add the price of the current item to the total
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async() => {
    let idArray = [];
    const orderData = cartData.map((item, i) => {
      idArray.push(item.id); // Pushing the product_id into the array

      // Returning the order object
      return {
        customer_id: user.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product_attributes: item.product_attributes,
        status: "Order Placed",
        amount: calculateDiscount(item.products.price, item.products.discount) * item.quantity,
        note: note[i]
      };
    });

  await  fnInsertOrder(orderData)
    if (!errorInsertOrder) {
    await  fnDeleteCartItems(idArray);
    dispatch(clear())
    }

  }


  const updateNoteAtIndex = (index, newValue) => {
    const updatedNote = [...note]; // Make a copy of the note array
    updatedNote[index] = newValue; // Update the value at the given index
    setNote(updatedNote); // Update state
  };



  if (!isLoaded || userLoading || updateLoading) {
    return <BarLoader className='z-10' width="100%" color='yellow' />;
  }

  if (cartData?.length === 0 || cartData === null) {
    return <div className='text-center place-content-center h-[90vh]'>
      <div className='flex items-center justify-center mb-5'>
        <Anchor size={80} color='yellow' strokeWidth={3} />
      </div>
      <p className='text-sm md:text-xl'>Your Cart is Empty</p>

    </div>
  }


  return (
    (userData && cartData && cartData.length > 0) && <>
      <section className="flex flex-col lg:flex-row gap-8 justify-between ">
        <div className="bg-gray-950 lg:w-7/12 border p-5 rounded-sm">
          <div className="flex justify-between items-center">
            <h2 className="pt-1 pb-3 text-sm sm:text-base">Billing Details</h2>
            <Button variant="link" className="text-xs sm:text-base"><LucideArrowUpFromDot className='-rotate-90' strokeWidth={2.5} /> Back to Cart</Button>
          </div>
          <hr className="mb-6" />
          <div className="flex justify-between">
            <div></div>
            {userData && userData.length > 0 && allowEdit && (<Button variant="ghost" className="text-[9px] sm:text-xs" onClick={() => setAllowEdit(false)}><Pencil size={12} />Edit Details</Button>)}

          </div>
          <form className="relative" onSubmit={handleSubmit(onSubmit)}>
            {userData && userData.length > 0 && allowEdit && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-950 z-10 bg-opacity-60"></div>
            )}
            <div className="flex gap-3">
              <div className="w-full">
                <Label htmlFor="first-name" className="text-xs">First Name</Label>
                <Input id="first-name" placeholder="John" className="text-xs sm:text-base" {...register('first-name')} />
                {errors['first-name'] && <p className="text-xs text-red-500">{errors['first-name'].message}</p>}
              </div>
              <div className="w-full">
                <Label htmlFor="last-name" className="text-xs">Last Name</Label>
                <Input id="last-name" placeholder="Doe" className="text-xs sm:text-base"{...register('last-name')} />
                {errors['last-name'] && <p className="text-xs text-red-500">{errors['last-name'].message}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <div className="w-full">
                <Label htmlFor="phone" className="text-xs">Phone</Label>
                <Input id="phone" placeholder="7900XXXXXX" className="text-xs sm:text-base"{...register('phone')} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="w-full">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" placeholder="abc@gmail.com" className="text-xs sm:text-base"{...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row  gap-3 mt-2">
              <div className="w-full">
                <Label htmlFor="state" className="text-xs">State</Label>
                <Input id="state" placeholder="Enter your state" className="text-xs sm:text-base"{...register('state')} />
                {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
              </div>
              <div className="w-full">
                <Label htmlFor="city" className="text-xs">City</Label>
                <Input id="city" placeholder="Enter your city" className="text-xs sm:text-base"{...register('city')} />
                {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
              </div>
            </div>
            <div className="w-full mt-2">
              <div className="w-full pb-2">
                <Label htmlFor="zip" className="text-xs">Zip Code</Label>
                <Input id="zip" placeholder="110002" className="text-xs sm:text-base"{...register('zip')} />
                {errors.zip && <p className="text-xs text-red-500">{errors.zip.message}</p>}
              </div>
              <Label htmlFor="street-address" className="text-xs">Street Address</Label>
              <Textarea id="street-address" placeholder="123, Main Krook Hotel" className="text-xs sm:text-base"{...register('street-address')} />
              {errors['street-address'] && <p className="text-xs text-red-500">{errors['street-address'].message}</p>}
            </div>
            {!allowEdit && <div className="sm:flex gap-3 mt-2">
              <Button variant="outline" type="submit" disabled={updateLoading}>Submit</Button>
              {(userData && userData.length > 0) && <Button variant="outline" onClick={() => setAllowEdit(true)} disabled={updateLoading}>Cancel</Button>}
              <p className="text-xs opacity-70 mt-3">*These details will also be saved for the next time you place an order!!</p>
            </div>}
          </form>


        </div>
        <div className=" lg:w-5/12 border p-5">
          <p>Order Summary:</p>
          <hr className="mb-6 mt-3.5" />
          {cartData.map((item, i) => {
            const attributes = JSON.parse(item.product_attributes);
            return <div key={item.id}>
              <div className="flex justify-between items-center">
                <div className="w-8/12">
                  <h3 className="text-sm">
                    {item.products.name.length > 39
                      ? item.products.name.substring(0, 39) + '...'
                      : item.products.name}
                  </h3>
                  <div className="flex">
                    {Object.entries(attributes).map(([key, value], index) => (
                      <div className="flex text-[13.5px] opacity-45" key={index}>
                        <p>{index !== 0 && "| "}{key}:&nbsp;</p>
                        <p className="pr-1">{value}</p>
                      </div>
                    ))}
                    <Popover>
                      <PopoverTrigger className="text-xs border-b hover:border-yellow-300 ml-2 mt-0.5 opacity-45">Add note</PopoverTrigger>
                      <PopoverContent className="border-none ">
                        <Input className="p-5"
                          type="text"
                          value={note[i]} // bind input to the corresponding index in note
                          onChange={(e) => updateNoteAtIndex(i, e.target.value)} // update note at index i
                          placeholder={`Enter delivery note for this item`}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="text-xs"><span className="text-base">× </span>{item.quantity}</div>
                <div className="">$ {calculateDiscount(item.products.price, item.products.discount) * item.quantity}</div>
              </div>
              <hr className="mb-3.5 mt-3.5 border-t border-gray-900" />
            </div>
          })}
          <div className="text-base flex justify-between pb-4 mb-[0.8px]">
            <p>Total <sub>(+ $8 Delivery Fee)</sub></p>
            <p className="text-lg lg:text-xl font-semibold ">  <span className="text-yellow-300">$ </span>{calculateTotalPrice(cartData) + 8}</p>
          </div>


          <hr className="mb-3.5 mt-3.5" />
          <div className="sm:flex justify-between items-center">
            <p className="sm:pb-0 sm:text-base text-sm pb-3">Payment Options:</p>
            <RadioGroup defaultValue="cash-on-delivery">
              <div className="flex items-center space-x-2">

                <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                <Label htmlFor="cash-on-delivery" className="text-xs sm:text-base">Cash On Delivery</Label>

              </div>

            </RadioGroup>
          </div>
          <hr className="mb-3.5 mt-3.5" />
          <p className="text-xs opacity-70 mt-3">*The payment should be made to delivery agent at the time of arrival.</p>
          <Dialog>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4 bg-yellow-300 text-sm font-medium" onClick={handlePlaceOrder} disabled={insertOrderData}>
              {insertOrderData ? ("Order Placed ") : "Place Order "}
              {!insertOrderData && <LucideArrowUpFromDot className='rotate-90' strokeWidth={2.5} />}
            </DialogTrigger>
            <DialogContent>
              {loadingInsertOrder ? (<SyncLoader speedMultiplier={1.1} style={{ display: "block !important" }} className='z-10 place-content-center text-center min-h-[50vh] sticky' width="100%" color='#fde047' />) :
                (errorInsertOrder ? (<DialogHeader className="flex justify-center items-center text-center">
                  <Ghost size="40%" color="yellow" fill="" />
                  <DialogTitle className="text-xl md:text-2xl pt-5">Something Unexpected Happened</DialogTitle>
                  <DialogDescription>Please Try Again Later</DialogDescription>
                </DialogHeader>) :
                  (<DialogHeader className="flex justify-center items-center text-center">
                    <PartyPopper size="40%" color="yellow" fill="" />
                    <DialogTitle className="text-xl md:text-3xl pt-5">Order Placed Successfully</DialogTitle>
                    <DialogDescription className="w-3/4">
                      <Button className='w-full mt-3 bg-yellow-300 text-sm font-medium' onClick={() => { navigate('/my-orders') }}>View All Orders <LucideArrowUpFromDot className='rotate-90' strokeWidth={2.5} /></Button>
                    </DialogDescription>
                  </DialogHeader>))

              }
            </DialogContent>
          </Dialog>


        </div>

      </section>



      <section className="mt-7">
        <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-y-[40px] gap-4 p-5 pt-7 pb-7  bg-opacity-90 place-items-center rounded-sm">
          <div className="flex flex-col gap-2 text-center justify-center items-center max-w-[250px] align-middle">
            <img src="https://www.redbubble.com/boom/client/11e577ece42959a779dad50443e2640d.svg" className='' alt="features-we-offer" width={100} />
            <h2 className='text-lg font-medium'>All India Shipping</h2>
            <p className='text-sm mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <Button variant="outline" className="text-base bg-transparent ">Learn More</Button>
          </div>
          <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
            <img src="https://www.redbubble.com/boom/client/4399b2507b789bbd378c3fbe71e23b16.svg" alt="features-we-offer" width={100} />
            <h2 className='text-lg font-medium'>Secure Payments</h2>
            <p className='text-sm mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <Button variant="outline" className="text-base bg-transparent ">Learn More</Button>
          </div>
          <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
            <img src="https://www.redbubble.com/boom/client/d13bc377413e95979719bf36f522db21.svg" alt="features-we-offer" width={100} />
            <h2 className='text-lg font-medium'>Free Return</h2>
            <p className='text-sm mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <Button variant="outline" className="text-base bg-transparent ">Learn More</Button>
          </div>
          <div className="flex flex-col gap-1 text-center justify-center items-center max-w-[250px] align-middle">
            <img src="https://www.redbubble.com/boom/client/bd7df1563ed67eaef3fc82b2a423dffd.svg" alt="features-we-offer" width={100} />
            <h2 className='text-lg font-medium'>Local Support</h2>
            <p className='text-sm mb-2 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <Button variant="outline" className="text-base bg-transparent ">Learn More</Button>
          </div>


        </div>
      </section>
    </>
  )
}

export default Checkout
