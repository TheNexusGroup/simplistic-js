// Simplest.js Router - Natural routing for single page applications

class SimplestRouter {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.rootElement = null;
    this.initialized = false;
    
    // Bind to popstate for browser back/forward
    window.addEventListener('popstate', () => {
      this._handleRoute();
    });
    
    // Intercept link clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
        const path = new URL(e.target.href).pathname;
        if (this.routes.has(path)) {
          e.preventDefault();
          this.navigate(path);
        }
      }
    });
  }
  
  // Define a route
  route(path, handler) {
    this.routes.set(path, handler);
    
    // If this is the current path and we haven't rendered yet, render it
    if (!this.initialized && window.location.pathname === path) {
      this._handleRoute();
      this.initialized = true;
    }
    
    return this;
  }
  
  // Navigate to a route
  navigate(path) {
    if (this.routes.has(path)) {
      window.history.pushState(null, '', path);
      this._handleRoute();
    } else {
      console.warn(`No route defined for ${path}`);
    }
  }
  
  // Handle route changes
  _handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes.get(path);
    
    if (handler) {
      this.currentRoute = path;
      
      // Clear the root element
      if (!this.rootElement) {
        // Find or create root element
        this.rootElement = document.getElementById('app') || document.body;
      }
      
      // Clear existing content
      this.rootElement.innerHTML = '';
      
      // Reset context stack if using simplest
      if (window.simplestEngine) {
        window.simplestEngine.contextStack = [this.rootElement];
      }
      
      // Execute the route handler
      handler();
    } else {
      // Try to find a default or 404 route
      const notFoundHandler = this.routes.get('*') || this.routes.get('/404');
      if (notFoundHandler) {
        notFoundHandler();
      }
    }
  }
  
  // Set the root element for rendering
  setRoot(element) {
    this.rootElement = element;
    return this;
  }
  
  // Start the router
  start() {
    this._handleRoute();
    this.initialized = true;
    return this;
  }
}

// Create singleton instance
const router = new SimplestRouter();

// Export functions
export const route = (path, handler) => router.route(path, handler);
export const navigate = (path) => router.navigate(path);
export const setRoot = (element) => router.setRoot(element);
export const startRouter = () => router.start();

// Also export the router instance for advanced usage
export { router };