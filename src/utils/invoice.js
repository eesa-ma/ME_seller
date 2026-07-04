import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateOrderInvoice = (order, seller) => {
  const doc = new jsPDF();
  
  doc.setFont("helvetica");

  // --- Header ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Invoice", 105, 15, { align: "center" });

  // --- Sold By Details ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const shopName = seller?.shopName || seller?.shop_name || order.sellerName || "NGO Seller";
  doc.text(`Sold By: ${shopName}`, 14, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Registered Community Partner", 14, 30);
  doc.text("GSTIN: 29XXXXX0000X1Z5", 14, 35);
  doc.text("Email: mindempowered2020@gmail.com", 14, 40);

  // Line separator
  doc.setLineWidth(0.1);
  doc.setDrawColor(150);
  doc.line(14, 45, 196, 45);

  // --- 3 Column Layout (Order Info / Bill To / Ship To) ---
  const orderDetailsY = 52;
  
  // Col 1: Order Info
  doc.setFont("helvetica", "bold");
  doc.text(`Order ID: ${order.id.split('-')[0].toUpperCase()}`, 14, orderDetailsY);
  doc.setFont("helvetica", "normal");
  doc.text(`Order Date: ${new Date(order.created_at).toLocaleDateString('en-GB')}`, 14, orderDetailsY + 5);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-GB')}`, 14, orderDetailsY + 10);

  // Col 2: Bill To
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 75, orderDetailsY);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer_name || "Customer", 75, orderDetailsY + 5);
  const shipAddr = order.shipping_address || "Address Not Provided";
  const splitShipAddr = doc.splitTextToSize(shipAddr, 50);
  doc.text(splitShipAddr, 75, orderDetailsY + 10);

  // Col 3: Ship To
  doc.setFont("helvetica", "bold");
  doc.text("Ship To", 135, orderDetailsY);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer_name || "Customer", 135, orderDetailsY + 5);
  doc.text(splitShipAddr, 135, orderDetailsY + 10);

  // Line separator
  const addressHeight = Math.max(splitShipAddr.length * 4, 15);
  const tableStartY = orderDetailsY + addressHeight + 5;
  doc.line(14, tableStartY, 196, tableStartY);

  // --- Table ---
  const tableColumn = ["Product Title", "Qty", "Gross Amount", "Discounts", "Taxable Value", "IGST", "Total Rs."];
  const tableRows = [];
  
  let subtotal = 0;
  
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach(item => {
      const itemTotal = (item.quantity * item.price);
      subtotal += itemTotal;
      const itemName = item.productName || item.product_name || item.name || `Item (ID: ${item.product_id || 'Unknown'})`;
      
      tableRows.push([
        itemName,
        item.quantity.toString(),
        itemTotal.toLocaleString('en-IN'),
        "0.00", 
        itemTotal.toLocaleString('en-IN'),
        "0.00", 
        itemTotal.toLocaleString('en-IN')
      ]);
    });
  }

  autoTable(doc, {
    startY: tableStartY + 2,
    head: [tableColumn],
    body: tableRows,
    theme: 'plain',
    headStyles: { fontStyle: 'bold', textColor: 0 },
    bodyStyles: { textColor: 0 },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' }
    }
  });

  const finalY = doc.lastAutoTable.finalY;
  
  doc.line(14, finalY, 196, finalY);

  // --- Totals ---
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const totalLabel = "Grand Total";
  const totalValue = `Rs. ${subtotal.toLocaleString('en-IN')}`;
  
  doc.text(totalLabel, 135, finalY + 8);
  doc.text(totalValue, 196, finalY + 8, { align: "right" });
  
  // --- Signatory ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(shopName, 196, finalY + 20, { align: "right" });
  doc.text("Digitally Signed", 196, finalY + 35, { align: "right" });
  doc.line(156, finalY + 30, 196, finalY + 30);
  doc.line(14, finalY + 45, 196, finalY + 45); // Bottom section separator
  
  // --- Footer ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 118, 18); // Brand Orange
  doc.text("Mind Empowered", 175, 275);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text("Thank You!", 175, 280);
  doc.line(14, 270, 196, 270);
  
  doc.setFontSize(6);
  doc.setTextColor(100);
  doc.text("Regd. office: Mind Empowered, Email: mindempowered2020@gmail.com", 14, 275);
  doc.text("visit us: https://mind-empowered.org/", 14, 280);
  
  doc.setFontSize(7);
  doc.text("Thank you for supporting community artisans through Mind Empowered!", 105, 286, null, null, "center");
  doc.text("This is a computer generated invoice and does not require a signature.", 105, 290, null, null, "center");
  
  doc.setFontSize(6);
  doc.text("E. & O.E.   Page 1 of 1", 196, 290, { align: "right" });

  // Save the PDF
  doc.save(`Invoice_${order.id.split('-')[0].toUpperCase()}.pdf`);
};
