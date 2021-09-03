'use strict';
window.customElements.define('my-dropdown', class Dropdown extends HTMLElement {

  get label() { return this.getAttribute('label'); }
  set label(value) { this.setAttribute('label', value); }
  get option() { return this.getAttribute('option'); }
  set option(value) { this.setAttribute('option', value); }
  get options() { return JSON.parse(this.getAttribute('options')); }
  set options(value) { this.setAttribute('options', JSON.stringify(value)); }

  constructor() {
    super();
    const template = this.createTemplate();
    this._sR = this.attachShadow({ mode: 'open' });
    this._sR.appendChild(template.content.cloneNode(true));
    this.open = false;
    this.$label = this._sR.querySelector('.label');
    this.$button = this._sR.querySelector('my-button');
    this.$dropdown = this._sR.querySelector('.dropdown');
    this.$dropdownList = this._sR.querySelector('.dropdown-list');
    this.$button.addEventListener('onClick', this.toggleOpen.bind(this));
  }

  static get observedAttributes() {
    // The only attributes that will trigger attributeChangedCallback()
    return ['label', 'option', 'options'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Called when an observed attribute has been added, removed, updated, or replaced
    this.render();
  }

  connectedCallback(name, constructor, options) {
    // Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching resources or rendering. Generally, you should try to delay work until this time.
  }

  disconnectedCallback(name, constructor, options) {
    // Called every time the element is removed from the DOM. Useful for running clean up code.
  }

  render() {
    this.$label.innerHTML = this.label;
    if (this.options) {
      this.$button.setAttribute(
        'label',
        this.options[this.option].label
      );
    }
    this.$dropdownList.innerHTML = '';
    Object.keys(this.options || {}).forEach(key => {
      let option = this.options[key];
      let $option = document.createElement('li');
      $option.innerHTML = option.label;
      if (this.option && this.option === key) {
        $option.classList.add('selected');
      }
      $option.addEventListener('click', () => {
        this.option = key;
        this.toggleOpen();
        this.dispatchEvent(
          new CustomEvent('onChange', { detail: key })
        );
        this.render();
      });
      this.$dropdownList.appendChild($option);
    });
  }

  toggleOpen(event) {
    this.open = !this.open;
    this.open
      ? this.$dropdown.classList.add('open')
      : this.$dropdown.classList.remove('open');
  }

  createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          font-family: sans-serif;
        }    
        .dropdown {
          padding: 3px 8px 8px;
        }
        .dropdown.open .dropdown-list {
          display: flex;
          flex-direction: column;
        }          
        .dropdown-list {
          position: absolute;
          width: 100%;
          display: none;
          max-height: 192px;
          overflow-y: auto;
          margin: 4px 0 0;
          padding: 0;
          background-color: #ffffff;
          border: 1px solid #a1a1a1;
          box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.05), 0 2px 8px 0 rgba(161,161,161, 0.4);
          list-style: none;
        }    
        .dropdown-list li {
          display: flex;
          align-items: center;
          margin: 4px 0;
          padding: 0 7px;
          font-size: 16px;
          height: 40px;
          cursor: pointer;
        }
        .dropdown-list li.selected {
          font-weight: 600;
        }      
        .dropdown-list-container {
          position: relative;
        }      
        .label {
          display: block;
          margin-bottom: 5px;
          color: #000000;
          font-size: 16px;
          font-weight: normal;
          line-height: 16px;
        }      
      </style>
      <div class="dropdown">
        <span class="label">Label</span>    
        <my-button as-atom>Content</my-button>    
        <div class="dropdown-list-container">
          <ul class="dropdown-list"></ul>
        </div>
      </div>
    `;
    return template;
  }

});
