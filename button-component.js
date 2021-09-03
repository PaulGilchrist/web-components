'use strict';
window.customElements.define('my-button', class Button extends HTMLElement {


  get disabled() { return this.hasAttribute('disabled'); }  
  set disabled(val) {
    // Reflect the value of `disabled` as an attribute.
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  get label() { return this.getAttribute('label'); }
  set label(value) { this.setAttribute('label', value); }

  constructor() {
    super();
    const template = this.createTemplate();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$container = this._shadowRoot.querySelector('.container');
    this.$button = this._shadowRoot.querySelector('button');
    this.$button.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('onClick', {
          detail: 'Hello from within the Custom Element',
        })
      );
    });
  }

  static get observedAttributes() {
    // The only attributes that will trigger attributeChangedCallback()
    return ['disabled', 'label'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Called when an observed attribute has been added, removed, updated, or replaced
    this.render();
  }

  connectedCallback() {
    // Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching resources or rendering. Generally, you should try to delay work until this time.
    // If there is an existent attribute called as-atom set on the element, it will reset our button container's padding to zero
    if (this.hasAttribute('as-atom')) {
      this.$container.style.padding = '0px';
    }
  }

  disconnectedCallback(name, constructor, options) {
    // Called every time the element is removed from the DOM. Useful for running clean up code.
  }

  render() {
    this.$button.innerHTML = this.label;
  }

  createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .container {
          padding: 8px;
        }    
        button {
          display: block;
          overflow: hidden;
          position: relative;
          padding: 0 16px;
          font-size: 16px;
          font-weight: bold;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          outline: none;    
          width: 100%;
          height: 40px;    
          box-sizing: border-box;
          border: 1px solid #a1a1a1;
          background: #ffffff;
          box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
          color: #363636;
          cursor: pointer;
        }
      </style>    
      <div class="container">
        <button>Label</button>
      </div>
    `;
    return template;
  }

});
