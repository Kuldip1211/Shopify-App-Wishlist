import db from "../db.server";

export const loader = async ({ request }) => {
    console.log("Received request to fetch customer data");
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const active = url.searchParams.get("active");

        if (!id && active === "true") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentCustomers = await db.customer.findMany({
                where: {
                    updatedAt: {
                        gte: sevenDaysAgo,  // 👈 greater than or equal to 7 days ago
                    },
                },
                orderBy: {
                    updatedAt: "desc",     // 👈 latest first
                },
            });

            let totalCount = recentCustomers.length;

            return Response.json({
                totalCount
            });
        }
        if (!id && !active) {
            const totalCount = await db.customer.count();
            return Response.json({ totalCount });
        }

        if(!id && active === "all"){
            const customers = await db.customer.findMany({
                orderBy: {
                    updatedAt: "desc",
                },
            });
            return Response.json({ customers });
        }

        const customer = await db.customer.findUnique({
            where: { id }
        });

        if (!customer) {
            return Response.json({ message: false }, { status: 404 }); // 👈 add status
        }

        return Response.json({ customer });
    } catch (error) {
        return Response.json({ message: "Error fetching customer data" }, { status: 500 });
    }
};

export const action = async ({ request }) => {
    console.log("Received request to create customer");
    try {
        // parse the incoming request data
        const body = await request.json();

        const { id, firstName, lastName, email, wishlistItems, wishlistprice } = body;

        // validate the required feild 
        if (!id || !firstName || !lastName || !email) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        // // create a new customer in the database
        const newCustomer = await db.customer.create({
            data: {
                id,
                firstName,
                lastName,
                email,
                wishlistItems,
                wishlistprice
            }
        });

        return Response.json({ message: "Customer created successfully" });

    } catch (error) {
        console.error("Error creating customer:", error);
        return Response.json({ message: error }, { status: 500 });
    }
}