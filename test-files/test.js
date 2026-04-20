// Test file to validate ESLint configuration
import React from 'react';
import { useState } from 'react';

// Test unused imports (should be caught)

// Test unused variables
const unusedVar = 'test';

// Test dot-notation (should be caught)
const obj = { foo: 1 };
const viaBracket = obj['foo'];

// Test no-restricted-globals for parseInt/parseFloat (should be caught)
const int = parseInt('42', 10);
const float = parseFloat('3.14');

// Test no-implicit-coercion (should be caught)
const asBool = !!viaBracket;
const asNum = +int;

// Test React component with accessibility and other rules
const TestComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* Test anchor without proper text */}
      <a href="/test">click here</a>

      {/* Test useless fragment */}
      <span>text</span>

      {/* Test HTML styling elements */}
      <b>Bold text</b>
      <i>Italic text</i>

      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};

export default TestComponent;
