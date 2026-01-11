class NoahLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.startAnimationCycle();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: auto;
        }
        
        svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        polyline {
          stroke-width: 4;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke-width 0.3s ease;
          stroke: white;
        }

        polyline:hover {
          stroke-width: 5;
        }

        #first { stroke-dasharray: 2000; stroke-dashoffset: 2000; }
        #second { stroke-dasharray: 3000; stroke-dashoffset: 3000; }
        #third { stroke-dasharray: 1500; stroke-dashoffset: 1500; }
        #fourth { stroke-dasharray: 1500; stroke-dashoffset: 1500; }
        #fifth { stroke-dasharray: 2000; stroke-dashoffset: 2000; }
        #sixth { stroke-dasharray: 1500; stroke-dashoffset: 1500; }

        @keyframes draw1 { to { stroke-dashoffset: 0; } }
        @keyframes draw2 { to { stroke-dashoffset: 0; } }
        @keyframes draw3 { to { stroke-dashoffset: 0; } }
        @keyframes draw4 { to { stroke-dashoffset: 0; } }
        @keyframes draw5 { to { stroke-dashoffset: 0; } }
        @keyframes draw6 { to { stroke-dashoffset: 0; } }

        @keyframes undraw1 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -2000; } }
        @keyframes undraw2 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -3000; } }
        @keyframes undraw3 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1500; } }
        @keyframes undraw4 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1500; } }
        @keyframes undraw5 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -2000; } }
        @keyframes undraw6 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1500; } }
      </style>

      <svg viewBox="0 -50 1500 450" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <polyline id="first" points="100,200 200,0 200,200 100,400 0,400" filter="url(#glow)"/>
        <polyline id="second" points="300,0 400,0 200,400 300,400 425,150 725,150 600,400 700,400 825,150 1025,150 1050,100 950,100" filter="url(#glow)"/>
        <polyline id="third" points="500,400 400,400 500,200 600,200 525,350" filter="url(#glow)"/>
        <polyline id="fourth" points="900,400 800,400 900,200 1000,200 925,350" filter="url(#glow)"/>
        <polyline id="fifth" points="1100,400 1000,400 1200,0 1300,0 1125,350" filter="url(#glow)"/>
        <polyline id="sixth" points="1300,400 1200,400 1300,200 1400,200 1325,350" filter="url(#glow)"/>
      </svg>
    `;
  }

  startAnimationCycle() {
    const letters = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
    const drawDelays = [0.25, 0.4, 0.65, 0.8, 0.95, 1.05];
    const undrawDelays = [3.05, 3.2, 3.45, 3.6, 3.75, 3.85];
    const dashArrays = [2000, 3000, 1500, 1500, 2000, 1500];

    // Helper to access shadow DOM elements
    const getEl = (id) => this.shadowRoot.getElementById(id);

    const resetAnimations = () => {
      letters.forEach((id, index) => {
        const element = getEl(id);
        if (!element) return;
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.strokeDashoffset = dashArrays[index];
      });
    };

    const startAnimation = () => {
      letters.forEach((id, index) => {
        const element = getEl(id);
        if (!element) return;
        const drawDelay = drawDelays[index];
        const undrawDelay = undrawDelays[index];
        
        element.style.animation = `
          draw${index + 1} 1s ${drawDelay}s forwards,
          undraw${index + 1} 1s ${undrawDelay}s forwards
        `;
      });
    };

    const runCycle = () => {
      resetAnimations();
      setTimeout(() => {
        startAnimation();
        
        const randomDelay = Math.random() * 5000;
        const totalCycleTime = 5000 + randomDelay;
        
        // Save timeout ID to clear on disconnect if needed (cleanup is good practice)
        this.timeoutId = setTimeout(runCycle, totalCycleTime);
      }, 10);
    };

    runCycle();
  }

  disconnectedCallback() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

customElements.define('noah-logo', NoahLogo);
