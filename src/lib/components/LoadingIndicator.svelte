<script lang="ts">
	import { tw } from '$lib/tw';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
	
</script>

<div class={tw('loading-indicator relative inline-block size-5 [&>div]:bg-sf-tertiary', className)}>
	<div class="bar1"></div>
	<div class="bar2"></div>
	<div class="bar3"></div>
	<div class="bar4"></div>
	<div class="bar5"></div>
	<div class="bar6"></div>
	<div class="bar7"></div>
	<div class="bar8"></div>
	<div class="bar9"></div>
	<div class="bar10"></div>
	<div class="bar11"></div>
	<div class="bar12"></div>
</div>

<style>
	.loading-indicator > div {
		width: 6%;
		height: 16%;
		position: absolute;
		left: 49%;
		top: 43%;
		opacity: 0;
		border-radius: 50px;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
		animation: fade 1s linear infinite;
	}

	@keyframes fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.25;
		}
	}

	.bar1 {
		transform: rotate(0deg) translate(0, -130%);
		animation-delay: 0s;
	}

	.bar2 {
		transform: rotate(30deg) translate(0, -130%);
		animation-delay: -0.9167s;
	}

	.bar3 {
		transform: rotate(60deg) translate(0, -130%);
		animation-delay: -0.833s;
	}
	.bar4 {
		transform: rotate(90deg) translate(0, -130%);
		animation-delay: -0.7497s;
	}
	.bar5 {
		transform: rotate(120deg) translate(0, -130%);
		animation-delay: -0.667s;
	}
	.bar6 {
		transform: rotate(150deg) translate(0, -130%);
		animation-delay: -0.5837s;
	}
	.bar7 {
		transform: rotate(180deg) translate(0, -130%);
		animation-delay: -0.5s;
	}
	.bar8 {
		transform: rotate(210deg) translate(0, -130%);
		animation-delay: -0.4167s;
	}
	.bar9 {
		transform: rotate(240deg) translate(0, -130%);
		animation-delay: -0.333s;
	}
	.bar10 {
		transform: rotate(270deg) translate(0, -130%);
		animation-delay: -0.2497s;
	}
	.bar11 {
		transform: rotate(300deg) translate(0, -130%);
		animation-delay: -0.167s;
	}
	.bar12 {
		transform: rotate(330deg) translate(0, -130%);
		animation-delay: -0.0833s;
	}
</style>
