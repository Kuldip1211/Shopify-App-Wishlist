const btn = document.getElementById("Wishlistbtn");

const API_URL = "https://nontraversable-fearfully-kaylin.ngrok-free.dev";

btn.addEventListener("click", async function () {
  try {
    const response = await fetch("/apps/wishlist/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ,
        firstName: "Kuldeep",
        lastName: "Chudasama",
        email: "test@gmail.com",
        wishlistItems: 120,
        wishlistprice: 55,
      }),
    });

    const data = await response.json();
    alert("Created: " + JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
});

// fetch("")
//   .then((response) => response.json())
//   .then((data) => {
//     alert(JSON.stringify(data, null, 2));
//   })
//   .catch((error) => {
//     alert("Error: " + error.message);
//   });
