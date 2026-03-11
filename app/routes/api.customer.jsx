import db from "../db.server";

export const loader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return Response.json({ message: "Missing customer id" }, { status: 400 });
        }

        const customer = await db.customer.findUnique({
            where: { id }
        });

        if (!customer) {
            return Response.json({ message: "Customer not found" }, { status: 404 });
        }

        return Response.json({ customer });
    } catch (error) {
        return Response.json({ message: "Error fetching customer data" }, { status: 500 });
    }
};

export const action = async ({ request }) => {
    try {
        // parse the incoming request data
        const body = await request.json();

        const { id , firstName , lastName , email } = body;

        // validate the required feild 
        if(!id || !firstName || !lastName || !email) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        // create a new customer in the database
        const newCustomer = await db.customer.create({
            data: {
                id,
                firstName,
                lastName,
                email
            }
        });

        return Response.json({ message: "Customer created successfully", customer: newCustomer });

    } catch (error) {
        return Response.json({ message: "Error creating customer" }, { status: 500 });
    }
}