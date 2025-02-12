import supabaseClient from "@/utils/supabase";

export async function getCartItems(token) {
    const supabase = await supabaseClient(token);


    const { data, error } = await supabase
        .from('cart_items')
        .select('*,products(*,sellers(name),wishlist_products(id))')

    if (error) {
        console.log("Error Fetching Cart Items: ", error);
        return null
    }

    return data

}





export async function addToCart(token, _, cartData) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('cart_items')
        .insert([cartData])
        .select()

    if (error) {
        console.log("Error Adding Item To Cart: ", error);
        return null
    }

    return data

}




export async function updateQn(token, _, itemId, qn) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: qn })
        .eq('id', itemId)

    if (error) {
        console.log("Error Updating Item Quantity: ", error);
        return null
    }


    return data
}




export async function deleteCartItem(token, _, itemId) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

    if (error) {
        console.log("Error Deleting Cart Item: ", error);
        return null
    }


    return data
}




export async function deleteMultipleCartItems(token, _, cartIds) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .in('id', cartIds)

    if (error) {
        console.log("Error Deleting Cart Item: ", error);
        return null
    }


    return data
}







export async function getUserInfo(token, _, userId) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('customer')
        .select('*')
        .eq('customer_id', userId)

    if (error) {
        console.log("Error Updating Item Quantity: ", error);
        return null
    }


    return data
}






export async function updateUserInfo(token, _, customerData, customerID, isUpdate) {
    const supabase = await supabaseClient(token);

    if (isUpdate) {
        // Attempt to update the user info
        const { data, error } = await supabase
            .from('customer')
            .update(customerData)
            .eq('customer_id', customerID);
        console.log("update");

        if (error) {
            console.log("Error Updating User Info: ", error);

            return null
        }

        return data;

    } else {
        // If update fails, try inserting the new user
        const { insertData, insertError } = await supabase
            .from('customer')
            .insert([
                {
                    customer_id: customerID, // Ensuring the customer_id is set
                    ...customerData // Spread other user data from customerData
                }
            ]).select()

        console.log("insert");
        if (insertError) {
            console.log("Error Inserting User Info: ", insertError);
            return null;
        }

        return insertData;
    }
}



export async function insertSeller(token, _, sellerData) {
    const supabase = await supabaseClient(token);

    // If update fails, try inserting the new user
    const { insertData, insertError } = await supabase
        .from('sellers')
        .insert(sellerData).select()

    if (insertError) {
        console.log("Error Inserting Seller Info: ", insertError);
        return null;
    }

    return insertData;
}









export async function insertOrder(token, _, orderData) {
    const supabase = await supabaseClient(token);

    // Step 1: Extract product IDs and quantities from the order data
    const productIds = orderData.map(item => item.product_id);
    const orderQuantities = orderData.map(item => item.quantity); // Assumes `quantity` exists on each order item

    // Step 2: Retrieve the current stock quantities for the specified product IDs
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, stock_quantity')
        .in('id', productIds);

    if (fetchError) {
        console.log("Error fetching product quantities: ", fetchError);
        return null;
    }

    // Step 3: Check if we have stock for each product and store the updated quantities
    const updatedQuantities = products.map((product, index) => {
        const orderQuantity = orderQuantities[index];
        const updatedQuantity = product.stock_quantity - orderQuantity;

        // If stock is insufficient, handle accordingly
        if (updatedQuantity < 0) {
            console.log(`Not enough stock for product ID ${product.id}.`);
            return null; // This will skip updating and returning the response
        }
        return updatedQuantity;
    });

    // If any product had insufficient stock, abort the update and order insertion
    if (updatedQuantities.includes(null)) {
        console.log("Some products do not have enough stock.");
        return null;
    }

    // Step 4: Update the stock quantities for the products
    const { data: updateData, error: updateError } = await supabase
        .from('products')
        .upsert(
            products.map((product, index) => ({
                id: product.id,
                stock_quantity: updatedQuantities[index],
            }))
        );

    if (updateError) {
        console.log("Error updating stock quantity: ", updateError);
        return null;
    }

    // Step 5: Insert the order
    const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()

    if (error) {
        console.log("Error Placing Order: ", error);
        return null;
    }

    return data;
}











export async function getOrders(token, _, userId, sellerId) {
    const supabase = await supabaseClient(token);

    let data, error;

    if (userId) {
        // Fetch orders by customer (userId)
        ({ data, error } = await supabase
            .from('orders')
            .select('*,products(*,sellers(name,phone_number,email))')
            .eq('customer_id', userId)
        );
    } else if (sellerId) {
        // Fetch orders by seller (sellerId)
        ({ data, error } = await supabase
            .from('orders')
            .select('*,customer(*),products(*,sellers(*))')
            .eq('products.seller_id', sellerId)
            .not('products', 'is', null)
        );
    }

    if (error) {
        console.log("Error Fetching Order Items: ", error);
        return null;
    }

    return data;
}




export async function updateOrder(token, _, orderData, qn) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', orderData.id);  // Add this line to specify the condition

    if (orderData.status === "Cancelled") {
        // Step 3: Fetch the current stock quantity for the cancelled product
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('id, stock_quantity')
            .eq('id', orderData.product_id)
            .single(); // Fetch a single product

        if (fetchError) {
            console.log("Error fetching product quantity: ", fetchError);
            return null;
        }

        // Step 4: Increment the stock quantity by the 'qn' variable (quantity)
        const updatedStockQuantity = product.stock_quantity + qn; // Adding 'qn' because it's a cancellation

        // Step 5: Update the stock quantity in the 'products' table
        const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update({ stock_quantity: updatedStockQuantity })
            .eq('id', product.id);

        if (updateError) {
            console.log("Error updating stock quantity: ", updateError);
            return null;
        }

        console.log(`Stock quantity updated for product ID ${product.id}: ${updatedStockQuantity}`);
    }

    if (error) {
        console.log("Error Fetching Order Items: ", error);
        return null
    }


    return data
}







