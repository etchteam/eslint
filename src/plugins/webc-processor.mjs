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
    const match = def.open.exec(line);

    if (match) {
      return { match, close: def.close, type: def.getType(line, match) };
    }
  }

  return null;
}

/**
 * Handle a line that opens a new block. Returns the block if it's a
 * single-line block, or the parser state for a multi-line block.
 *
 * @param {string} line
 * @param {{ match: RegExpMatchArray, close: RegExp, type: string }} opened
 * @param {number} lineIndex
 * @param {number} currentCharOffset
 * @returns {{ block: object } | { state: object }}
 */
function handleOpenTag(line, opened, lineIndex, currentCharOffset) {
  const tagEnd = line.indexOf('>', opened.match.index) + 1;
  const closeMatch = opened.close.exec(line);

  if (closeMatch && closeMatch.index > opened.match.index) {
    return {
      block: {
        code: line.slice(tagEnd, closeMatch.index),
        startLine: lineIndex + 1,
        charOffset: currentCharOffset + tagEnd,
        type: opened.type,
      },
    };
  }

  const afterTag = line.slice(tagEnd);
  const hasContentOnSameLine = afterTag.trim();

  return {
    state: {
      closePattern: opened.close,
      blockType: opened.type,
      blockLines: hasContentOnSameLine ? [afterTag] : [],
      blockStartLine: hasContentOnSameLine ? lineIndex + 1 : lineIndex + 2,
      blockCharOffset: hasContentOnSameLine
        ? currentCharOffset + tagEnd
        : currentCharOffset + line.length + 1,
    },
  };
}

/**
 * Handle a line while inside a block. Returns the completed block if the
 * closing tag is found, or null to continue accumulating.
 *
 * @param {string} line
 * @param {RegExp} closePattern
 * @param {string[]} blockLines
 * @param {number} blockStartLine
 * @param {number} blockCharOffset
 * @param {string} blockType
 * @returns {{ code: string, startLine: number, charOffset: number, type: string } | null}
 */
function handleBlockLine(
  line,
  closePattern,
  blockLines,
  blockStartLine,
  blockCharOffset,
  blockType,
) {
  const closeMatch = closePattern.exec(line);

  if (!closeMatch) {
    blockLines.push(line);
    return null;
  }

  const beforeClose = line.slice(0, closeMatch.index);

  if (beforeClose.trim()) {
    blockLines.push(beforeClose);
  }

  const code = blockLines.join('\n');

  if (!code.trim()) {
    return null;
  }

  return {
    code: code + '\n',
    startLine: blockStartLine,
    charOffset: blockCharOffset,
    type: blockType,
  };
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

    if (insideBlock) {
      const completed = handleBlockLine(
        line,
        closePattern,
        blockLines,
        blockStartLine,
        blockCharOffset,
        blockType,
      );

      if (completed) {
        blocks.push(completed);
        insideBlock = false;
        closePattern = null;
        blockLines = [];
      }
    } else {
      const opened = matchOpenTag(line);

      if (opened) {
        const result = handleOpenTag(line, opened, i, currentCharOffset);

        if (result.block) {
          blocks.push(result.block);
        } else {
          insideBlock = true;
          closePattern = result.state.closePattern;
          blockType = result.state.blockType;
          blockLines = result.state.blockLines;
          blockStartLine = result.state.blockStartLine;
          blockCharOffset = result.state.blockCharOffset;
        }
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
 * @param {import('eslint').Linter.LintMessage} message
 * @param {number} lineOffset
 * @param {number} charOffset
 * @returns {import('eslint').Linter.LintMessage}
 */
function adjustMessage(message, lineOffset, charOffset) {
  return {
    ...message,
    line: message.line + lineOffset,
    endLine: message.endLine != null ? message.endLine + lineOffset : undefined,
    fix: message.fix
      ? {
          range: [
            message.fix.range[0] + charOffset,
            message.fix.range[1] + charOffset,
          ],
          text: message.fix.text,
        }
      : undefined,
  };
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

    if (meta) {
      const lineOffset = meta.startLine - 1;

      for (const message of blockMessages) {
        result.push(adjustMessage(message, lineOffset, meta.charOffset));
      }
    } else {
      result.push(...blockMessages);
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
