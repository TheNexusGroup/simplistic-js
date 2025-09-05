// Simplest.js v2 - Static Singleton Implementation
// The singleton instantiates at module load and manages everything internally

class SimplestEngine {
  constructor() {
    this.contextStack = [];
    this.ready = false;
    this.queue = [];
    
    // Initialize immediately
    this._init();
  }
  
  _init() {
    if (typeof document === 'undefined') return; // Node.js safety
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.ready = true;
        this._flushQueue();
      });
    } else {
      this.ready = true;
    }
  }
  
  _flushQueue() {
    this.queue.forEach(fn => fn());
    this.queue = [];
  }
  
  get currentContext() {
    return this.contextStack[this.contextStack.length - 1] || document.body;
  }
  
  _execute(fn) {
    if (this.ready) {
      return fn();
    } else {
      this.queue.push(fn);
      return null;
    }
  }
  
  _createElement(tag, content, props = {}) {
    return this._execute(() => {
      const el = document.createElement(tag);
      
      // Handle content
      if (typeof content === 'string') {
        el.textContent = content;
      } else if (content instanceof HTMLElement) {
        el.appendChild(content);
      } else if (Array.isArray(content)) {
        content.forEach(child => {
          if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
          } else if (child instanceof HTMLElement) {
            el.appendChild(child);
          }
        });
      }
      
      // Apply styles
      this._applyStyles(el, props);
      
      // Add to current context
      this.currentContext.appendChild(el);
      
      return el;
    });
  }
  
  _applyStyles(element, props = {}) {
    const style = element.style;
    
    // Layout
    if (props.row) {
      style.display = 'flex';
      style.flexDirection = 'row';
    }
    if (props.col) {
      style.display = 'flex';
      style.flexDirection = 'column';
    }
    if (props.center) {
      if (style.display === 'flex') {
        style.justifyContent = 'center';
        style.alignItems = 'center';
      } else {
        style.textAlign = 'center';
      }
    }
    if (props.between) style.justifyContent = 'space-between';
    if (props.gap) style.gap = `${props.gap}px`;
    
    // Sizing
    if (props.full) {
      style.width = '100%';
      style.height = '100%';
    }
    if (props.width) {
      style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    }
    if (props.height) {
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    }
    
    // Spacing
    if (props.pad) {
      if (Array.isArray(props.pad)) {
        style.padding = `${props.pad[0]}px ${props.pad[1]}px`;
      } else {
        style.padding = `${props.pad}px`;
      }
    }
    if (props.margin) {
      if (Array.isArray(props.margin)) {
        style.margin = `${props.margin[0]}px ${props.margin[1]}px`;
      } else {
        style.margin = `${props.margin}px`;
      }
    }
    
    // Visual
    if (props.bg) style.background = props.bg;
    if (props.color) style.color = props.color;
    if (props.rounded) {
      style.borderRadius = props.rounded === true ? '8px' : `${props.rounded}px`;
    }
    if (props.shadow) style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    if (props.border) {
      style.border = typeof props.border === 'boolean' 
        ? '1px solid #ddd' 
        : `1px solid ${props.border}`;
    }
    
    // Text
    if (props.bold) style.fontWeight = 'bold';
    if (props.italic) style.fontStyle = 'italic';
    if (props.size) style.fontSize = `${props.size}px`;
    if (props.strike) style.textDecoration = 'line-through';
    if (props.small) style.fontSize = '0.875rem';
    if (props.gray) style.color = '#666';
    
    // Interactive
    if (props.onClick) {
      element.addEventListener('click', props.onClick);
      style.cursor = 'pointer';
    }
    
    // Animation
    if (props.fadeIn) {
      style.opacity = '0';
      style.animation = 'simplestkeyframe_fadeIn 0.3s ease-out forwards';
    }
    
    // Hover effects
    if (props.hover) {
      style.transition = 'all 0.2s ease';
      
      const originalStyles = {
        bg: props.bg,
        color: props.color,
        scale: 1
      };
      
      element.addEventListener('mouseenter', () => {
        if (props.hover.bg) style.background = props.hover.bg;
        if (props.hover.color) style.color = props.hover.color;
        if (props.hover.scale) style.transform = `scale(${props.hover.scale})`;
      });
      
      element.addEventListener('mouseleave', () => {
        if (originalStyles.bg) style.background = originalStyles.bg;
        if (originalStyles.color) style.color = originalStyles.color;
        style.transform = `scale(1)`;
      });
    }
  }
  
  // Public API methods
  h1(text, props) {
    return this._createElement('h1', text, props);
  }
  
  h2(text, props) {
    return this._createElement('h2', text, props);
  }
  
  h3(text, props) {
    return this._createElement('h3', text, props);
  }
  
  p(text, props) {
    return this._createElement('p', text, props);
  }
  
  div(props, ...children) {
    return this._execute(() => {
      const el = document.createElement('div');
      this._applyStyles(el, props);
      
      // FIRST: Add div to parent context so it exists in DOM
      this.currentContext.appendChild(el);
      
      // THEN: Push this div as context for children
      this.contextStack.push(el);
      
      // Process children in this context
      children.forEach(child => {
        if (typeof child === 'function') {
          child(); // Execute function in this context
        } else if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          el.appendChild(child);
        }
      });
      
      // Pop context when done
      this.contextStack.pop();
      
      return el;
    });
  }
  
  button(text, props = {}) {
    const buttonProps = {
      pad: props.small ? [6, 12] : [12, 24],
      rounded: true,
      border: 'none',
      cursor: 'pointer',
      ...props
    };
    
    // Default styles based on type
    if (props.primary) {
      buttonProps.bg = buttonProps.bg || '#007bff';
      buttonProps.color = buttonProps.color || 'white';
    } else if (props.ghost) {
      buttonProps.bg = 'transparent';
      buttonProps.border = buttonProps.border || '2px solid #007bff';
      buttonProps.color = buttonProps.color || '#007bff';
    } else {
      buttonProps.bg = buttonProps.bg || '#f8f9fa';
      buttonProps.border = buttonProps.border || '1px solid #dee2e6';
      buttonProps.color = buttonProps.color || '#212529';
    }
    
    return this._createElement('button', text, buttonProps);
  }
  
  input(props = {}) {
    return this._execute(() => {
      const el = document.createElement('input');
      
      if (props.placeholder) el.placeholder = props.placeholder;
      if (props.type) el.type = props.type;
      if (props.value) el.value = props.value;
      
      const inputProps = {
        pad: props.size === 'large' ? [12, 16] : props.size === 'small' ? [6, 8] : [8, 12],
        border: '1px solid #ddd',
        rounded: 4,
        ...props
      };
      
      // Handle onEnter
      if (props.onEnter) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            props.onEnter(el.value);
          }
        });
      }
      
      this._applyStyles(el, inputProps);
      
      // Add clear method
      el.clear = () => {
        el.value = '';
        return el;
      };
      
      this.currentContext.appendChild(el);
      
      return el;
    });
  }
  
  img(src, props = {}) {
    return this._execute(() => {
      const el = document.createElement('img');
      el.src = src;
      if (props.alt) el.alt = props.alt;
      
      const imgProps = { ...props };
      
      if (props.size) {
        imgProps.width = props.size;
        imgProps.height = props.size;
      }
      
      if (props.round) {
        imgProps.rounded = '50%';
      }
      
      if (props.cover) {
        el.style.objectFit = 'cover';
      }
      
      this._applyStyles(el, imgProps);
      this.currentContext.appendChild(el);
      
      return el;
    });
  }
}

// Create the singleton instance
const engine = new SimplestEngine();

// Make engine globally accessible for components
if (typeof window !== 'undefined') {
  window.simplestEngine = engine;
}

// Add CSS animations once
if (typeof document !== 'undefined' && !document.getElementById('simplest-styles')) {
  const style = document.createElement('style');
  style.id = 'simplest-styles';
  style.textContent = `
    @keyframes simplestkeyframe_fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `;
  document.head.appendChild(style);
}

// Export pre-bound functions - these are what users import
export const h1 = (text, props) => engine.h1(text, props);
export const h2 = (text, props) => engine.h2(text, props);
export const h3 = (text, props) => engine.h3(text, props);
export const p = (text, props) => engine.p(text, props);
export const button = (text, props) => engine.button(text, props);
export const input = (props) => engine.input(props);
export const img = (src, props) => engine.img(src, props);

// Special handling for div to allow both syntax styles
export const div = (props, ...children) => {
  // If props is not an object, treat it as a child
  if (typeof props !== 'object' || props === null || props instanceof HTMLElement) {
    return engine.div({}, props, ...children);
  }
  return engine.div(props, ...children);
};

// Also export the engine for advanced users
export const simplest = engine;