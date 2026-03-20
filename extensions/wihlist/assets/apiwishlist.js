const btn = document.getElementById("Wishlistbtn");



btn.addEventListener("click", async function () {
  const customerId = btn.getAttribute("data-customer-id");
  const inStock = btn.getAttribute("data-product-in-stock");
  const productCategory = btn.getAttribute("data-product-category");
  const productTitle = btn.getAttribute("data-product-title");
  const productUrl = btn.getAttribute("data-product-url");
  const productImage = btn.getAttribute("data-product-image");
  const productPrice = btn.getAttribute("data-product-price");    
  const productId = btn.getAttribute("data-product-id");
  const productVarientId = btn.getAttribute("data-product-varient-id");
  const datawishlisted = btn.getAttribute("aria-pressed");
  const DailyAnalyticsId = btn.getAttribute("data-daily-analytics-id");
  let stock = false;

  if(inStock === "false"){
    stock = false;
  }else{
    stock = true;
  }

  if(datawishlisted === "true"){
    try {
      const response = await fetch(`/apps/wishlist/api/wishlist`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': '1',   // ✅ skips ngrok warning page
          'bypass-tunnel-reminder': '1'         // ✅ extra safety
        },
        body: JSON.stringify({
          customerId: customerId,                                           
          productId: productId,
          varientId: productVarientId,
          productName: productTitle,
          productLink: productUrl,
          productImage: productImage,
          productPrice: productPrice,
          productcategory: productCategory,
          instock: stock
        })
    });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      btn.setAttribute("data-daily-analytics-id", data?.id ?? "0"); // Set the DailyAnalyticsId attribute with the returned ID

  } catch (error) {
      alert("Error: " + error.message);
  }
  }else{
        try {
        const response = await fetch(`/apps/wishlist/api/wishlist`,{
          method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '1',   // ✅ skips ngrok warning page
              'bypass-tunnel-reminder': '1'         // ✅ extra safety
            },
          body: JSON.stringify({
              customerId: customerId,                                           
              productId: productId,
              varientId: productVarientId, 
              productName: productTitle,
              productLink: productUrl,
              productImage: productImage,
              productPrice: productPrice,
              productcategory: productCategory,
              DailyAnalyticsId : DailyAnalyticsId,
              instock: stock
            })
        });

          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }

      const data = await response.json();

  } catch (error) {
          alert("Error: " + error.message);
    }
  }
});

