export const SINGLE_THEME = 'single-color'

export function handleEditorBeforeMount(monaco) {
  monaco.editor.defineTheme(SINGLE_THEME, {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: '', foreground: '7ec8e3' },
      { token: 'comment', foreground: '7ec8e3' },
      { token: 'keyword', foreground: '7ec8e3' },
      { token: 'string', foreground: '7ec8e3' },
      { token: 'number', foreground: '7ec8e3' },
      { token: 'type', foreground: '7ec8e3' },
      { token: 'identifier', foreground: '7ec8e3' },
      { token: 'delimiter', foreground: '7ec8e3' },
      { token: 'tag', foreground: '7ec8e3' },
      { token: 'attribute', foreground: '7ec8e3' },
      { token: 'variable', foreground: '7ec8e3' },
      { token: 'constant', foreground: '7ec8e3' },
      { token: 'regexp', foreground: '7ec8e3' },
      { token: 'annotation', foreground: '7ec8e3' },
      { token: 'operator', foreground: '7ec8e3' },
      { token: 'function', foreground: '7ec8e3' },
      { token: 'parameter', foreground: '7ec8e3' },
      { token: 'property', foreground: '7ec8e3' },
      { token: 'meta', foreground: '7ec8e3' },
      { token: 'invalid', foreground: '7ec8e3' },
    ],
    colors: {
      'editor.background': '#0c0c10',
      'editor.foreground': '#d4c8e6',
      'editor.background': '#120f17',
      'editorCursor.foreground': '#a855f7',
      'editor.inactiveSelectionBackground': '#152025',
      'editorBracketMatch.background': '#1a2a30',
      'editorBracketMatch.border': '#2a4a55',
      'editorIndentGuide.background': '#0f1518',
      'editorIndentGuide.activeBackground': '#1a2a30',
      'editor.selectionHighlightBackground': '#152025',
      'editor.wordHighlightBackground': '#152025',
      'editor.wordHighlightStrongBackground': '#152025',
    },
  })
}
