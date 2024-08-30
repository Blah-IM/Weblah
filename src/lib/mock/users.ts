import type { User } from '$lib/types';

const users = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Shibo Lyu' },
	{ id: '4', name: 'oxa' },
	{ id: '5', name: 'septs' },
	{ id: '6', name: '柑橘 12%' },
	{ id: '7', name: 'Richard Luo 🐱' },
	{ id: '8', name: 'Inno Aiolos' },
	{ id: '9', name: 'omo' },
	{ id: '10', name: 'Chaoses Ib' },
	{ id: '11', name: 'L' },
	{ id: '12', name: 'FlyingSky' },
	{ id: '13', name: 'Hexagram 喵｜🕊️' },
	{ id: '14', name: 'Cαmber Kirisame (ver. Rolling)' },
	{ id: '15', name: 'lelenext 轩' },
	{ id: '16', name: 'Gary です' },
	{ id: '17', name: 'Criphc' },
	{ id: '18', name: 'Grady Bing' },
	{ id: '19', name: 'Thomas Chang' },
	{ id: '20', name: '化 生' },
	{ id: '21', name: 'Eddy' },
	{ id: '22', name: 'Asuna 🍓' },
	{ id: '23', name: '♡️️Eve️️ ♡' },
	{ id: '24', name: '你' },
	{ id: '25', name: 'G°_ ヤン' },
	{ id: '26', name: '302ye' },
	{ id: '27', name: 'Chclt' },
	{ id: '28', name: 'Kaito ゾ' },
	{ id: '29', name: '🈚 （only know copy' },
	{ id: '30', name: '喵' },
	{ id: '31', name: '🦑 没有 premium' },
	{ id: '32', name: 'Hut' },
	{ id: '33', name: '瑜琳 洛' },
	{ id: '34', name: 'LUO Chestnut' },
	{ id: '35', name: 'ka' },
	{ id: '36', name: 'Cinnamon' },
	{ id: '37', name: 'Yves Lelouch' }
] satisfies User[];

export function getRandomUser() {
	return users[Math.floor(Math.random() * users.length)];
}
