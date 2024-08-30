const unreadCountFormatter = new Intl.NumberFormat('default', {
	notation: 'compact',
	compactDisplay: 'short'
});

export function formatUnreadCount(count: number) {
	return unreadCountFormatter.format(count);
}

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
const fullDateTimeFormatter = new Intl.DateTimeFormat('default', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});

export const formatMessageDate = (date: Date, full: boolean = false) => {
	if (full) return fullDateTimeFormatter.format(date);

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
