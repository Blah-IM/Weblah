import type { ModuleInitializer } from 'typewriter-editor';

export const keyboardSubmit = function keyboardSubmit(
	onSubmit: () => void,
	method: 'enter' | 'shiftEnter'
): ModuleInitializer {
	return () => ({
		commands: {
			keyboardSubmit: onSubmit
		},
		shortcuts: {
			[method === 'enter' ? 'Enter' : 'Shift+Enter']: 'keyboardSubmit'
		}
	});
};
