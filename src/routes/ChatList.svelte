<script>
	import ChatListHeader from './ChatListHeader.svelte';
	import ChatListItem from './ChatListItem.svelte';
</script>

<div class="flex h-screen flex-col justify-stretch">
	<ChatListHeader />
	<div class="min-h-0 flex-1 overflow-y-auto">
		<ul>
			<ChatListItem
				chat={{
					id: '1',
					name: 'septs',
					lastMessage: {
						content: '验证 checksum 是否正确的代价还是可以接受的',
						date: new Date('2024-08-28T02:54Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: '2',
					name: 'oxa',
					lastMessage: {
						content: '但似乎现在大家都讨厌 pgp ，觉得太复杂',
						date: new Date('2024-08-28T02:37Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: '3',
					name: 'omo',
					lastMessage: {
						content: '我對 revalidate 的理解是不經過 cache 直接重拉一遍',
						date: new Date('2024-08-28T02:11Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: '4',
					name: 'Inno Aiolos',
					lastMessage: {
						content: '至少得把信息分发给所有广播自己是这个public key的destination',
						date: new Date('2024-07-28T02:11Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: '5',
					name: 'Gary です',
					lastMessage: {
						content: '没必要8，长毛象那样挺麻烦的',
						date: new Date('2023-07-28T02:11Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: '6',
					name: 'Chtholly Nota Seniorious',
					lastMessage: {
						content: '遥遥领先！\n隔壁 nostr 最开始没有注意到这个问题，然后被狂灌置顶 spam',
						date: new Date('2022-07-28T02:11Z')
					}
				}}
			/>
		</ul>
	</div>
</div>
