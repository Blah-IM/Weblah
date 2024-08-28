<script lang="ts">
	import { AvatarBeam } from 'svelte-boring-avatars';

	export let chat: { id: string; name: string; lastMessage: { content: string; date: Date } };

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
</script>

<li
	class="relative after:absolute after:bottom-0 after:end-0 after:start-14 after:border-t after:border-slate-100"
>
	<a href="/chats/{chat.id}" class="flex h-16 cursor-default items-center gap-2 px-2">
		<div class="size-10">
			<AvatarBeam size={40} name={chat.name} />
		</div>
		<div class="relative h-16 min-w-0 flex-1 space-y-0.5 py-1">
			<div class="flex items-center">
				<h3 class="flex-1 truncate text-sm font-semibold">{chat.name}</h3>
				<time class="truncate text-xs text-gray-500">{formatDate(chat.lastMessage.date)}</time>
			</div>
			<p class="line-clamp-2 text-xs text-gray-500">{chat.lastMessage.content}</p>
		</div>
	</a>
</li>
