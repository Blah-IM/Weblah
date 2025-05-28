import type { Message, User } from '$lib/types';

const MAX_MESSAGES_PER_SECTION = 10;
const SHOW_TIME_AFTER_SILENCE = 30 * 60 * 1000;

export type MessageSection = {
	sender?: User;
	messages: Message[];
	date?: Date;
};

export function sectionMessages(messages: Message[]): MessageSection[] {
	const sections: MessageSection[] = [];

	let lastMessage: Message | undefined = messages[0];
	let currentSection: MessageSection = {
		messages: [],
		sender: lastMessage?.sender,
		date: lastMessage?.date
	};

	for (const message of messages) {
		const reachesMaxMessages = currentSection.messages.length >= MAX_MESSAGES_PER_SECTION;
		const senderChanged = message.sender.id !== lastMessage.sender.id;
		const silentForTooLong =
			message.date.getTime() - lastMessage.date.getTime() > SHOW_TIME_AFTER_SILENCE;
		if (reachesMaxMessages || senderChanged || silentForTooLong) {
			if (currentSection.messages.length > 0) {
				sections.push(currentSection);
			}
			currentSection = { messages: [], sender: message.sender };
			if (silentForTooLong) currentSection.date = message.date;
		}
		currentSection.messages.push(message);
		lastMessage = message;
	}

	sections.push(currentSection);

	return sections;
}
