<script>
	import ChatListHeader from './ChatListHeader.svelte';
	import ChatListItem from './ChatListItem.svelte';
</script>

<div class="flex h-[100dvh] flex-col justify-stretch">
	<ChatListHeader />
	<div class="min-h-0 flex-1 touch-pan-y overflow-y-auto">
		<ul>
			<ChatListItem
				chat={{
					id: 'room-1',
					name: 'Blah IM Interest Group',
					lastMessage: {
						sender: { id: '1', name: 'septs' },
						content: '窄带通信吧，asn1 + bzip2 效果还是可以的',
						date: new Date('2024-08-29T02:11Z')
					},
					unreadCount: 3
				}}
			/>
			<ChatListItem
				chat={{
					id: 'room-2',
					name: 'Laoself Chat',
					lastMessage: {
						sender: { id: '10', name: 'Richard Luo 🐱' },
						content: '如果durov没事 那你是不是又可以拖延症复发了（',
						date: new Date('2024-08-29T02:11Z')
					}
				}}
			/>
			<ChatListItem
				chat={{
					id: 'room-3',
					name: 'Ubuntu中文',
					lastMessage: {
						sender: { id: '15', name: 'chen jianhao' },
						content:
							'就什么也没安装，昨晚好好的，就打开了pycharm而已，写完代码直接按设置好的快捷键alt+s 关机 重启就不行了',
						date: new Date('2024-08-29T02:27Z')
					},
					unreadCount: 827469
				}}
			/>
			<ChatListItem
				chat={{
					id: '1',
					name: 'septs',
					lastMessage: {
						sender: { id: '1', name: 'septs' },
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
						sender: { id: '2', name: 'oxa' },
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
						sender: { id: '3', name: 'omo' },
						content: '我對 revalidate 的理解是不經過 cache 直接重拉一遍',
						date: new Date('2024-08-28T02:11Z')
					},
					unreadCount: 8
				}}
			/>
			<ChatListItem
				chat={{
					id: '4',
					name: 'Inno Aiolos',
					lastMessage: {
						sender: { id: '4', name: 'Inno Aiolos' },
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
						sender: { id: '5', name: 'Gary です' },
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
						sender: { id: '6', name: 'Chtholly Nota Seniorious' },
						content: '遥遥领先！\n隔壁 nostr 最开始没有注意到这个问题，然后被狂灌置顶 spam',
						date: new Date('2022-07-28T02:11Z')
					}
				}}
			/>
		</ul>
	</div>
</div>
