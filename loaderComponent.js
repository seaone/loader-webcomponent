const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      --color: #48f;
      --duration: 1.8s;

      --s: 16px;
      --m: 24px;
      --l: 32px;
      --xl: 40px;
      --size: var(--m);
    }

    .loader-icon {
      display: block;
      width: var(--size);
      height: var(--size);
      cursor: pointer;
    }

    .spinner {
      transform-origin: 50%;
      animation: kit-spinner-rotator var(--duration) linear infinite;
    }

    .path-wrap {
      transform-origin: 50%;
      animation: kit-spinner-dash-rotator var(--duration) ease-in-out infinite;
    }

    .path {
      stroke: var(--color);
      stroke-dasharray: 100;
      stroke-dashoffset: 0;
      animation: kit-spinner-dash var(--duration) ease-in-out infinite;
    }

    .path_bg {
      stroke: rgba(0,0,0,0.16);
    }

    @keyframes kit-spinner-rotator {
      0% {
        transform: rotate(-360deg);
      }
      100% {
        transform: rotate(-90deg);
      }
    }

    @keyframes kit-spinner-dash-rotator {
      0% {
        transform: rotate(-450deg);
      }
      50% {
        transform: rotate(-360deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    @keyframes kit-spinner-dash {
      0% {
        stroke-dashoffset: 100;
      }
      50% {
        stroke-dashoffset: 50;
      }
      100% {
        stroke-dashoffset: 100;
      }
    }
  </style>

  <svg class="loader-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g class="spinner-wrap">
      <g class="spinner">
        <circle class="path_bg" stroke-width="2" cx="16" cy="16" fill="none" r="12"/>
        <g class="path-wrap">
          <circle class="path" stroke-width="2" cx="16" cy="16" fill="none" r="12"/>
        </g>
      </g>
    </g>
  </svg>
`;

class AppLoader extends HTMLElement {
  static get observedAttributes() {
    return ['loader-color', 'duration', 'size'];
  }

  get loaderColor() {
    return this.getAttribute('loader-color');
  }

  set loaderColor(val) {
    this.setAttribute('loader-color', val);
  }

  get duration() {
    return this.getAttribute('duration');
  }

  set duration(val) {
    this.setAttribute('duration', val);
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(val) {
    this.setAttribute('size', val);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._render();
  }

  connectedCallback() {
    if (!this.rendered) {
      this._render();
      this.rendered = true;
    }
  }

  constructor() {
    super();
    this.rootFragment = this.attachShadow({mode: 'open'});

    this.addEventListener('click', this._randomProps);
  }
  
  _render() {
    this.rootFragment.innerHTML = '';
    this.rootFragment.append(template.content.cloneNode(true));
    const circle = this.rootFragment.querySelector('.loader-icon');
    
    circle.style.setProperty('--color', this.loaderColor);
    circle.style.setProperty('--duration', this.duration);
    circle.style.setProperty('--size', `var(--${this.size})`);
  }

  _randomProps() {
    const r = randomNumber(0, 255);
    const g = randomNumber(0, 255);
    const b = randomNumber(0, 255);
    const color = `rgb(${r}, ${g}, ${b})`;
    const sizes = ['s', 'm', 'l', 'xl'];

    this.loaderColor = color;
    this.duration = `${randomNumber(1, 10)}s`;
    this.size = sizes[randomNumber(0, 3)];
  }
}

function randomNumber(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

window.customElements.define('app-loader', AppLoader);
