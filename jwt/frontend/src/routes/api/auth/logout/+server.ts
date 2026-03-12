import { json } from "@sveltejs/kit";

export async function POST({ cookies }) {
	try {
		cookies.delete("refreshToken", { path: "/" });
		return json({ success: true });
	} catch (error) {
		console.error(`ERROR [api/auth/logout]: ${error}`);
		return json({ error: "Internal server error" }, { status: 500 });
	}
}
