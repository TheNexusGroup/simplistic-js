// Reactive State Management for Simplistic

export class State {
  constructor(initialValue) {
    this._value = initialValue
    this.listeners = new Set()
    this.computedStates = new Set()
  }

  get value() {
    return this._value
  }

  set value(newValue) {
    if (newValue !== this._value) {
      this._value = newValue
      this.notify()
    }
  }

  notify() {
    this.listeners.forEach(listener => listener(this._value))
    this.computedStates.forEach(computed => computed.recompute())
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  map(fn) {
    return new ComputedState(() => fn(this._value), [this])
  }

  when(condition, callback) {
    return new ConditionalElement(() => condition(this._value), callback, [this])
  }

  // For arrays/objects
  push(item) {
    if (Array.isArray(this._value)) {
      this._value.push(item)
      this.notify()
    }
  }

  filter(predicate) {
    if (Array.isArray(this._value)) {
      return this._value.filter(predicate)
    }
    throw new Error('filter() can only be used on array states')
  }
}

export class ComputedState {
  constructor(computeFn, dependencies) {
    this.computeFn = computeFn
    this.dependencies = dependencies
    this._value = computeFn()
    this.listeners = new Set()

    // Subscribe to dependencies
    dependencies.forEach(dep => {
      dep.computedStates.add(this)
    })
  }

  get value() {
    return this._value
  }

  recompute() {
    const newValue = this.computeFn()
    if (newValue !== this._value) {
      this._value = newValue
      this.listeners.forEach(listener => listener(this._value))
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  toString() {
    return String(this._value)
  }
}

export class ConditionalElement {
  constructor(conditionFn, elementFn, dependencies) {
    this.conditionFn = conditionFn
    this.elementFn = elementFn
    this.dependencies = dependencies
    this.currentElement = null
    
    this.placeholder = document.createComment('conditional')
    document.body.appendChild(this.placeholder)

    // Initial render
    this.update()

    // Subscribe to dependencies
    dependencies.forEach(dep => {
      dep.subscribe(() => this.update())
    })
  }

  update() {
    const shouldShow = this.conditionFn()
    
    if (shouldShow && !this.currentElement) {
      // Show element
      this.currentElement = this.elementFn()
      this.placeholder.parentNode?.insertBefore(this.currentElement, this.placeholder)
    } else if (!shouldShow && this.currentElement) {
      // Hide element
      this.currentElement.remove()
      this.currentElement = null
    }
  }
}

// Factory function
export function state(initialValue) {
  return new State(initialValue)
}

// For iterating over arrays in templates
export function each(items, renderFn) {
  return new IteratedElements(items, renderFn)
}

export class IteratedElements {
  constructor(items, renderFn) {
    this.items = items
    this.renderFn = renderFn
    this.elements = []
    
    // Create a container for the iterated elements
    this.container = document.createElement('div')
    this.container.style.display = 'contents' // Don't affect layout
    document.body.appendChild(this.container)

    // Initial render
    this.render()

    // Subscribe to changes if it's a state
    if (items instanceof State) {
      items.subscribe(() => this.render())
    }
  }

  render() {
    // Clear existing elements
    this.elements.forEach(el => el.remove())
    this.elements = []

    // Get current items
    const currentItems = this.items instanceof State ? this.items.value : this.items

    // Render new elements
    currentItems.forEach((item, index) => {
      const element = this.renderFn(item, index)
      this.container.appendChild(element)
      this.elements.push(element)
    })
  }
}

// Helper to make text elements reactive
export function reactiveText(state) {
  const textNode = document.createTextNode(String(state.value))
  
  state.subscribe(value => {
    textNode.textContent = String(value)
  })
  
  return textNode
}