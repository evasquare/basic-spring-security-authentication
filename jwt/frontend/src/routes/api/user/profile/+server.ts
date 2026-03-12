import { json } from "@sveltejs/kit";
import { BACKEND_URL } from "$env/static/private";

export async function GET({ request }) {
	try {
		const authHeader = request.headers.get("authorization");

		if (!authHeader) {
			return json({ error: "Not authenticated" }, { status: 401 });
		}
		if (!authHeader.startsWith("Bearer ")) {
			return json({ error: "Authentication data is corrupted." }, { status: 401 });
		}

		const response = await fetch(`${BACKEND_URL}/user/profile`, {
			method: "GET",
			headers: {
				Authorization: authHeader,
				"Content-Type": "application/json"
			}
		});

		if (response.ok) {
			const profileData = await response.json();
			return json(profileData);
		} else {
			const errorData = await response.json();
			return json(
				{ error: errorData.message || "Failed to fetch profile" },
				{ status: response.status }
			);
		}
	} catch (error) {
		console.error(`ERROR [${BACKEND_URL}/user/profile]: ${error}`);
		return json({ error: "Internal server error" }, { status: 500 });
	}
}
