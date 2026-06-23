import { supabase } from "./supabaseClient";

// get current session and fetch their seller profile from the database
export const getSellerSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;

    //Fetch the seller's profile from your custom schema
    const { data: sellerData, error: profileError } = await supabase
        .schema('marketplace_dataspace')
        .from('sellers')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

    if (profileError) {
        console.error("Error fecthing seller profile:", profileError);
        return null;
    }


    // Combine auth data and database profile data
    return {
        id: session.user.id,
        email: session.user.email,
        shopName: sellerData.shop_name,
        ownerName: sellerData.owner_name,
        category: sellerData.category,
        balance: sellerData.balance
    };
};

//Login Seller
export const loginSeller = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;

    // Fetch their profile to return the full session object
    const { data: sellerData, error: profileError } = await supabase
        .schema('marketplace_dataspace')
        .from('sellers')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

    if (profileError) throw profileError;

    return {
        id: data.user.id,
        email: data.user.email,
        shopName: sellerData.shop_name,
        ownerName: sellerData.owner_name,
        category: sellerData.category,
        balance: sellerData.balance
    };
};

//Register Seller
export const registerSeller = async (email, password, shopDetails) => {
    // Sign up  the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });
    if (authError) throw authError;

    // Insert shop details intp sellers table
    const { error: insertError } = await supabase
        .schema('marketplace_dataspace')
        .from('sellers')
        .insert([
            {
                id: authData.user.id, // Link to the auth user
                shop_name: shopDetails.shopName,
                owner_name: shopDetails.ownerName,
                category: shopDetails.category,
                balance: 0.00
            }
        ]);

    if (insertError) throw insertError;

    return {
        id: authData.user.id,
        email: authData.user.email,
        shopName: shopDetails.shopName,
        ownerName: shopDetails.ownerName,
        category: shopDetails.category,
        balance: 0.00
    };
};

// Logout
export const logoutSeller = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Update Seller Profile
export const updateSellerProfile = async (updatedDetails) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { error } = await supabase
        .schema('marketplace_dataspace')
        .from('sellers')
        .update({
            shop_name: updatedDetails.shopName,
            owner_name: updatedDetails.ownerName,
            category: updatedDetails.category
        })
        .eq('id', session.user.id);

    if (error) throw error;
    return true;
};