import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

function normalizeId(value) {
    if (value === null || value === undefined) return null;
    const id = String(value).trim();
    if (!id) return null;
    if (id.includes("gid://")) return id.split("/").pop() || null;
    return id;
}

function parseCustomerIds(raw) {
    if (Array.isArray(raw)) return raw;
    if (!raw) return [];

    try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export const loader = async ({ request }) => {
    const [customers, wishlists] = await Promise.all([
        db.customer.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        }),
        db.wishlist.findMany({
            select: {
                customerIds: true,
                productId: true,
                productName: true,
            },
        }),
    ]);

    const customerById = new Map();
    const customerIdByEmail = new Map();

    customers.forEach((customer) => {
        const normalizedCustomerId = normalizeId(customer.id);
        customerById.set(String(customer.id), customer);
        if (normalizedCustomerId) customerById.set(normalizedCustomerId, customer);
        customerIdByEmail.set(String(customer.email).toLowerCase(), customer.id);
    });

    const wishlistedProductsByCustomer = new Map();
    const wishlistedProductNamesByCustomer = new Map();

    wishlists.forEach((wishlistItem) => {
        const rawCustomerIds = parseCustomerIds(wishlistItem.customerIds);
        const productIdCandidates = [
            String(wishlistItem.productId),
            normalizeId(wishlistItem.productId),
        ].filter(Boolean);

        rawCustomerIds.forEach((rawCustomerId) => {
            const customerIdCandidates = [String(rawCustomerId), normalizeId(rawCustomerId)].filter(Boolean);

            customerIdCandidates.forEach((candidateId) => {
                const customer = customerById.get(candidateId);
                if (!customer) return;

                if (!wishlistedProductsByCustomer.has(customer.id)) {
                    wishlistedProductsByCustomer.set(customer.id, new Set());
                    wishlistedProductNamesByCustomer.set(customer.id, new Map());
                }

                const productSet = wishlistedProductsByCustomer.get(customer.id);
                const productNameMap = wishlistedProductNamesByCustomer.get(customer.id);

                productIdCandidates.forEach((productId) => {
                    productSet.add(productId);
                    if (!productNameMap.has(productId)) {
                        productNameMap.set(productId, wishlistItem.productName);
                    }
                });
            });
        });
    });

    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
        query OrdersList {
            orders(first: 100, sortKey: CREATED_AT, reverse: true) {
                edges {
                    node {
                        id
                        name
                        createdAt
                        displayFinancialStatus
                        customer {
                            id
                            legacyResourceId
                            displayName
                            email
                        }
                        totalPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                        lineItems(first: 50) {
                            edges {
                                node {
                                    title
                                    product {
                                        id
                                        legacyResourceId
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `);

    const result = await response.json();

    if (result.errors) {
        return Response.json({ orders: [], error: "Failed to fetch orders" }, { status: 500 });
    }

    const orders = (result.data?.orders?.edges || [])
        .map(({ node }) => {
            const orderEmail = String(node.customer?.email || "").toLowerCase();

            const customerIdCandidates = [
                node.customer?.id,
                node.customer?.legacyResourceId,
                normalizeId(node.customer?.id),
                normalizeId(node.customer?.legacyResourceId),
                customerIdByEmail.get(orderEmail),
            ].filter(Boolean);

            const matchedCustomer = customerIdCandidates
                .map((candidate) => customerById.get(String(candidate)))
                .find(Boolean);

            if (!matchedCustomer) return null;

            const wishedProducts = wishlistedProductsByCustomer.get(matchedCustomer.id);
            if (!wishedProducts || wishedProducts.size === 0) return null;

            const wishedProductNames = wishlistedProductNamesByCustomer.get(matchedCustomer.id) || new Map();

            const matchedProducts = [];

            (node.lineItems?.edges || []).forEach((item) => {
                const lineItem = item.node;
                const productIdCandidates = [
                    lineItem.product?.id,
                    lineItem.product?.legacyResourceId,
                    normalizeId(lineItem.product?.id),
                    normalizeId(lineItem.product?.legacyResourceId),
                ].filter(Boolean);

                const matchedProductId = productIdCandidates.find((id) => wishedProducts.has(String(id)));
                if (!matchedProductId) return;

                matchedProducts.push({
                    id: String(matchedProductId),
                    name: wishedProductNames.get(String(matchedProductId)) || lineItem.title || "Product",
                });
            });

            const uniqueMatchedProducts = Array.from(
                new Map(matchedProducts.map((product) => [product.id, product])).values(),
            );

            if (uniqueMatchedProducts.length === 0) return null;

            return {
                id: node.id,
                name: node.name,
                createdAt: node.createdAt,
                status: node.displayFinancialStatus,
                customerName:
                    `${matchedCustomer.firstName || ""} ${matchedCustomer.lastName || ""}`.trim() ||
                    node.customer?.displayName ||
                    "Guest",
                customerEmail: matchedCustomer.email || node.customer?.email || "-",
                amount: node.totalPriceSet?.shopMoney?.amount || "0.00",
                currencyCode: node.totalPriceSet?.shopMoney?.currencyCode || "USD",
                matchedProducts: uniqueMatchedProducts,
            };
        })
        .filter(Boolean);

    return Response.json({ orders, error: null });
};

export default function OrdersPage() {
    const { orders, error } = useLoaderData();

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ marginBottom: "8px" }}>Orders</h1>
            <p style={{ marginBottom: "16px", color: "#6b7280" }}>Total Orders: {orders.length}</p>

            {error ? (
                <p style={{ color: "#dc2626" }}>{error}</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Order</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Customer</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Email</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Wishlisted & Ordered Products</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Amount</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Status</th>
                                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px" }}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>{order.name}</td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>{order.customerName}</td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>{order.customerEmail}</td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>
                                        {order.matchedProducts.length
                                            ? order.matchedProducts.map((product) => `${product.name} (${product.id})`).join(", ")
                                            : "-"}
                                    </td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>
                                        {Number(order.amount).toFixed(2)} {order.currencyCode}
                                    </td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>{order.status}</td>
                                    <td style={{ borderBottom: "1px solid #f3f4f6", padding: "10px" }}>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}