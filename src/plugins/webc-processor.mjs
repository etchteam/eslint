// eslint-disable-next-line security/detect-unsafe-regex
const SCRIPT_OPEN = /^(\s*)<script(\s[^>]*)?\s*>/i;
const SCRIPT_CLOSE = /<\/script\s*>/i;
const TEMPLATE_OPEN =
  // eslint-disable-next-line security/detect-unsafe-regex
  /^(\s*)<template\s+webc:type=["'](js|render)["'](\s[^>]*)?\s*>/i;
const TEMPLATE_CLOSE = /<\/template\s*>/i;
const WEBC_SETUP = /webc:setup/;

/** @type {Map<string, Array<{ startLine: number, charOffset: number, type: string }>>} */
const blockMetadata = new Map();

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

  // Track character offset as we walk through lines
  let currentCharOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!insideBlock) {
      let match = line.match(SCRIPT_OPEN);

      if (match) {
        insideBlock = true;
        closePattern = SCRIPT_CLOSE;
        blockType = WEBC_SETUP.test(line) ? 'script-setup' : 'script';
        blockLines = [];

        // Content after the opening tag on the same line
        const tagEnd = line.indexOf('>', match.index) + 1;
        const closeMatch = line.match(SCRIPT_CLOSE);

        if (closeMatch && closeMatch.index > match.index) {
          // Single-line block: <script>code</script>
          const content = line.slice(tagEnd, closeMatch.index);

          blocks.push({
            code: content,
            startLine: i + 1,
            charOffset: currentCharOffset + tagEnd,
            type: blockType,
          });
          insideBlock = false;
          closePattern = null;
        } else {
          blockStartLine = i + 2; // Content starts on next line (1-indexed)
          blockCharOffset = currentCharOffset + line.length + 1; // +1 for newline

          const afterTag = line.slice(tagEnd);

          if (afterTag.trim()) {
            // Content on same line as opening tag
            blockStartLine = i + 1;
            blockCharOffset = currentCharOffset + tagEnd;
            blockLines.push(afterTag);
          }
        }
      } else {
        match = line.match(TEMPLATE_OPEN);

        if (match) {
          insideBlock = true;
          closePattern = TEMPLATE_CLOSE;
          blockType = `template-${match[2]}`;
          blockLines = [];

          const tagEnd = line.indexOf('>', match.index) + 1;
          const closeMatch = line.match(TEMPLATE_CLOSE);

          if (closeMatch && closeMatch.index > match.index) {
            const content = line.slice(tagEnd, closeMatch.index);

            blocks.push({
              code: content,
              startLine: i + 1,
              charOffset: currentCharOffset + tagEnd,
              type: blockType,
            });
            insideBlock = false;
            closePattern = null;
          } else {
            blockStartLine = i + 2;
            blockCharOffset = currentCharOffset + line.length + 1;

            const afterTag = line.slice(tagEnd);

            if (afterTag.trim()) {
              blockStartLine = i + 1;
              blockCharOffset = currentCharOffset + tagEnd;
              blockLines.push(afterTag);
            }
          }
        }
      }
    } else {
      const closeMatch = line.match(closePattern);

      if (closeMatch) {
        // Content before closing tag on this line
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

    currentCharOffset += line.length + 1; // +1 for newline
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
