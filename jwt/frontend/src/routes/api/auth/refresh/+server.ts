import { json } from "@sveltejs/kit";
import { BACKEND_URL } from "$env/static/private";

export async function POST({ cookies }) {
	try {
		const refreshToken = cookies.get("refreshToken");
		if (!refreshToken) {
			return json({ error: "No refresh token found." }, { status: 401 });
		}

		const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				refreshToken
			})
		});

		if (response.ok) {
			const data = await response.json();

			// Update refresh token cookie if a new one was provided
			if (data.refreshToken) {
				cookies.set("refreshToken", data.refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					path: "/",
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});
			}

			return json({
				accessToken: data.accessToken,
				tokenType: data.tokenType,
				expiresIn: data.expiresIn
			});
		} else {
			cookies.delete("refreshToken", { path: "/" });
			return json({ error: "Invalid refresh token." }, { status: 401 });
		}
	} catch (error) {
		console.error(`ERROR [api/auth/refresh]: ${error}`);
		return json({ error: "Internal server error." }, { status: 500 });
	}
}
