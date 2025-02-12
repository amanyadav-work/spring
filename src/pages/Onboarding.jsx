import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from "@/components/ui/textarea";
import { insertSeller, updateUserInfo } from "@/api/apiCartnOrders";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

const sellerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(10, 'Phone number must only 10 digits'),
    address: z.string().min(1, 'Address is required'),
})

// Define the Zod validation schema for Customer
const customerSchema = z.object({
    customerFullName: z.string().min(1, 'Full name is required'),
    customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    customerEmail: z.string().email('Invalid email address'),
    customerState: z.string().min(1, 'State is required'),
    customerCity: z.string().min(1, 'City is required'),
    customerZipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
    customerStreetAddress: z.string().min(1, 'Street address is required'),
})

const Onboarding = () => {

    const { user, isLoaded } = useUser()
    const navigate = useNavigate()
    const { data: insertData, loading: insertLoading, error: insertError, fn: fnInsert } = useFetch(updateUserInfo);
    const { data: insertSellerData, loading: insertSellerLoading, error: insertSellerError, fn: fnSellerInsert } = useFetch(insertSeller);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(sellerSchema),
    })
    const {
        register: customerRegister,
        handleSubmit: customerSubmit,
        formState: { errors: customerError },
        reset: customerReset,
    } = useForm({
        resolver: zodResolver(customerSchema),
    })

    const handleUserRole = async (role) => {
        await user.update({
            unsafeMetadata: { role },
        }).then(() => {
            navigate(role === "customer" ? "/shop" : "/add-product")
        }).catch((error) => {
            console.log("Error Adding Role", error);
        })
    }


    const onSellerSubmit = async(data) => {
    
           
        const insertData = {
            seller_id: user.id,
            name: data.name,
            phone_number: data.phone,
            email: data.email,
            address: data.address,
          };
          await fnSellerInsert(insertData)
         if(!insertSellerError){
            reset()
            toast.success("Seller Account Created", {
           });
           handleUserRole("seller")
        }  
    }


    const onCustomerSubmit = async(data) => {      
     
        const insertData = {
            city: data.customerCity,
            customer_id: user.id,
            name: data.customerFullName,
            phone: data.customerPhone,
            state: data.customerState,
            email: data.customerEmail,
            street_address: data.customerStreetAddress,
            zip_code: data.customerZipCode,
          };
          await fnInsert(insertData, user.id, false);
           if(!insertError){
               customerReset()
               toast.success("Customer Account Created", {
              });
              handleUserRole("customer")
           }  

    }

    useEffect(() => {
        window.scrollTo(0, 0);
        user?.unsafeMetadata?.role && navigate(user?.unsafeMetadata?.role === "customer" ? "/shop" : "/add-product")
    }, [user])

    if (!isLoaded || insertSellerLoading || insertLoading) {
        return (<BarLoader className='z-10' width="100%" color='yellow' />)
    }

    return (
        <>{(!user.unsafeMetadata.role && !insertSellerLoading && !insertLoading) &&
            <div className="flex flex-col items-center justify-center min-h-[85vh]">
                <h1 className="text-4xl pb-5 font-semibold">I am a...</h1>
                <Tabs defaultValue="account" className="w-[500px] ">
                    <TabsList className="grid w-full grid-cols-2"  defaultValue="customer">
                        <TabsTrigger value="customer">Customer</TabsTrigger>
                        <TabsTrigger value="seller">Seller</TabsTrigger>
                    </TabsList>
                    <TabsContent value="customer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fill Customer Details</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={customerSubmit(onCustomerSubmit)}>
                                <CardContent className="space-y-2">
                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <Label htmlFor="customerFullName">Full Name *</Label>
                                        <Input id="customerFullName" {...customerRegister('customerFullName')} value={user.fullName} disabled/>
                                        {customerError.customerFullName && <p className="text-red-500 text-sm">{customerError.customerFullName.message}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-1">
                                        <Label htmlFor="customerPhone">Phone Number *</Label>
                                        <Input id="customerPhone" {...customerRegister('customerPhone')} />
                                        {customerError.customerPhone && <p className="text-red-500 text-sm">{customerError.customerPhone.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <Label htmlFor="customerEmail">Email *</Label>
                                        <Input id="customerEmail" type="email" {...customerRegister('customerEmail')} value={user.primaryEmailAddress.emailAddress} disabled/>
                                        {customerError.customerEmail && <p className="text-red-500 text-sm">{customerError.customerEmail.message}</p>}
                                    </div>

                                    {/* State, City, and Zip Code in a Row */}
                                    <div className="flex space-x-4">
                                        {/* State */}
                                        <div className="space-y-1 w-1/3">
                                            <Label htmlFor="customerState">State *</Label>
                                            <Input id="customerState" {...customerRegister('customerState')} />
                                            {customerError.customerState && <p className="text-red-500 text-sm">{customerError.customerState.message}</p>}
                                        </div>

                                        {/* City */}
                                        <div className="space-y-1 w-1/3">
                                            <Label htmlFor="customerCity">City *</Label>
                                            <Input id="customerCity" {...customerRegister('customerCity')} />
                                            {customerError.customerCity && <p className="text-red-500 text-sm">{customerError.customerCity.message}</p>}
                                        </div>

                                        {/* Zip Code */}
                                        <div className="space-y-1 w-1/3">
                                            <Label htmlFor="customerZipCode">Zip Code *</Label>
                                            <Input id="customerZipCode" {...customerRegister('customerZipCode')} />
                                            {customerError.customerZipCode && <p className="text-red-500 text-sm">{customerError.customerZipCode.message}</p>}
                                        </div>
                                    </div>

                                    {/* Street Address */}
                                    <div className="space-y-1">
                                        <Label htmlFor="customerStreetAddress">Street Address *</Label>
                                        <Textarea id="customerStreetAddress" {...customerRegister('customerStreetAddress')} />
                                        {customerError.customerStreetAddress && <p className="text-red-500 text-sm">{customerError.customerStreetAddress.message}</p>}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button type="submit" disabled={insertLoading}>Save Changes</Button>
                                </CardFooter>
                            </form>
                        </Card>

                    </TabsContent>
                    <TabsContent value="seller">
                        <Card>
                            <CardHeader>
                                <CardTitle>Seller Information</CardTitle>
                                <CardDescription>
                                    Please fill in the information below, including your password change details.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit(onSellerSubmit)}>
                                <CardContent className="space-y-2">
                                    {/* Name */}
                                    <div className="space-y-1">
                                        <Label htmlFor="name" >Brand Name *</Label>
                                        <Input id="name" {...register('name')} />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" type="email" {...register('email')} value={user.primaryEmailAddress.emailAddress} disabled/>
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input id="phone" {...register('phone')} />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1">
                                        <Label htmlFor="address">Full Address *</Label>
                                        <Textarea id="address" {...register('address')} />
                                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                                    </div>


                                </CardContent>

                                <CardFooter>
                                    <Button type="submit" disabled={insertSellerLoading}>Save Information</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
                {/* <div className="flex gap-4 mt-5">

                    <Button className="w-6/12" onClick={() => handleUserRole("customer")}>Customer</Button>
                    <Button variant="destructive" className="w-6/12" onClick={() => handleUserRole("seller")}>Seller</Button>
                </div> */}
            </div>}
        </>
    )
}

export default Onboarding
