import { Plugin } from 'obsidian';

export default class AppleNotesCheckboxPlugin extends Plugin {
	async onload() {
		console.log('Apple Notes Checkbox Plugin loaded!');
	}

	onunload() {
		console.log('Apple Notes Checkbox Plugin unloaded!');
	}
}