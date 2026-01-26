// Test file to validate Next.js ESLint configuration
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Anonymous default export (should trigger warning)
export default function () {
  const [count, setCount] = useState(0);
  const router = useRouter();

  // useEffect with missing dependency (should be caught by react-hooks)
  useEffect(() => {
    console.log(count);
  }, []);

  // Conditional hook call (violates rules of hooks)
  if (count > 0) {
    useEffect(() => {
      console.log('conditional effect');
    }, []);
  }

  return (
    <div>
      {/* Using img instead of next/image (Next.js violation) */}
      <img src="/test.jpg" alt="Test" />

      {/* Using anchor tag for internal navigation instead of next/link */}
      <a href="/about">About page</a>

      {/* Missing alt attribute (accessibility violation) */}
      <img src="/another.jpg" />

      {/* Forbidden HTML elements from base React config */}
      <b>Bold text</b>
      <i>Italic text</i>

      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
