import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting, EditorPosition } from 'obsidian';

interface AppleNotesCheckboxSettings {
	enableAutoReorder: boolean;
	reorderDelay: number;
}

const DEFAULT_SETTINGS: AppleNotesCheckboxSettings = {
	enableAutoReorder: true,
	reorderDelay: 300
}

interface CheckboxItem {
	line: number;
	text: string;
	isChecked: boolean;
	indentLevel: number;
}

export default class AppleNotesCheckboxPlugin extends Plugin {
	settings: AppleNotesCheckboxSettings;
	private reorderTimeout: number | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new AppleNotesCheckboxSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;
			if (target && target.classList.contains('task-list-item-checkbox')) {
				this.handleCheckboxClick(target);
			}
		});
	}

	private handleCheckboxClick(checkboxElement: HTMLElement) {
		if (!this.settings.enableAutoReorder) return;

		if (this.reorderTimeout) {
			window.clearTimeout(this.reorderTimeout);
		}

		this.reorderTimeout = window.setTimeout(() => {
			this.reorderCheckboxes();
		}, this.settings.reorderDelay);
	}

	private reorderCheckboxes() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const editor = activeView.editor;
		const content = editor.getValue();
		const lines = content.split('\n');
		
		const checkboxGroups = this.findCheckboxGroups(lines);
		
		let modified = false;
		let lineOffset = 0;

		for (const group of checkboxGroups) {
			const reorderedGroup = this.reorderGroup(group);
			if (this.hasGroupChanged(group, reorderedGroup)) {
				modified = true;
				this.replaceGroupInEditor(editor, group, reorderedGroup, lineOffset);
			}
			lineOffset += group.length;
		}
	}

	private findCheckboxGroups(lines: string[]): CheckboxItem[][] {
		const groups: CheckboxItem[][] = [];
		let currentGroup: CheckboxItem[] = [];
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const checkboxMatch = line.match(/^(\s*)-\s*\[([ x])\]\s*(.*)$/);
			
			if (checkboxMatch) {
				const indentLevel = checkboxMatch[1].length;
				const isChecked = checkboxMatch[2] === 'x';
				const text = checkboxMatch[3];
				
				currentGroup.push({
					line: i,
					text: text,
					isChecked: isChecked,
					indentLevel: indentLevel
				});
			} else {
				if (currentGroup.length > 0) {
					groups.push(currentGroup);
					currentGroup = [];
				}
			}
		}
		
		if (currentGroup.length > 0) {
			groups.push(currentGroup);
		}
		
		return groups;
	}

	private reorderGroup(group: CheckboxItem[]): CheckboxItem[] {
		const baseIndentLevel = Math.min(...group.map(item => item.indentLevel));
		const unchecked = group.filter(item => !item.isChecked);
		const checked = group.filter(item => item.isChecked);
		
		return [...unchecked, ...checked];
	}

	private hasGroupChanged(original: CheckboxItem[], reordered: CheckboxItem[]): boolean {
		if (original.length !== reordered.length) return true;
		
		for (let i = 0; i < original.length; i++) {
			if (original[i].text !== reordered[i].text || 
				original[i].isChecked !== reordered[i].isChecked) {
				return true;
			}
		}
		
		return false;
	}

	private replaceGroupInEditor(editor: Editor, originalGroup: CheckboxItem[], reorderedGroup: CheckboxItem[], lineOffset: number) {
		const startLine = originalGroup[0].line;
		const endLine = originalGroup[originalGroup.length - 1].line;
		
		const newLines = reorderedGroup.map(item => {
			const indent = ' '.repeat(item.indentLevel);
			const checkbox = item.isChecked ? 'x' : ' ';
			return `${indent}- [${checkbox}] ${item.text}`;
		});
		
		const startPos: EditorPosition = { line: startLine, ch: 0 };
		const endPos: EditorPosition = { line: endLine + 1, ch: 0 };
		
		editor.replaceRange(newLines.join('\n') + '\n', startPos, endPos);
	}

	onunload() {
		if (this.reorderTimeout) {
			window.clearTimeout(this.reorderTimeout);
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class AppleNotesCheckboxSettingTab extends PluginSettingTab {
	plugin: AppleNotesCheckboxPlugin;

	constructor(app: App, plugin: AppleNotesCheckboxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Apple Notes Checkbox Settings'});

		new Setting(containerEl)
			.setName('Enable Auto-Reorder')
			.setDesc('Automatically move checked items below unchecked items')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableAutoReorder)
				.onChange(async (value) => {
					this.plugin.settings.enableAutoReorder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Reorder Delay')
			.setDesc('Delay in milliseconds before reordering (prevents rapid reordering)')
			.addSlider(slider => slider
				.setLimits(100, 1000, 50)
				.setValue(this.plugin.settings.reorderDelay)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.reorderDelay = value;
					await this.plugin.saveSettings();
				}));
	}
}