// Test file to validate ESLint configuration
import React from 'react';
import { useState } from 'react';

// Test unused imports (should be caught)

// Test unused variables
const unusedVar = 'test';

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
