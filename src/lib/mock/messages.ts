import type { BlahRichText } from '$lib/richText';
import type { Message } from '$lib/types';
import { getRandomUser } from './users';

const messageContents: BlahRichText[] = [
	[['更好的例子可能是link和hashtag不應該共存']],
	[['理論上mono是可以BIUS的，只是可能不太常見']],
	[[['這個是一個link', { link: 'https://google.com' }]]],
	[['這是一個', ['#hashtag', { hashtag: true }]]],
	[
		[
			'這是一個',
			['link', { link: 'https://google.com' }],
			'和一個',
			['#hashtag', { hashtag: true }]
		]
	],
	[['可以， 反正我都手写了（']],
	[['但我們也可以約定這種entity一定要有plain text fallback']],
	[['這樣的話，我們就可以在不支援的地方用plain text fallback']],
	[['有可能有僅attribute的run']],
	[
		[
			'我现在是约定 text piece 一定非空，也就是说空字符串应该是空数组（但能不能真的这么发言要打个问号）'
		]
	],
	[['确实合并相邻的 run 就可以 canonicalize']],
	[['比如我可能不希望往数据库里这么存 json ，还需要考虑检索之类的']],
	[['是我蠢了']],
	[['我觉得这个问题是因为我们没有定义好什么是一个 run']],
	[['目标是如果前端/后端使用和协议不一致的格式存储的话 roundtrip 后一致']],
	[
		[
			'你们这个 canonicalize 真的靠谱吗，，，感觉哪怕跑了一遍以后也会有多个不同 message 视觉效果相同的情况'
		]
	],
	[['稍微有点烦（']],
	[
		[
			[
				'奥运会究竟该如何报道？中国媒体的表现真的这么不堪吗？',
				{ link: 'https://www.bilibili.com/video/BV1TZ421L7hj/' }
			]
		],
		[
			'在视频中，可爸深入分析了中国媒体在巴黎奥运会中的表现，探讨了媒体人员的规模、采访类型、团队构成以及值得称赞与批评的采访案例。文章指出，尽管注册媒体工作者数量庞大，但真正的记者数量相对较少，且面临专业能力不足和流量逻辑冲击等问题。同时，作者强调了媒体在维护国家荣誉和传递奥运精神方面的重要性，呼吁媒体挖掘运动员故事，以建立观众与运动员之间的情感联系。这篇文章为了解当前中国体育媒体的现状和未来发展提供了深刻的见解和反思。'
		],
		[''],
		['---'],
		[''],
		['非常好的视频。强烈推荐观看。']
	],
	[['pieces:[], attrs:[] 两者等长。然后判断合并就是 attrs 有没有相邻重复元素']]
];

export function createRandomMessage(): Message {
	return {
		id: Math.random().toString(),
		sender: getRandomUser(),
		content: messageContents[Math.floor(Math.random() * messageContents.length)],
		date: new Date()
	};
}