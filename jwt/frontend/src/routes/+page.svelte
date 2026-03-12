<script lang="ts">
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/stores/auth.svelte";
	import { onMount } from "svelte";

	async function handleLogout() {
		await authStore.logout();
		window.location.reload();
	}

	function handleLogin() {
		goto("/login");
	}

	onMount(() => {
		authStore.initialize();
	});
</script>

<div class="flex w-full justify-center">
	{#if authStore.isLoading}<div></div>{:else if authStore.isAuthenticated && authStore.user}
		<div class="flex flex-col items-center gap-4">
			<h2 class="text-2xl">Welcome, {authStore.user.username}!</h2>
			<button
				onclick={handleLogout}
				class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
			>
				Logout
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<h2 class="text-2xl">Welcome!</h2>
			<button
				onclick={handleLogin}
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				Login
			</button>
		</div>
	{/if}
</div>
