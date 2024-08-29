<script lang="ts">
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let chat: {
		id: string;
		name: string;
		lastMessage: { sender: { id: string; name: string }; content: string; date: Date };
		unreadCount?: number;
	};

	const sameDayFormatter = new Intl.DateTimeFormat('default', {
		hour: '2-digit',
		minute: '2-digit'
	});
	const sameYearFormatter = new Intl.DateTimeFormat('default', {
		month: 'short',
		day: 'numeric'
	});
	const otherYearFormatter = new Intl.DateTimeFormat('default', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	const formatDate = (date: Date) => {
		const now = new Date();
		if (date.getFullYear() === now.getFullYear()) {
			if (date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
				return sameDayFormatter.format(date);
			} else {
				return sameYearFormatter.format(date);
			}
		} else {
			return otherYearFormatter.format(date);
		}
	};

	const unreadCountFormatter = new Intl.NumberFormat('default', {
		notation: 'compact',
		compactDisplay: 'short'
	});
</script>

<li
	class="relative after:absolute after:bottom-0 after:end-0 after:start-14 after:border-t-[0.5px] after:border-ss-secondary"
>
	<a href="/chats/{chat.id}" class="flex h-20 cursor-default items-center gap-2 px-2">
		<div class="size-10">
			<AvatarBeam size={40} name={chat.name} />
		</div>
		<div class="relative min-w-0 flex-1">
			<div class="flex items-center gap-1">
				<h3 class="flex-1 truncate text-sm font-semibold">{chat.name}</h3>
				<time class="truncate text-xs text-sf-tertiary">{formatDate(chat.lastMessage.date)}</time>
			</div>
			<div class="flex items-end gap-1">
				<p class="line-clamp-2 h-[2.5em] text-sm leading-tight text-sf-secondary">
					{#if chat.id !== chat.lastMessage.sender.id}
						<span class="text-sf-primary">{chat.lastMessage.sender.name}: </span>
					{/if}
					{chat.lastMessage.content}
				</p>
				{#if chat.unreadCount}
					<span
						class="whitespace-nowrap rounded-full bg-slate-400 px-1.5 py-0.5 text-xs text-slate-50 dark:bg-slate-500 dark:text-slate-950"
					>
						{unreadCountFormatter.format(chat.unreadCount)}
					</span>
				{/if}
			</div>
		</div>
	</a>
</li>
