import { json } from "@sveltejs/kit";
import { BACKEND_URL } from "$env/static/private";

export async function POST({ request, cookies }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: "Email and password are required" }, { status: 400 });
		}

		const response = await fetch(`${BACKEND_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email,
				password
			})
		});

		if (response.ok) {
			const data = await response.json();

			cookies.set("refreshToken", data.refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			return json({
				accessToken: data.accessToken,
				tokenType: data.tokenType,
				expiresIn: data.expiresIn
			});
		} else {
			const errorData = await response.json();
			return json({ error: errorData.message || "Login failed" }, { status: response.status });
		}
	} catch (error) {
		console.error(`ERROR [api/auth/login]: ${error}`);
		return json({ error: "Internal server error" }, { status: 500 });
	}
}
