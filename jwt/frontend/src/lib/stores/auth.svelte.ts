interface User {
	username: string;
	authorities: Array<{ authority: string }>;
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
const authState = $state<AuthState>({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isLoading: true
});

export const authStore = {
	get user() {
		return authState.user;
	},
	get accessToken() {
		return authState.accessToken;
	},
	get isAuthenticated() {
		return authState.isAuthenticated;
	},
	get isLoading() {
		return authState.isLoading;
	},

	setTokens(accessToken: string) {
		authState.accessToken = accessToken;
		authState.isAuthenticated = true;
	},
	setUser(user: User | null) {
		authState.user = user;
	},
	setLoading(loading: boolean) {
		authState.isLoading = loading;
	},

	async refreshToken(): Promise<boolean> {
		try {
			const response = await fetch("/api/auth/refresh", {
				method: "POST",
				credentials: "include"
			});

			if (response.ok) {
				const data = await response.json();
				this.setTokens(data.accessToken);
				return true;
			} else {
				throw new Error("Refresh failed");
			}
		} catch {
			this.logout();
			return false;
		}
	},

	async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
		// If there is no access token, try to refresh first.
		if (!authState.accessToken) {
			const refreshed = await this.refreshToken();
			if (!refreshed) {
				throw new Error("No access token available and refresh failed");
			}
		}

		const response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${authState.accessToken}`
			}
		});

		// If token gets expired, try to refresh and retry
		if (response.status === 401) {
			const refreshed = await this.refreshToken();
			if (refreshed) {
				return fetch(url, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${authState.accessToken}`
					}
				});
			}
		}

		return response;
	},

	async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include",
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				const data = await response.json();
				this.setTokens(data.accessToken);

				await this.fetchUserProfile();

				return { success: true };
			} else {
				const errorData = await response.json();
				return { success: false, error: errorData.message || "Login failed" };
			}
		} catch {
			return { success: false, error: "Network error" };
		}
	},

	async logout() {
		// Clear refresh token on server
		await fetch("/api/auth/logout", {
			method: "POST",
			credentials: "include"
		});

		authState.user = null;
		authState.accessToken = null;
		authState.isAuthenticated = false;
		authState.isLoading = false;
	},

	async fetchUserProfile() {
		try {
			if (!authState.accessToken) return;
			const response = await this.fetchWithAuth("/api/user/profile");

			if (response.ok) {
				const userData = await response.json();
				this.setUser(userData);
			}
		} catch (error) {
			console.error("Failed to fetch user profile:", error);
		}
	},
	async initialize() {
		authState.isLoading = true;

		try {
			const refreshed = await this.refreshToken();
			if (refreshed) {
				await this.fetchUserProfile();
			}
		} catch (error) {
			console.error("authStore initialization failed:", error);
		} finally {
			authState.isLoading = false;
		}
	}
};
