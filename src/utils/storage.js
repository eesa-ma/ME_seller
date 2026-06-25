// remove this
export const initStorage = () => {
};

// Analytics helper, calculate stats based on Supabase data
export const getAnalyticsStats = (products = [], orders = [], productViews = []) => {
  const validEarningsOrders = orders
    .filter(o => o.fulfillment_status === 'Delivered' || o.fulfillment_status === 'Shipped');

  const totalEarnings = validEarningsOrders
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  // Calculate earnings trend
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const earningsThisMonth = validEarningsOrders
    .filter(o => new Date(o.created_at) >= currentMonthStart)
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  const earningsLastMonth = validEarningsOrders
    .filter(o => {
      const d = new Date(o.created_at);
      return d >= lastMonthStart && d <= lastMonthEnd;
    })
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  let earningsTrend = 0;
  if (earningsLastMonth > 0) {
    earningsTrend = parseFloat((((earningsThisMonth - earningsLastMonth) / earningsLastMonth) * 100).toFixed(1));
  } else if (earningsThisMonth > 0) {
    earningsTrend = 100;
  }

  const pendingOrders = orders.filter(o => o.fulfillment_status === 'Processing').length;
  const outOfStockItems = products.filter(p => p.stock === 0).length;
  const totalItemsSold = orders
    .filter(o => o.fulfillment_status === 'Delivered')
    .reduce((sum, o) => sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 0), 0);


  const deliveredOrders = orders.filter(o => o.fulfillment_status === 'Delivered');

  const itemsSoldThisMonth = deliveredOrders
    .filter(o => new Date(o.created_at) >= currentMonthStart)
    .reduce((sum, o) => sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 0), 0);

  const itemsSoldLastMonth = deliveredOrders
    .filter(o => {
      const d = new Date(o.created_at);
      return d >= lastMonthStart && d <= lastMonthEnd;
    })
    .reduce((sum, o) => sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 0), 0);

  let itemsSoldTrend = 0;
  if (itemsSoldLastMonth > 0) {
    itemsSoldTrend = parseFloat((((itemsSoldThisMonth - itemsSoldLastMonth) / itemsSoldLastMonth) * 100).toFixed(1));
  } else if (itemsSoldThisMonth > 0) {
    itemsSoldTrend = 100;
  }

  // Generate some monthly earnings data for chart
  const monthlyRevenue = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5000 },
    { name: 'Mar', revenue: 8000 },
    { name: 'Apr', revenue: 7500 },
    { name: 'May', revenue: 11000 },
    { name: 'Jun', revenue: totalEarnings + 8000 } // current month plus previous mock base
  ];

  // Calculate conversion rate trend using the new historical views table
  const viewsThisMonth = productViews.filter(v => new Date(v.created_at) >= currentMonthStart).length;
  
  const viewsLastMonth = productViews.filter(v => {
    const d = new Date(v.created_at);
    return d >= lastMonthStart && d <= lastMonthEnd;
  }).length;

  let conversionRateThisMonth = 0;
  if (viewsThisMonth > 0) {
    conversionRateThisMonth = (itemsSoldThisMonth / viewsThisMonth) * 100;
  }

  let conversionRateLastMonth = 0;
  if (viewsLastMonth > 0) {
    conversionRateLastMonth = (itemsSoldLastMonth / viewsLastMonth) * 100;
  }

  let conversionTrend = 0;
  if (conversionRateLastMonth > 0) {
    conversionTrend = parseFloat((((conversionRateThisMonth - conversionRateLastMonth) / conversionRateLastMonth) * 100).toFixed(1));
  } else if (conversionRateThisMonth > 0) {
    conversionTrend = 100;
  }

  // Use the all-time views for the top-level stats
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  let conversionRate = 0;
  if (totalViews > 0) {
    conversionRate = ((totalItemsSold / totalViews) * 100).toFixed(1);
  }

  return {
    totalEarnings,
    totalItemsSold,
    pendingOrders,
    outOfStockItems,
    monthlyRevenue,
    activeListingsCount: products.filter(p => p.status === 'active').length, //check this
    totalViews,
    conversionRate,
    earningsTrend,
    itemsSoldTrend,
    conversionTrend
  };
};
