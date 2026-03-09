# DimSumLines

A VSCode extension that dims all lines except the currently focused line, helping you maintain focus on your current work.

## Features

- **Focus Mode**: Dims all lines except the one with cursor focus
- **Regex Mode**: Dims lines matching regex patterns
- **Toggle Command**: Quickly enable/disable dimming with `Ctrl+Shift+P` > "Toggle DimSumLines Dimming"
- **Mode Switching Commands**: Quickly change between focus and regex modes
- **Regex Pattern Management**: Add/clear regex patterns via commands
- **Status Bar Indicator**: Shows current dimming status in bottom right
- Configurable opacity level (0.1 to 0.9)
- Automatically updates as you move your cursor or edit content
- Works with any text file type

## Installation

1. Install from VSCode Marketplace (coming soon)
2. Or install manually by packaging the extension

## Configuration

Add to your VSCode **user settings** (global/profile-specific):

```json
{
  "dimsumlines.mode": "focus", // or "regex"
  "dimsumlines.opacity": 0.3,
  "dimsumlines.regexPatterns": ["TODO", "FIXME", "debug"],
  "dimsumlines.invertRegex": false
}
```

### Settings Scope

**User/Profile-specific settings** (current behavior):
- Settings are saved in your VSCode user settings
- Settings follow you across all projects and workspaces
- Perfect for personal preferences that apply everywhere
- Your dimming configuration is consistent everywhere you work
- Settings are stored in your VSCode profile, not in project files

**Benefits of user-specific settings**:
- Consistent experience across all your projects
- No need to reconfigure for each workspace
- Settings travel with your VSCode profile
- Great for personal development preferences
- Doesn't clutter project files with personal settings

### Modes

- **Focus Mode** (`"focus"`): Dims all lines except the currently focused line
- **Regex Mode** (`"regex"`): Dims lines that match the specified regex patterns

### Regex Options

- `regexPatterns`: Array of regex patterns to match
- `invertRegex`: If `true`, dims lines that DON'T match the patterns (highlight matches)

## Usage

### Basic Usage
1. Install the extension
2. Open any text file
3. All lines except the focused one will be automatically dimmed (focus mode by default)
4. Move your cursor to change which line is in focus

### Command Palette Commands (F1)

All commands are available via `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac):

- **Toggle DimSumLines Dimming**: Enable/disable all dimming
- **DimSumLines: Select Mode**: Choose between Focus Mode and Regex Mode (dropdown)
- **DimSumLines: Add Regex Pattern**: Add a new regex pattern interactively
- **DimSumLines: Manage Regex Patterns**: View, review, and delete individual regex patterns
- **DimSumLines: Clear Regex Patterns**: Remove all regex patterns
- **DimSumLines: Toggle Invert Regex**: Toggle between dimming matching vs non-matching lines

### Quick Mode Switching
- Use `Ctrl+Shift+P` > "DimSumLines: Select Mode" to choose between modes
- A dropdown will appear showing current mode and allowing you to switch
- No need to edit settings manually!

### Regex Pattern Management

#### Adding Patterns
1. Press `Ctrl+Shift+P` and type "DimSumLines: Add Regex Pattern"
2. Enter your regex pattern (e.g., `TODO|FIXME|debug`)
3. Pattern is added immediately and takes effect

#### Managing Patterns
1. Press `Ctrl+Shift+P` and type "DimSumLines: Manage Regex Patterns"
2. A list of all your current patterns will appear
3. Select a pattern to delete it individually
4. Get confirmation when pattern is removed

#### Clearing All Patterns
1. Use "Clear Regex Patterns" to remove all patterns at once
2. Great for starting fresh with new patterns

### Pattern Examples
- `TODO|FIXME|DEBUG`: Dim lines containing these keywords
- `console\.log.*`: Dim console.log statements
- `//.*`: Dim comment lines
- `debugger`: Dim debugger statements

### Toggle Dimming
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Toggle DimSumLines Dimming" and press Enter
- Or click the status bar indicator in the bottom right
- A notification will confirm the new status

### Status Bar Indicator
- Look for the eye icon in the bottom right corner
- `$(eye) DimSumLines: ON` - Dimming is active
- `$(eye-closed) DimSumLines: OFF` - Dimming is disabled
- Click the indicator to toggle dimming on/off

### Focus Mode
- Default mode: dims all lines except the currently focused line
- Great for maintaining focus on your current work

### Regex Mode
1. Set `"dimsumlines.mode": "regex"` in your settings
2. Add regex patterns to `"dimsumlines.regexPatterns"`
3. Lines matching the patterns will be dimmed
4. Use `"dimsumlines.invertRegex": true` to dim non-matching lines instead (highlight matches)

## Development

```bash
npm install
npm run watch  # for development
npm run compile # for production build
```

## License

MIT