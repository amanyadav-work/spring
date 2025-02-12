import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HouseIcon, Image, Pencil, PlusSquareIcon } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import { getAllAttributes, getCategory, insertAttribute, insertProduct, insertSecondaryImgs } from "@/api/apiProducts"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from "react-hook-form"; // Import Controller
import { BarLoader, SyncLoader } from "react-spinners"
import { toast } from "sonner"
import MDEditor from "@uiw/react-md-editor"
import { useNavigate } from "react-router-dom"


// Define Zod validation schema
const attributeSchema = z.object({
  name: z
    .string()
    .min(1, 'Attribute Name is required')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Attribute Name cannot contain special characters or commas'),
  values: z
    .string()
    .min(1, 'Attribute Values are required')
    .regex(/^[^,]+(,[^,]+)*$/, 'Values must be separated by commas'),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product Name is required').max(100, 'Product Name is too long'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().min(1, 'Sub Category is required'),
  price: z.string().min(1, 'Price is required'),
  discount: z.string().min(0, 'Discount must be at least 0').max(2, 'Discount cannot be or exceed 100'),
  stock: z.string().min(1, 'Stock Availability is required'),
  shortDescription: z.string().min(1, 'Short Description is required'),
  longDescription: z.string().min(1, 'Long Description is required')
});

const AddProducts = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors },reset } = useForm({
    resolver: zodResolver(attributeSchema),
  });
  const { register: productRegister, handleSubmit: productSubmit, formState: { errors: productFormErrors }, control: productControl, reset:productReset, setValue } = useForm({
    resolver: zodResolver(productSchema),
  });
  const { data: catData, loading: catLoading, error: catError, fn: fnCat } = useFetch(getCategory);
  const { data: allAttributesData, loading: allAttributesLoading, error: allAttributesError, fn: fnAllAttributes } = useFetch(getAllAttributes);
  const { data: insertedProductData, loading: insertProductLoading, error: insertProductError, fn: insertProductFn } = useFetch(insertProduct);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [secondaryImgs, setSecondaryImgs] = useState(null);
  const [drawerSubmit, setDrawerSubmit] = useState(null);
  const { data: insertAttData, loading: insertAttLoading, error: insertAttError, fn: fnInsertAtt } = useFetch(insertAttribute);
  const { data: secondaryImgsData, loading: secondaryImgsLoading, error: secondaryImgsError, fn: fetchSecondaryImgs } = useFetch(insertSecondaryImgs);
  const { user, isLoaded } = useUser();
  const [subCat, setsubCat] = useState(null)
  const [checkBox, setCheckBox] = useState([])

  useEffect(() => {
    fnCat();
    fnAllAttributes()

  }, [isLoaded])
  useEffect(() => {

    if (!insertAttLoading) {

      fnAllAttributes()
    }

  }, [isLoaded, insertAttLoading])

  useEffect(() => {
    if (allAttributesData) {
      const initialAttributes = Object.fromEntries(
        Object.keys(allAttributesData).map(attribute => [attribute, []])
      );
      setCheckBox(initialAttributes);
    }
  }, [allAttributesData]); // Trigger whenever `allAttributesData` changes




  useEffect(() => {
    window.scrollTo(0, 0);
    const executeAfterFinish = async () => {
      if (insertedProductData && !insertProductLoading) {
      
        await fetchSecondaryImgs(secondaryImgs, insertedProductData, Object.values(checkBox)
          .flat()
          .map(value => ({
            product_id: insertedProductData,
            attribute_id: value
          })));
          if (secondaryImgsError) {
            toast.error("An error occurred while adding product", {
            });
          } else {
            toast.success("Product added successfully!", {
              action: {
                label: "View All Products",
                onClick: () => {
                  navigate('/my-products')
                },
              }, 
            });
          }
          productReset();
          setFiles([]); // Reset the state
          setFilePreviews([]); // Reset the previews
          setSecondaryImgs(null)
      }
    }
    executeAfterFinish();
  }, [insertProductLoading]); // Trigger whenever `allAttributesData` changes




  // Handle file selection
  const handleFileChange = (event) => {
    setFiles([]); // Reset the state
    setFilePreviews([]); // Reset the previews

    const selectedFiles = Array.from(event.target.files);
    const validFiles = [];
    const previews = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Create an image element using HTMLImageElement to check the dimensions
        const img = new window.Image();
        img.src = reader.result;

        img.onload = () => {
          const { width, height } = img;

          if (width === 624 && height === 832) {
            // If dimensions are correct, add to valid files

            setFiles((prevFiles) => [...prevFiles, file]); // Spread operator to add files to previous files
            setFilePreviews((prevPreviews) => [...prevPreviews, reader.result]); // Spread operator to add previews

            previews.push(reader.result);
          } else {
            toast(`Image ${file.name} removed due to invalid dimensions (should be 624x832).`, {
              description: "Make sure to choose the right dimensions",
            });
            alert("For Testing, You can take images from The Souled Store Website and upload here");
          }


        };
      };

      reader.readAsDataURL(file); // Read the file as a Data URL
    });
  };


  const handleCategory = async (catId) => {
  
    setsubCat(catData.find(cat => catId === cat.id).subcategories)

  }

  const handleCheck = (isChecked, attribute, id) => {


    // Make a copy of the current state and update accordingly
    setCheckBox(prevCheckBox => {
      const newCheckBox = { ...prevCheckBox }; // Create a copy of the state

      if (isChecked) {
        // Push the id into the array if checked
        newCheckBox[attribute] = [...newCheckBox[attribute], id];
      } else {
        // Pop the id from the array if unchecked
        newCheckBox[attribute] = newCheckBox[attribute].filter(item => item !== id);
      }

      return newCheckBox;
    });

  };

  const handleAddAttribute = async (data) => {
   
    const { name, values } = data;
    const capitalizedName = name
      .toLowerCase()  // Convert the whole string to lowercase first
      .replace(/\b\w/g, char => char.toUpperCase());
    const valuesArray = values.split(',').map(value => value.trim()); // .trim() to remove extra spaces

    // Prepare the bulk insert data
    const insertData = valuesArray.map(value => ({
      name: capitalizedName,
      value, // The different value for each entry
    }));
 
    await fnInsertAtt(insertData)
  
      reset()

  };
 
  const handleProductSubmit = async (data) => {

    setSecondaryImgs(files.slice(1));
    await insertProductFn(files[0], data, user.id, Object.values(checkBox).flat())
   if(!insertProductError){
     setDrawerSubmit(false)
    if (allAttributesData) {
      const initialAttributes = Object.fromEntries(
        Object.keys(allAttributesData).map(attribute => [attribute, []])
      );
      setCheckBox(initialAttributes);
    }
   }
  }



  if (!isLoaded || insertProductLoading || secondaryImgsLoading) {
    return <BarLoader className='z-10' width="100%" color='yellow' />;
  }


  return (
    (catData && allAttributesData && !insertProductLoading ) && <>
      <div className="flex justify-center">
        <h1 className='text-4xl mt-8 pt-8 mb-16 border-t uppercase'>Add Products</h1>
      </div>
      <Breadcrumb className="bg-gray-600 bg-opacity-25 p-2 pl-4 mt-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/"><HouseIcon strokeWidth={1.5} size={16} /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-xs sm:text-sm">
            <BreadcrumbPage>Add A Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section>
        <form onSubmit={productSubmit(handleProductSubmit)} className="flex flex-col lg:flex-row gap-10  mt-7 relative">

          <div className="lg:w-8/12  text-left lg:sticky h-fit top-28 ">

            <h2 className="border-b pb-2 mb-4">Add your products details here</h2>
            <div className="w-full pb-3">
              <Label htmlFor="name" className="text-xs">Product Name *</Label>
              <Input id="name" placeholder="Enter your product name here"  className="text-xs lg:text-sm"  {...productRegister("name")} />
              {productFormErrors.name && <p className="text-red-500 text-xs">{productFormErrors.name.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pb-3">
              <div className="w-full">
                <Label htmlFor="category" className="text-xs">Category *</Label>
                <Controller
                  name="category"  // The field name should match the one in your Zod schema
                  control={productControl}  // Control from useForm hook
                  render={({ field }) => (
                    <Select value={field.value} {...field} onValueChange={(value) => { handleCategory(value); field.onChange(value) }}>
                      <SelectTrigger  className="text-xs lg:text-sm" >
                        <SelectValue  placeholder="Select A Category" >
                          {field.value ? catData?.find((cat) => cat.id === Number(field.value)).name : "Some Error Occured"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {catData && catData.map(cat => (
                          <SelectItem className="cursor-pointer" key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {productFormErrors.category && (
                  <p className="text-red-500 text-xs">{productFormErrors.category.message}</p>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="subCategory" className="text-xs">Sub Category *</Label>
                <Controller
                  name="subCategory"  // The field name should match the one in your Zod schema
                  control={productControl}  // Control from useForm hook
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={!subCat}>
                      <SelectTrigger  className="text-xs lg:text-sm" >
                        <SelectValue placeholder="Select A Sub Category" >

                          {field.value && subCat.find(subcat => subcat.id === Number(field.value)).name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {subCat && subCat.map(subcat => {
                          return <SelectItem className="cursor-pointer" value={subcat.id} key={subcat.id}>{subcat.name}</SelectItem>
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {productFormErrors.subCategory && (
                  <p className="text-red-500 text-xs">{productFormErrors.subCategory.message}</p>
                )}
              </div>

              <div className="w-full pb-3">
                <Label htmlFor="price" className="text-xs">Price *</Label>
                <Input id="price" type="number" placeholder="Undiscounted price in dollars"  className="text-xs lg:text-sm"  {...productRegister("price")} />
                {productFormErrors.price && <p className="text-red-500 text-xs">{productFormErrors.price.message}</p>}
              </div>

            </div>

            <div  className="flex flex-col xs:flex-row gap-4 pb-3">

              <div className="w-full">
                <Label htmlFor="discount" className="text-xs">Discount (Optional)</Label>
                <Input min={0} id="discount" type="number" placeholder="Discount in percentage"   className="text-xs lg:text-sm" {...productRegister("discount")} />
                {productFormErrors.discount && (<p className="text-red-500 text-xs">{productFormErrors.discount.message}</p>)}
              </div>

              <div className="w-full">
                <Label htmlFor="stock" className="text-xs">Stock Available *</Label>
                <Input id="stock" type="number" placeholder="Stock in numbers"  className="text-xs lg:text-sm"  {...productRegister("stock")} />
                {productFormErrors.stock && (<p className="text-red-500 text-xs">{productFormErrors.stock.message}</p>)}
              </div>


              <div className="w-full place-content-end">
                <Drawer>
                  <DrawerTrigger className="py-[9.4px] w-full border px-5 text-xs flex gap-1.5 items-center justify-center">{drawerSubmit ? <Pencil size={12} />: <PlusSquareIcon size={12}/>}{drawerSubmit ? "Edit Attributes" : "Add Attributes"}</DrawerTrigger>
                  <DrawerContent>
                    {insertAttLoading ?
                      <SyncLoader speedMultiplier={1.1} className='z-10 place-content-center items-center text-center min-h-[50vh] sticky' width="100%" color='#fde047' />

                      : <DrawerHeader>
                        <DrawerTitle>Add or Select Attributes</DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                        <div className="flex flex-col md:flex-row gap-6 justify-between">


                          <div className="md:w-8/12 border-2 p-6 place-content-center">
                            <Tabs defaultValue={Object.keys(allAttributesData)[0]} >
                              <TabsList>
                                {/* Dynamically create Tab Triggers for each attribute */}
                                {Object.entries(allAttributesData).map(([attribute, values]) => (
                                  <TabsTrigger value={attribute} key={attribute}>
                                    {attribute}
                                  </TabsTrigger>
                                ))}
                              </TabsList>

                              {/* Dynamically create Tab Contents for each attribute */}
                              {Object.entries(allAttributesData).map(([attribute, values]) => (

                                <TabsContent value={attribute} key={attribute} className="sm:p-1 h-[30vh] overflow-scroll sm:overflow-auto sm:h-[unset pt-3 sm:pt-0">
                                  <span className="grid grid-cols-2 sm:flex flex-wrap gap-6">
                                    {/* Map through each value in the attribute and render a checkbox */}
                                    {values.map(pair => (
                                      <span key={pair.id} className="flex items-center sm:my-2">
                                        <Checkbox className="h-6 w-6"  value={pair.value} id={pair.id} onCheckedChange={(value) => handleCheck(value, attribute, pair.id)} checked={checkBox[attribute]?.includes(pair.id) || false} />
                                        <Label className="cursor-pointer pl-2" htmlFor={pair.id}>{pair.value}</Label>
                                      </span>
                                    ))}

                                  </span>
                                </TabsContent>
                              ))}
                            </Tabs>





                          </div>


                          <div className="md:w-4/12 ">
                            <form onSubmit={handleSubmit(handleAddAttribute)}>
                              {/* Attribute Name */}
                              <div className="pb-3">
                                <Label htmlFor="name" className="text-xs">Attribute Name *</Label>
                                <Input  className="text-xs lg:text-sm" 
                                  id="name"
                                  placeholder="Model, Version, etc"
                                  {...register('name')}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                              </div>

                              {/* Attribute Values */}
                              <div className="pb-3">
                                <Label htmlFor="values" className="text-xs">Attribute Value (Please Separate Multiple values with comma) *</Label>
                                <Input className="text-xs lg:text-sm" 
                                  id="values"
                                  placeholder="GT 13x, Ver 2.01, etc"
                                  {...register('values')}
                                />
                                {errors.values && <p className="text-xs text-red-500">{errors.values.message}</p>}
                              </div>

                              {/* Add New Attribute Button */}
                              <Button variant="outline" className="text-xs" type="submit">
                                Add New Attribute
                              </Button>
                            </form>
                          </div>
                        </div>
                      </DrawerHeader>}
                    <DrawerFooter >
                      <DrawerClose asChild>
                        <Button disabled={Object.values(checkBox).every(arr => arr.length === 0) || insertAttLoading} onClick={() => setDrawerSubmit(true)}>Submit</Button>
                      </DrawerClose>
                      <DrawerClose asChild>
                        <Button disabled={insertAttLoading} variant="outline" onClick={() => {
                          setCheckBox(Object.fromEntries(
                            Object.keys(allAttributesData).map(attribute => [attribute, []])
                          )); setDrawerSubmit(false)
                        }}>Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

              </div>

            </div>

            <div className="w-full pb-3">
              <Label htmlFor="short-description" className="text-xs">Short Description *</Label>
              <Textarea id="short-description" placeholder="Enter a brief description"   className="text-xs lg:text-sm"  {...productRegister("shortDescription")} />
              {productFormErrors.shortDescription && (<p className="text-red-500 text-xs">{productFormErrors.shortDescription.message}</p>)}
            </div>

            <div className="w-full pb-3">
              <Label htmlFor="long-description" className="text-xs">Long Description *</Label>
              <Controller
                name="longDescription" // Field name for React Hook Form
                control={productControl} // Pass control to the Controller
                render={({ field }) => (
                  <MDEditor  className="text-xs lg:text-sm" 
                    {...field} // Spread field to connect it with React Hook Form
                    value={field.value} // Controlled value
                    onChange={(newValue) => field.onChange(newValue)} // Handle changes to field value
                  />
                )}
              />
              {productFormErrors.longDescription && (<p className="text-red-500 text-xs">{productFormErrors.longDescription.message}</p>)} </div>
            <Button type="submit" className="bg-yellow-300" disabled={files.length < 4} >Add Product</Button>
          </div>

          <div className="lg:w-4/12 xs:shadow-md xs:p-6 text-left xs:border xs:border-yellow-[#4f4f4f] ">

            {/* Display image thumbnails */}
            {filePreviews.length > 0 ? <div className="grid grid-cols-3 gap-5 pb-6 ">
              {filePreviews?.map((preview, index) => {
                if (index === 0) {
                  return <div key={index} className="col-span-3 border relative" >
                    <p className="absolute top-0 bg-yellow-300 text-black text-sm font-semibold py-1 px-3">Featured <Image className="inline -mt-0.5 pl-1" size={18} /> </p>
                    <img src={preview} alt={`preview-${index}`} className=" w-full rounded-sm object-cover" />
                  </div>
                } else {
                  return <img key={index} src={preview} alt={`preview-${index}`} className="w-full rounded-sm border aspect-square object-cover" />
                }
              })}</div>
              :
              <img className="border mb-5 bg-yellow-200 rounded-sm opacity-80" src="https://previews.123rf.com/images/rastudio/rastudio1608/rastudio160800122/60754884-male-t-shirt-sketch-icon-for-web-mobile-and-infographics-hand-drawn-vector-isolated-icon.jpg" />}


            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="cursor-pointer">Choose Product Images *</Label>
              <Input className="cursor-pointer text-xs lg:text-sm" 
                id="picture"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp" 
                onChange={handleFileChange} // Update files in state
                required />
              {files.length < 4 && <p className="text-xs ">Please Upload at least 4 images. The first one will be selected as featured image</p>}

              {/* Display uploaded file names */}
              <div className="mt-2 text-sm">
                {files.length > 0 && (
                  <ul>
                    {files.map((file, index) => (
                      index === 0 ? <div className="flex justify-between w-full">
                        Featured Image:<li key={index}> {file.name}</li> </div> :

                        <div className="flex justify-between w-full">
                          Secondary:
                          <li key={index}>{file.name}</li>
                        </div>
                    ))}
                  </ul>
                )}
              </div>


            </div>

          </div>
        </form >
      </section >

    </>
  )
}

export default AddProducts
