# Apple Notes Checkbox (Obsidian plugin)

Automatically moves checked checkbox items below unchecked items, just like Apple Notes app.

## Features

- **Automatic reordering** - Checked items automatically move below unchecked items
- **Configurable delay** - Adjust the reordering delay to prevent rapid changes
- **Toggle functionality** - Enable or disable the auto-reorder feature
- **Smart grouping** - Only reorders items within the same checkbox group
- **Preserves indentation** - Maintains proper indentation levels for nested lists

## How it works

When you check or uncheck a checkbox item in your notes, the plugin automatically reorganizes the list so that:
- ✅ Checked items move to the bottom
- ⬜ Unchecked items stay at the top
- 🔄 Reordering happens with a configurable delay (default: 300ms)

This mimics the behavior of Apple Notes app, making your task lists more organized and easier to read.

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "Apple Notes Checkbox"
4. Install and enable the plugin

### Manual Installation

1. Download the latest release from: https://github.com/cukovicmilos/apple-notes-checkbox
2. Extract the files to your vault's `.obsidian/plugins/apple-notes-checkbox/` folder
3. Enable the plugin in Obsidian settings

## Usage

The plugin works automatically once enabled. Simply:

1. Create checkbox items using the standard Markdown syntax:
   ```markdown
   - [ ] Task 1
   - [ ] Task 2
   - [ ] Task 3
   ```

2. Check off completed tasks by clicking the checkbox

3. The plugin will automatically move checked items below unchecked ones

## Settings

Access plugin settings through: Settings → Community Plugins → Apple Notes Checkbox

- **Enable Auto-Reorder**: Toggle the automatic reordering functionality
- **Reorder Delay**: Set the delay (100-1000ms) before reordering occurs

## Examples

### Before
```markdown
- [x] Buy groceries
- [ ] Walk the dog
- [x] Read a book
- [ ] Write notes
```

### After (automatically reordered)
```markdown
- [ ] Walk the dog
- [ ] Write notes
- [x] Buy groceries
- [x] Read a book
```

## Compatibility

- **Obsidian version**: 0.15.0 or higher
- **Platforms**: Desktop
- **Note types**: Works with any note containing checkbox lists

## Support

If you encounter any issues or have feature requests, please create an issue on https://mustrabecka.com.

## License

MIT Licence
