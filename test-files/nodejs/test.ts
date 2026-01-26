// Test file to validate Node.js ESLint configuration
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Using any type (should trigger warning)
function processData(data: any): any {
  return data;
}

// Security: eval usage (should be caught by security plugin)
function dangerousEval(code: string) {
  return eval(code);
}

// Security: non-literal require (should be caught by security plugin)
function dynamicRequire(moduleName: string) {
  return require(moduleName);
}

// Using Node.js globals (should work with nodejs config)
async function main() {
  const filePath = path.join(__dirname, 'data.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  // Using process and Buffer (Node.js globals)
  console.log(process.env.NODE_ENV);
  const buffer = Buffer.from('test');

  return { hash, buffer };
}

export { processData, dangerousEval, dynamicRequire, main };
