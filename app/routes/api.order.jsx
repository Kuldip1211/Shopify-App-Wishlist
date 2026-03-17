import db from "../db.server";
import { authenticate } from "../shopify.server";

function normalizeId(value) {
	if (value === null || value === undefined) return null;
	const id = String(value).trim();
	if (!id) return null;
	if (id.includes("gid://")) {
		return id.split("/").pop() || null;
	}
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
	try {
		const url = new URL(request.url);
		const task = url.searchParams.get("task");

		if (task !== "conversion") {
			return Response.json({ message: "Please Enter Valid Parameters" }, { status: 400 });
		}

		const wishlistRows = await db.wishlist.findMany({
			select: {
				customerIds: true,
				productId: true,
			},
		});

		const wishlistByCustomer = new Map();

		wishlistRows.forEach((row) => {
			const customers = parseCustomerIds(row.customerIds);
			const productCandidates = [String(row.productId), normalizeId(row.productId)].filter(Boolean);

			customers.forEach((customerIdRaw) => {
				const customerCandidates = [String(customerIdRaw), normalizeId(customerIdRaw)].filter(Boolean);

				customerCandidates.forEach((customerId) => {
					if (!wishlistByCustomer.has(customerId)) {
						wishlistByCustomer.set(customerId, new Set());
					}

					const customerWishlist = wishlistByCustomer.get(customerId);
					productCandidates.forEach((productId) => customerWishlist.add(productId));
				});
			});
		});

		const totalWishlistedProducts = [...wishlistByCustomer.values()].reduce(
			(sum, productSet) => sum + productSet.size,
			0,
		);

		const { admin } = await authenticate.admin(request);
		const orderResponse = await admin.graphql(`
			query ConversionOrders {
				orders(first: 250, sortKey: CREATED_AT, reverse: true) {
					edges {
						node {
							createdAt
							customer {
								id
								legacyResourceId
							}
							lineItems(first: 100) {
								edges {
									node {
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

		const orderJson = await orderResponse.json();

		if (orderJson.errors) {
			return Response.json(
				{ message: "Failed to fetch orders", totalConversion: 0, todayConversion: 0 },
				{ status: 500 },
			);
		}

		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);

		const convertedPairs = new Set();
		const todayConvertedPairs = new Set();

		(orderJson.data?.orders?.edges || []).forEach(({ node }) => {
			const orderDate = new Date(node.createdAt);
			const isToday = orderDate >= todayStart;

			const customerKeys = [
				node.customer?.id,
				node.customer?.legacyResourceId,
				normalizeId(node.customer?.id),
				normalizeId(node.customer?.legacyResourceId),
			].filter(Boolean);

			if (!customerKeys.length) return;

			const orderedProductIds = [
				...(node.lineItems?.edges || []).flatMap(({ node: lineItemNode }) => [
					lineItemNode.product?.id,
					lineItemNode.product?.legacyResourceId,
					normalizeId(lineItemNode.product?.id),
					normalizeId(lineItemNode.product?.legacyResourceId),
				]),
			].filter(Boolean);

			if (!orderedProductIds.length) return;

			customerKeys.forEach((customerId) => {
				const wishedProducts = wishlistByCustomer.get(String(customerId));
				if (!wishedProducts) return;

				orderedProductIds.forEach((productId) => {
					const normalizedProductId = String(productId);
					if (!wishedProducts.has(normalizedProductId)) return;

					const key = `${customerId}::${normalizedProductId}`;
					convertedPairs.add(key);

					if (isToday) {
						todayConvertedPairs.add(key);
					}
				});
			});
		});

		const totalConvertedProducts = convertedPairs.size;
		const todayConvertedProducts = todayConvertedPairs.size;

		const totalConversion = totalWishlistedProducts
			? Number(((totalConvertedProducts / totalWishlistedProducts) * 100).toFixed(2))
			: 0;

		const todayConversion = totalWishlistedProducts
			? Number(((todayConvertedProducts / totalWishlistedProducts) * 100).toFixed(2))
			: 0;

		return Response.json({
			totalWishlistedProducts,
			totalConvertedProducts,
			todayConvertedProducts,
			totalConversion,
			todayConversion,
		});
	} catch (error) {
		return Response.json({ message: "Error fetching order conversion" }, { status: 500 });
	}
};

