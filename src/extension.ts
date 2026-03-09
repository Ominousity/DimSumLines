import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let decorationType = vscode.window.createTextEditorDecorationType({
        opacity: '0.3',
        isWholeLine: true,
    });

    // Status bar item for toggle indicator
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'dimsumlines.toggleDimming';
    
    let isDimmingEnabled = true;
    
    function updateStatusBar() {
        if (isDimmingEnabled) {
            statusBarItem.text = '$(eye) DimSumLines: ON';
            statusBarItem.tooltip = 'Click to disable dimming';
        } else {
            statusBarItem.text = '$(eye-closed) DimSumLines: OFF';
            statusBarItem.tooltip = 'Click to enable dimming';
        }
        statusBarItem.show();
    }

    function updateDecorations(editor: vscode.TextEditor) {
        if (!editor || !isDimmingEnabled) {
            editor.setDecorations(decorationType, []);
            return;
        }

        const config = vscode.workspace.getConfiguration('dimsumlines');
        const mode = config.get('mode', 'focus') as 'focus' | 'regex';
        const opacity = config.get('opacity', 0.3);
        const patterns: string[] = config.get('regexPatterns', []);
        const invertRegex = config.get('invertRegex', false);
        
        const decorations: vscode.DecorationOptions[] = [];

        if (mode === 'focus') {
            // Focus mode: dim all lines except the focused one
            const activeLine = editor.selection.active.line;
            
            for (let i = 0; i < editor.document.lineCount; i++) {
                if (i !== activeLine) {
                    const line = editor.document.lineAt(i);
                    decorations.push({
                        range: line.range
                    });
                }
            }
        } else if (mode === 'regex') {
            // Regex mode: dim lines matching patterns
            const regexes = patterns.map(p => {
                try {
                    return new RegExp(p, 'i');
                } catch (e) {
                    console.error(`Invalid regex pattern: ${p}`, e);
                    return null;
                }
            }).filter(r => r !== null) as RegExp[];

            for (let i = 0; i < editor.document.lineCount; i++) {
                const line = editor.document.lineAt(i);
                const lineText = line.text;
                
                let shouldDim = false;
                
                if (regexes.length > 0) {
                    // Check if line matches any regex pattern
                    const matchesAny = regexes.some(regex => regex.test(lineText));
                    shouldDim = invertRegex ? !matchesAny : matchesAny;
                }

                if (shouldDim) {
                    decorations.push({
                        range: line.range
                    });
                }
            }
        }

        editor.setDecorations(decorationType, decorations);
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDecorations(editor);
        }
    });

    vscode.window.onDidChangeTextEditorSelection(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.textEditor === editor) {
            updateDecorations(editor);
        }
    });

    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            updateDecorations(editor);
        }
    });

    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('dimsumlines')) {
            const config = vscode.workspace.getConfiguration('dimsumlines');
            const newOpacity = config.get('opacity', 0.3);
            decorationType.dispose();
            decorationType = vscode.window.createTextEditorDecorationType({
                opacity: newOpacity.toString(),
                isWholeLine: true,
            });
            
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                updateDecorations(editor);
            }
        }
    });

    // Register toggle command
    const toggleDimmingCommand = vscode.commands.registerCommand('dimsumlines.toggleDimming', () => {
        isDimmingEnabled = !isDimmingEnabled;
        updateStatusBar();
        
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            updateDecorations(editor);
        }
        
        vscode.window.showInformationMessage(
            isDimmingEnabled 
                ? 'DimSumLines: Dimming enabled' 
                : 'DimSumLines: Dimming disabled'
        );
    });

    // Register mode selection command
    const selectModeCommand = vscode.commands.registerCommand('dimsumlines.selectMode', async () => {
        const config = vscode.workspace.getConfiguration('dimsumlines');
        const currentMode = config.get('mode', 'focus');
        
        const selectedMode = await vscode.window.showQuickPick(['Focus Mode', 'Regex Mode'], {
            placeHolder: `Select mode (current: ${currentMode === 'focus' ? 'Focus' : 'Regex'})`,
            title: 'DimSumLines: Select Mode'
        });
        
        if (selectedMode) {
            const modeValue = selectedMode === 'Focus Mode' ? 'focus' : 'regex';
            await config.update('mode', modeValue, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`DimSumLines: Switched to ${selectedMode} (saved to user settings)`);
        }
    });

    // Use global settings for user/profile-specific preferences
    function getConfigTarget(): vscode.ConfigurationTarget {
        return vscode.ConfigurationTarget.Global;
    }

    // Register regex pattern commands
    const addRegexPatternCommand = vscode.commands.registerCommand('dimsumlines.addRegexPattern', async () => {
        const pattern = await vscode.window.showInputBox({
            prompt: 'Enter regex pattern to add',
            placeHolder: 'e.g., TODO|FIXME|debug'
        });
        
        if (pattern) {
            const config = vscode.workspace.getConfiguration('dimsumlines');
            const patterns: string[] = config.get('regexPatterns', []);
            const updatedPatterns = [...patterns, pattern];
            await config.update('regexPatterns', updatedPatterns, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Added pattern: ${pattern} (saved to user settings)`);
        }
    });

    const clearRegexPatternsCommand = vscode.commands.registerCommand('dimsumlines.clearRegexPatterns', async () => {
        const config = vscode.workspace.getConfiguration('dimsumlines');
        await config.update('regexPatterns', [], vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage('Cleared all regex patterns (saved to user settings)');
    });

    const toggleInvertRegexCommand = vscode.commands.registerCommand('dimsumlines.toggleInvertRegex', () => {
        const config = vscode.workspace.getConfiguration('dimsumlines');
        const currentValue = config.get('invertRegex', false);
        config.update('invertRegex', !currentValue, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
            !currentValue 
                ? 'DimSumLines: Invert Regex enabled (saved to user settings)'
                : 'DimSumLines: Invert Regex disabled (saved to user settings)'
        );
    });

    // Register regex pattern management command
    const manageRegexPatternsCommand = vscode.commands.registerCommand('dimsumlines.manageRegexPatterns', async () => {
        const config = vscode.workspace.getConfiguration('dimsumlines');
        const patterns: string[] = config.get('regexPatterns', []);
        
        if (patterns.length === 0) {
            vscode.window.showInformationMessage('No regex patterns found. Use "Add Regex Pattern" to add some.');
            return;
        }
        
        // Create quick pick items with delete buttons
        const items = patterns.map((pattern, index) => ({
            label: pattern,
            description: `Pattern ${index + 1}`,
            detail: 'Click to delete this pattern',
            pattern: pattern,
            index: index
        }));
        
        const selected = await vscode.window.showQuickPick(items, {
            title: 'Manage Regex Patterns',
            placeHolder: 'Select a pattern to delete'
        });
        
        if (selected) {
            // Remove the selected pattern
            const updatedPatterns = patterns.filter((_, i) => i !== selected.index);
            await config.update('regexPatterns', updatedPatterns, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Deleted pattern: ${selected.pattern} (saved to user settings)`);
        }
    });

    // Initialize
    updateStatusBar();
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        updateDecorations(editor);
    }

    // Add to subscriptions
    context.subscriptions.push(
        statusBarItem, 
        toggleDimmingCommand,
        selectModeCommand,
        addRegexPatternCommand,
        clearRegexPatternsCommand,
        toggleInvertRegexCommand,
        manageRegexPatternsCommand
    );
}