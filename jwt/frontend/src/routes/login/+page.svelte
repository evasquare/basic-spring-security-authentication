<script lang="ts">
	import { authStore } from "$lib/stores/auth.svelte";
	import { goto } from "$app/navigation";

	let email = $state("");
	let password = $state("");
	let error = $state("");

	async function handleLogin() {
		error = "";
		try {
			const result = await authStore.login(email, password);

			if (result.success) {
				goto("/");
			} else {
				error = result.error || "Login failed";
			}
		} catch (err) {
			error = "Network error occurred";
			console.error("Login error:", err);
		}
	}
</script>

<div class="flex w-full justify-center">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleLogin();
		}}
		class="mt-10 flex w-full max-w-87.5 flex-col gap-3"
	>
		<h2 class="mb-3 text-2xl font-semibold">Login</h2>
		{#if error}
			<div class="text-sm text-red-600">{error}</div>
		{/if}
		<div>
			<label for="email" class="mb-2 block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
			/>
		</div>
		<div>
			<label for="password" class="mb-2 block text-sm font-medium">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>Login
		</button>
	</form>
</div>
