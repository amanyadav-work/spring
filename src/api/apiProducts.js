import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getProducts(token, _, categoryId, subcategoryId, searchQuery, showOnlyStocked, subCatName, arePopular) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('products').select('*,subcategories(id,name),categories(id,name),wishlist_products(id)')

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    if (subCatName) {
        query = query.eq('subcategories.name', subCatName);
    }

    if (subcategoryId) {
        query = query.eq('sub_category_id', subcategoryId);
    }
    if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`)
    }
    if (showOnlyStocked) {
        query = query.gt('stock_quantity', 0)
    }

    const { data, error } = await query;
    data.sort((a, b) => b.id - a.id) 

    if (subCatName) {
        const filteredData = data.filter(product =>
            product.subcategories && product.subcategories.name === subCatName
        )
        return filteredData
    }
    if (arePopular) {
        console.log(arePopular);

        const popularSort = data.slice().sort((a, b) => b.view_count - a.view_count)
        return popularSort
    }


    if (error) {
        console.log("Error Fetching Products: ", error);
        return null
    }

    return data

}







export async function getCategory(token, _, catID, catName) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('categories').select('*, subcategories(*)')

    if (catID) {
        query = query.eq('id', catID)
    }
    if (catName) {
        query = query.eq('name', catName)
    }

    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching Categories: ", error);
        return null
    }

    return data

}




export async function getProductDetails(token, _, productId) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('products')
        .select('*, product_secondary_imgs(secondary_img_url),sellers(*), subcategories(name),wishlist_products(id)')
        .eq('id', productId)


    if (error) {
        console.log("Error Fetching Individual Product Details: ", error);
        return null;
    }

    // Increment the view_count
    const updatedViewCount = data[0].view_count + 1;

    // Update the product's view_count in the database
    const { } = await supabase
        .from('products')
        .update({ view_count: updatedViewCount })
        .eq('id', productId);



    return data
}










export async function getAllSubCatProducts(token, _, catName) {
    const supabase = await supabaseClient(token);

    // Query to fetch all products with categories and subcategories, filtered by catName
    let query = supabase
        .from('products')
        .select('*, categories(name), subcategories(name,id),wishlist_products(id)')
        .eq('categories.name', catName);  // Filtering by category name (catName)

    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching Sub Cat Products: ", error);
        return null;
    }

    // Now filter products by ensuring they belong to subcategories under the selected catName
    const filteredData = data.filter(product => {
        return product.categories?.name === catName; // Ensure product's category matches catName
    });

    // Group products by subcategory name
    const groupedData = filteredData.reduce((acc, product) => {
        const subcategoryName = product.subcategories?.name;

        if (subcategoryName) {
            if (!acc[subcategoryName]) {
                acc[subcategoryName] = [];
            }
            acc[subcategoryName].push(product);
        }

        return acc;
    }, {});

    // Convert grouped data into an array format to return
    const result = Object.keys(groupedData).map(subcategory => ({
        subcategory: subcategory,
        products: groupedData[subcategory],
    }));

    return result;
}





export async function getProductAttributes(token, _, productId) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('product_attributes').select('*,attributes(*)').eq('product_id', productId);

    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching Attributes: ", error);
        return null;
    }

    // Group attributes by name and store id-value pairs
    const groupedAttributes = {};

    data.forEach(item => {
        const attributeName = item.attributes.name;
        const attributeValue = item.attributes.value;
        const valueId = item.attributes.id; // Assuming id is available from attributes table

        // If the attribute name doesn't exist in the groupedAttributes object, initialize it
        if (!groupedAttributes[attributeName]) {
            groupedAttributes[attributeName] = [];
        }

        // Add the id-value pair to the corresponding group
        groupedAttributes[attributeName].push({
            id: valueId,
            value: attributeValue
        });
    });

    return groupedAttributes;
}








export async function wishList(token, { alreadyWishlisted }, wishData) {
    const supabase = await supabaseClient(token);

    if (alreadyWishlisted) {

        const { data, error: deleteError } = await supabase
            .from('wishlist_products')
            .delete()
            .eq('product_id', wishData.product_id)

        if (deleteError) {
            console.log("Error Deleting Wishlisted Product: ", deleteError);
            return null
        }

        return data
    } else {

        const { data, error: insertError } = await supabase
            .from('wishlist_products')
            .insert([wishData])
            .select()

        if (insertError) {
            console.log("Error Fetching Products: ", insertError);
            return null
        }

        return data
    }



}









export async function getWishListedProducts(token) {
    const supabase = await supabaseClient(token);


    const { data, error: error } = await supabase
        .from('wishlist_products')
        .select('*,products(*)')

    if (error) {
        console.log("Error Fetching WishListed Products: ", error);
        return null
    }

    return data

}














export async function getAllAttributes(token) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('attributes').select('*');
    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching All Attributes: ", error);
        return null;
    }

    // Group attributes by name and store id-value pairs
    const groupedAttributes = {};

    data.forEach(item => {
        const attributeName = item.name;  // Use 'name' directly here
        const attributeValue = item.value;
        const valueId = item.id;

        // If the attribute name doesn't exist in the groupedAttributes object, initialize it
        if (!groupedAttributes[attributeName]) {
            groupedAttributes[attributeName] = [];
        }

        // Add the id-value pair to the corresponding group
        groupedAttributes[attributeName].push({
            id: valueId,
            value: attributeValue
        });
    });

    return groupedAttributes;
}














export async function insertAttribute(token, _, attributeData) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('attributes')
        .insert(attributeData)
        .select()
    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching All Attributes: ", error);
        return null;
    }

    return groupedAttributes;
}





export async function insertSecondaryImgs(token, _, imgs, productId, attributes) {
    const supabase = await supabaseClient(token);

    // This function will handle each file
    const uploadImage = async (img) => {
        const random = Math.floor(Math.random() * 90000);
        const filename = `secondary-img-${random}-${img.name}`;

        // Upload each image file to Supabase storage
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filename, img);
        if (uploadError) {
            console.log("Error Uploading Secondary Image: ", uploadError);
            return null;
        }

        const secondary_img_url = `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`;
        return {
            product_id: productId,
            secondary_img_url
        };
    };


    // Upload all images concurrently using Promise.all
    const uploadedImagesData = await Promise.all(imgs.map(uploadImage));

    // Filter out any null results (if any image failed to upload)
    const successfulUploads = uploadedImagesData.filter(upload => upload !== null);

    if (successfulUploads.length > 0) {
        // Insert all successful image data at once into 'product_secondary_imgs' table
        const { data: secondaryImgUploadData, error: secondaryImgUploadError } = await supabase
            .from('product_secondary_imgs')
            .insert(successfulUploads)
            .select();
        if (attributes.length > 0) {
            console.log("AttributesExists");

            const { error: addAttributeError } = await supabase
                .from('product_attributes')
                .insert(attributes)
                .select();

            if (addAttributeError) {
                console.log("Error Adding Attributes to Product Id: ", error);
                return null;
            }
        }
        if (secondaryImgUploadError) {
            console.log("Error Inserting into product_secondary_imgs Table: ", secondaryImgUploadData);
            return null;
        }

        return secondaryImgUploadData; // Return the inserted rows (contains metadata like the file URLs)
    }

    return []; // Return an empty array if no images were uploaded successfully

}









export async function insertProduct(token, _, featuredImg, productData, sellerId) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    const filename = `featured-img-${random}-${featuredImg.name}`;

    // Upload each image file to Supabase storage
    const { error: featuredImgError } = await supabase.storage.from('product-images').upload(filename, featuredImg);
    if (featuredImgError) {
        console.log("Error Fetching Order Items: ", featuredImgError);
        return null
    }

    const featured_img = `${supabaseUrl}/storage/v1/object/public/product-images//${filename}`
    const { data, error } = await supabase
        .from('products')
        .insert({
            seller_id: sellerId,
            name: productData.name,
            price: productData.price,
            stock_quantity: productData.stock,
            image_url: featured_img,
            category_id: productData.category,
            sub_category_id: productData.subCategory,
            discount: productData.discount ? productData.discount : 0,
            long_description: productData.longDescription,
            short_description: productData.shortDescription,
        })
        .select();

    if (error) {
        console.log("Error Adding Product: ", error);
        return null
    }

    return data[0].id;
}










export async function getSellerProducts(token, _, sellerId) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('products')
        .select('*')
        .eq('seller_id', sellerId)

    const { data, error } = await query;

    if (error) {
        console.log("Error Fetching Seller Products: ", error);
        return null;
    }

    return data;
}









export async function deleteProduct(token, _, productId) {
    const supabase = await supabaseClient(token);

    // Fetch secondary images for the given product
    const { data: secondaryImgsData, error: secondaryImgsError } = await supabase
        .from('product_secondary_imgs')
        .select('*')
        .eq('product_id', productId);

    if (secondaryImgsError) {
        console.log("Error Fetching Secondary Images: ", secondaryImgsError);
        return null;
    }

    console.log("secondaryImgsData:", secondaryImgsData);

    // Fetch the featured image for the given product
    const { data: feturedImgData, error: feturedImgError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', productId)


    if (feturedImgError) {
        console.log("Error Fetching Featured Image: ", feturedImgError);
        return null;
    }

    console.log("feturedImgData:", feturedImgData);

    // Extract filenames from the secondary image URLs
    const filenames = secondaryImgsData.map(item => {
        return item.secondary_img_url.split('/').pop();  // Extract the filename from the URL
    });

    // Include the featured image filename if it exists
    if (feturedImgData && feturedImgData[0].image_url) {
        const featuredFilename = feturedImgData[0].image_url.split('/').pop();  // Extract filename from the featured image URL
        filenames.push(featuredFilename);  // Add the featured image filename to the array
    }

    console.log("Files to Delete:", filenames);

    // Delete the images from the storage bucket
    const { error: imgDeleteError } = await supabase.storage.from('product-images').remove(filenames);

    if (imgDeleteError) {
        console.log("Error Deleting Images: ", imgDeleteError);
        return null;
    }

    // Delete the product from the 'products' table
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        console.log("Error Deleting Product: ", error);
        return null;
    }

    return data;  // Return the deleted product data (if needed)
}























export async function getReviews(token,_,productId) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id',productId)
    if (error) {
        console.log("Error Adding Review: ", error);
        return null
    }
    return data

}







export async function insertReviews(token, _, reviewData) {
    const supabase = await supabaseClient(token);


    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()

    if (error) {
        console.log("Error Adding Review: ", error);
        return null
    }

    return data

}