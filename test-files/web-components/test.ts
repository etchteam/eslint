// Test file to validate Web Components (Lit) ESLint configuration
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Unused import (should be caught by base config)

// Unused variable (should be caught by base config)
const unusedVar = 'test';

// Web Component with Lit
@customElement('test-component')
export class TestComponent extends LitElement {
  // Using any type (should trigger warning)
  @property({ type: Object })
  data: any;

  @state()
  private count = 0;

  // Attribute binding with invalid type (Lit violation)
  // Binding to a native attribute that expects string but providing object
  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`
      <div>
        <!-- Binding issues that Lit plugin should catch -->
        <div .id=${this.data}></div>

        <!-- Using attribute binding where property binding is more appropriate -->
        <input value=${this.count} />

        <button @click=${this._increment}>Count: ${this.count}</button>
      </div>
    `;
  }

  private _increment() {
    this.count++;
  }
}

// Another component without proper decorator
export class UnregisteredComponent extends LitElement {
  render() {
    return html`<div>Not registered</div>`;
  }
}
