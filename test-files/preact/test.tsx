// Test file to validate Preact ESLint configuration
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Preact component with various violations
const TestComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* Missing alt attribute (accessibility violation) */}
      <img src="/test.jpg" />

      {/* Anchor without proper text */}
      <a href="/test">click here</a>

      {/* Useless fragment */}
      <Fragment>
        <span>text</span>
      </Fragment>

      {/* Forbidden HTML elements from React config */}
      <b>Bold text</b>
      <i>Italic text</i>

      {/* Button with handler */}
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
};

export default TestComponent;
