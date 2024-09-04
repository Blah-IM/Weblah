const unreadCountFormatter = new Intl.NumberFormat('default', {
	notation: 'compact',
	compactDisplay: 'short'
});

export function formatUnreadCount(count: number) {
	return unreadCountFormatter.format(count);
}

const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

const sameDayFormatter = new Intl.DateTimeFormat('default', timeOptions);
const sameYearFormatter = new Intl.DateTimeFormat('default', {
	month: 'short',
	day: 'numeric'
});
const sameYearWithTimeFormatter = new Intl.DateTimeFormat('default', {
	month: 'short',
	day: 'numeric',
	...timeOptions
});
const otherYearFormatter = new Intl.DateTimeFormat('default', {
	year: 'numeric',
	month: 'short',
	day: 'numeric'
});
const otherYearWithTimeFormatter = new Intl.DateTimeFormat('default', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	...timeOptions
});
const fullDateTimeFormatter = new Intl.DateTimeFormat('default', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
});

export const formatMessageDate = (date: Date) => {
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
export const formatFullMessageDate = (date: Date) => {
	return fullDateTimeFormatter.format(date);
};

export const formatMessageSectionDate = (date: Date) => {
	const now = new Date();
	if (date.getFullYear() === now.getFullYear()) {
		if (date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
			return sameDayFormatter.format(date);
		} else {
			return sameYearWithTimeFormatter.format(date);
		}
	} else {
		return otherYearWithTimeFormatter.format(date);
	}
};
