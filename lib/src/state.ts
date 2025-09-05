// Reactive State Management for Simplistic

type StateListener<T> = (value: T) => void

export class State<T> {
  private _value: T
  private listeners: Set<StateListener<T>> = new Set()
  private computedStates: Set<ComputedState<any>> = new Set()

  constructor(initialValue: T) {
    this._value = initialValue
  }

  get value(): T {
    return this._value
  }

  set value(newValue: T) {
    if (newValue !== this._value) {
      this._value = newValue
      this.notify()
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener(this._value))
    this.computedStates.forEach(computed => computed.recompute())
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  map<U>(fn: (value: T) => U): ComputedState<U> {
    return new ComputedState(() => fn(this._value), [this])
  }

  when(condition: (value: T) => boolean, callback: () => HTMLElement): ConditionalElement {
    return new ConditionalElement(() => condition(this._value), callback, [this])
  }

  // For arrays/objects
  push(item: T extends any[] ? T[0] : never): void {
    if (Array.isArray(this._value)) {
      (this._value as any[]).push(item)
      this.notify()
    }
  }

  filter<U extends T>(predicate: T extends any[] ? (item: T[0]) => boolean : never): T extends any[] ? T[0][] : never {
    if (Array.isArray(this._value)) {
      return (this._value as any[]).filter(predicate) as any
    }
    throw new Error('filter() can only be used on array states')
  }
}

export class ComputedState<T> {
  private _value: T
  private computeFn: () => T
  private dependencies: State<any>[]
  private listeners: Set<StateListener<T>> = new Set()

  constructor(computeFn: () => T, dependencies: State<any>[]) {
    this.computeFn = computeFn
    this.dependencies = dependencies
    this._value = computeFn()

    // Subscribe to dependencies
    dependencies.forEach(dep => {
      dep.computedStates.add(this)
    })
  }

  get value(): T {
    return this._value
  }

  recompute() {
    const newValue = this.computeFn()
    if (newValue !== this._value) {
      this._value = newValue
      this.listeners.forEach(listener => listener(this._value))
    }
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  toString(): string {
    return String(this._value)
  }
}

export class ConditionalElement {
  private conditionFn: () => boolean
  private elementFn: () => HTMLElement
  private dependencies: State<any>[]
  private currentElement: HTMLElement | null = null
  private placeholder: Comment

  constructor(conditionFn: () => boolean, elementFn: () => HTMLElement, dependencies: State<any>[]) {
    this.conditionFn = conditionFn
    this.elementFn = elementFn
    this.dependencies = dependencies
    
    this.placeholder = document.createComment('conditional')
    document.body.appendChild(this.placeholder)

    // Initial render
    this.update()

    // Subscribe to dependencies
    dependencies.forEach(dep => {
      dep.subscribe(() => this.update())
    })
  }

  private update() {
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
export function state<T>(initialValue: T): State<T> {
  return new State(initialValue)
}

// For iterating over arrays in templates
export function each<T>(
  items: T[] | State<T[]>, 
  renderFn: (item: T, index: number) => HTMLElement
): IteratedElements<T> {
  return new IteratedElements(items, renderFn)
}

export class IteratedElements<T> {
  private items: T[] | State<T[]>
  private renderFn: (item: T, index: number) => HTMLElement
  private elements: HTMLElement[] = []
  private container: HTMLElement

  constructor(items: T[] | State<T[]>, renderFn: (item: T, index: number) => HTMLElement) {
    this.items = items
    this.renderFn = renderFn
    
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

  private render() {
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
export function reactiveText(state: State<any> | ComputedState<any>): Text {
  const textNode = document.createTextNode(String(state.value))
  
  state.subscribe(value => {
    textNode.textContent = String(value)
  })
  
  return textNode
}