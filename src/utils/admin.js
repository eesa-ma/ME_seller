import { supabase } from './supabaseClient.js';

// Fetch all registered sellers/NGOs
export const getAllSellers = async () => {
  try {
    const { data, error } = await supabase
      .schema('marketplace_dataspace')
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    return [];
  }
};

// Fetch all products across all sellers
export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// Fetch all orders across the entire platform
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .schema('marketplace_dataspace')
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

// Fetch a single seller's profile, products, and orders
export const getSellerDetails = async (sellerId) => {
  try {
    // 1. Fetch seller profile
    const { data: seller, error: sellerError } = await supabase
      .schema('marketplace_dataspace')
      .from('sellers')
      .select('*')
      .eq('id', sellerId)
      .maybeSingle();

    if (sellerError) throw sellerError;
    if (!seller) return null;

    // 2. Fetch seller's products
    const { data: products, error: productsError } = await supabase
      .schema('marketplace_dataspace')
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // 3. Fetch seller's orders
    const { data: orders, error: ordersError } = await supabase
      .schema('marketplace_dataspace')
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    return {
      seller: {
        id: seller.id,
        shopName: seller.shop_name,
        ownerName: seller.owner_name,
        category: seller.category,
        balance: seller.balance,
        phone: seller.phone,
        description: seller.description,
        logo: seller.logo,
        locationUrl: seller.location_url,
        bankName: seller.bank_name,
        accountNumber: seller.account_number,
        ifsc: seller.ifsc,
        aboutSeller: seller.about,
        is_admin: seller.is_admin || false,
        createdAt: seller.created_at
      },
      products: products || [],
      orders: orders || []
    };
  } catch (error) {
    console.error(`Error fetching details for seller ${sellerId}:`, error);
    return null;
  }
};

// Process a seller payout by resetting their balance to 0
export const processSellerPayout = async (sellerId) => {
  try {
    const { data, error } = await supabase
      .schema('marketplace_dataspace')
      .from('sellers')
      .update({ balance: 0.00 })
      .eq('id', sellerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error processing payout for seller ${sellerId}:`, error);
    throw error;
  }
};

// Fetch all order reports
export const getAdminReports = async () => {
  try {
    const { data: reports, error } = await supabase
      .schema('marketplace_dataspace')
      .from('order_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!reports || reports.length === 0) return [];

    // Dynamically link buyer and seller data
    const enrichedReports = await Promise.all(reports.map(async (report) => {
      let buyerName = 'Unknown Buyer';
      let sellerName = 'Unknown Seller';
      
      // Fetch buyer details from orders table
      if (report.order_id) {
        const { data: orderData } = await supabase
          .schema('marketplace_dataspace')
          .from('orders')
          .select('customer_name')
          .eq('id', report.order_id)
          .maybeSingle();
        if (orderData?.customer_name) buyerName = orderData.customer_name;
      }
      
      // Fetch seller details from sellers table
      if (report.seller_id) {
        const { data: sellerData } = await supabase
          .schema('marketplace_dataspace')
          .from('sellers')
          .select('shop_name')
          .eq('id', report.seller_id)
          .maybeSingle();
        if (sellerData?.shop_name) sellerName = sellerData.shop_name;
      }
      
      return {
        ...report,
        buyer_name: buyerName,
        seller_name: sellerName
      };
    }));

    return enrichedReports;
  } catch (error) {
    console.error('Error fetching order reports:', error);
    return [];
  }
};

// Fetch specific report details
export const getAdminReportDetails = async (reportId) => {
  try {
    const { data, error  } = await supabase
      .schema('marketplace_dataspace')
      .from('order_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data;
  
  } catch (error) {
    console.error('Error fetching report details:', error);
    return null;
  
  }

};

// Update report status
export const updateReportStatus = async (reportId, status, resolutionNote = null) => {
  try {
    const updates = { 
      status,
      updated_at: new Date().toISOString()
    
    };
    if (resolutionNote !== null) {
      updates.resolution_note = resolutionNote;
    
    }

    const { data, error  } = await supabase
      .schema('marketplace_dataspace')
      .from('order_reports')
      .update(updates)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  
  }

};


