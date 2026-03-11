import db from "../db.server";

export const loader = async ({ request }) => {
    return Response.json({ message: "Wishlist API is working" });
}

export const action = async ({ request }) => {
    
}