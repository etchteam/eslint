/**
 * Block definitions for each type of inline JavaScript in WebC files.
 * Each entry maps an opening tag pattern to its closing pattern and type resolver.
 */
const BLOCK_DEFS = [
  {
    open: /^(\s*)<script(\s[^>]*)?\s*>/i,
    close: /<\/script\s*>/i,
    getType: (line) => (/webc:setup/.test(line) ? 'script-setup' : 'script'),
  },
  {
    open: /^(\s*)<template\s+webc:type=["'](js|render)["'](\s[^>]*)?\s*>/i,
    close: /<\/template\s*>/i,
    getType: (_line, match) => `template-${match[2]}`,
  },
];

/** @type {Map<string, Array<{ startLine: number, charOffset: number, type: string }>>} */
const blockMetadata = new Map();

/**
 * Try to match a line against all block definitions.
 *
 * @param {string} line
 * @returns {{ match: RegExpMatchArray, close: RegExp, type: string } | null}
 */
function matchOpenTag(line) {
  for (const def of BLOCK_DEFS) {
    const match = line.match(def.open);

    if (match) {
      return { match, close: def.close, type: def.getType(line, match) };
    }
  }

  return null;
}

/**
 * Extract JavaScript blocks from a WebC file.
 *
 * @param {string} text - The full file content
 * @returns {Array<{ code: string, startLine: number, charOffset: number, type: string }>}
 */
function extractBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];

  let insideBlock = false;
  let closePattern = null;
  let blockType = '';
  let blockLines = [];
  let blockStartLine = 0;
  let blockCharOffset = 0;
  let currentCharOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!insideBlock) {
      const opened = matchOpenTag(line);

      if (opened) {
        const tagEnd = line.indexOf('>', opened.match.index) + 1;
        const closeMatch = line.match(opened.close);

        if (closeMatch && closeMatch.index > opened.match.index) {
          // Single-line block: <script>code</script>
          blocks.push({
            code: line.slice(tagEnd, closeMatch.index),
            startLine: i + 1,
            charOffset: currentCharOffset + tagEnd,
            type: opened.type,
          });
        } else {
          insideBlock = true;
          closePattern = opened.close;
          blockType = opened.type;
          blockLines = [];
          blockStartLine = i + 2; // Content starts on next line (1-indexed)
          blockCharOffset = currentCharOffset + line.length + 1;

          const afterTag = line.slice(tagEnd);

          if (afterTag.trim()) {
            blockStartLine = i + 1;
            blockCharOffset = currentCharOffset + tagEnd;
            blockLines.push(afterTag);
          }
        }
      }
    } else {
      const closeMatch = line.match(closePattern);

      if (closeMatch) {
        const beforeClose = line.slice(0, closeMatch.index);

        if (beforeClose.trim()) {
          blockLines.push(beforeClose);
        }

        const code = blockLines.join('\n');

        if (code.trim()) {
          blocks.push({
            code: code + '\n',
            startLine: blockStartLine,
            charOffset: blockCharOffset,
            type: blockType,
          });
        }

        insideBlock = false;
        closePattern = null;
        blockLines = [];
      } else {
        blockLines.push(line);
      }
    }

    currentCharOffset += line.length + 1;
  }

  return blocks;
}

/**
 * @param {string} text
 * @param {string} filename
 * @returns {Array<{ text: string, filename: string }>}
 */
function preprocess(text, filename) {
  const blocks = extractBlocks(text);
  const metadata = [];
  const result = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const virtualFilename = `${filename}/${i}.${block.type}.js`;

    metadata.push({
      startLine: block.startLine,
      charOffset: block.charOffset,
      type: block.type,
    });

    result.push({
      text: block.code,
      filename: virtualFilename,
    });
  }

  blockMetadata.set(filename, metadata);

  return result;
}

/**
 * @param {Array<Array<import('eslint').Linter.LintMessage>>} messages
 * @param {string} filename
 * @returns {Array<import('eslint').Linter.LintMessage>}
 */
function postprocess(messages, filename) {
  const metadata = blockMetadata.get(filename);

  blockMetadata.delete(filename);

  if (!metadata) {
    return messages.flat();
  }

  const result = [];

  for (let i = 0; i < messages.length; i++) {
    const blockMessages = messages[i];
    const meta = metadata[i];

    if (!meta) {
      result.push(...blockMessages);
      continue;
    }

    const lineOffset = meta.startLine - 1;

    for (const message of blockMessages) {
      result.push({
        ...message,
        line: message.line + lineOffset,
        endLine:
          message.endLine != null ? message.endLine + lineOffset : undefined,
        fix: message.fix
          ? {
              range: [
                message.fix.range[0] + meta.charOffset,
                message.fix.range[1] + meta.charOffset,
              ],
              text: message.fix.text,
            }
          : undefined,
      });
    }
  }

  return result;
}

export default {
  meta: {
    name: 'eslint-plugin-webc',
    version: '1.0.0',
  },
  processors: {
    webc: {
      preprocess,
      postprocess,
      supportsAutofix: true,
    },
  },
};
