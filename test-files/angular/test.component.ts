// Test file to validate Angular ESLint configuration
import { Component, Directive, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Wrong component selector prefix (should be 'app', not 'my')
@Component({
  selector: 'my-test-component',
  template: `
    <div>
      <button>Click me</button>
    </div>
  `,
})
export class TestComponent {
  @Input() data: any;

  constructor(private http: HttpClient) {}
}

// Wrong directive selector prefix (should be 'app', not 'my')
// Wrong style (should be camelCase, not kebab-case)
@Directive({
  selector: '[my-highlight]',
})
export class HighlightDirective {
  constructor() {}
}
