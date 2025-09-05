// Simplistic - Natural Web Development Syntax
// Core library implementation

type StyleProps = {
  // Layout
  row?: boolean
  col?: boolean
  center?: boolean
  between?: boolean
  around?: boolean
  gap?: number
  
  // Sizing
  full?: boolean
  width?: number | string
  height?: number | string
  
  // Spacing
  pad?: number | [number, number]
  margin?: number | [number, number]
  
  // Visual
  bg?: string
  color?: string
  rounded?: boolean | number
  shadow?: boolean
  border?: boolean | string
  
  // Text
  bold?: boolean
  italic?: boolean
  size?: number
  strike?: boolean
  small?: boolean
  gray?: boolean
  
  // Interactive
  hover?: Partial<StyleProps>
  clickable?: boolean
  
  // Animation
  fadeIn?: boolean
  animate?: string | AnimationProps
  
  // Events
  onClick?: () => void
  onEnter?: (value: string) => void
}

type AnimationProps = {
  from?: Record<string, any>
  to?: Record<string, any>
  duration?: number
}

// Context stack for nested rendering
let contextStack: HTMLElement[] = [document.body]

function getCurrentContext(): HTMLElement {
  return contextStack[contextStack.length - 1]
}

function pushContext(element: HTMLElement) {
  contextStack.push(element)
}

function popContext() {
  if (contextStack.length > 1) {
    contextStack.pop()
  }
}

// Export for use in extended module
export { StyleProps, getCurrentContext }

// Style application
export function applyStyles(element: HTMLElement, props: StyleProps = {}) {
  const style = element.style
  
  // Layout
  if (props.row || props.col) {
    style.display = 'flex'
    style.flexDirection = props.row ? 'row' : 'column'
  }
  
  if (props.center) {
    if (style.display === 'flex') {
      style.justifyContent = 'center'
      style.alignItems = 'center'
    } else {
      style.textAlign = 'center'
    }
  }
  
  if (props.between) style.justifyContent = 'space-between'
  if (props.around) style.justifyContent = 'space-around'
  if (props.gap) style.gap = `${props.gap}px`
  
  // Sizing
  if (props.full) {
    style.width = '100%'
    style.height = '100%'
  }
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  
  // Spacing
  if (props.pad) {
    if (Array.isArray(props.pad)) {
      style.padding = `${props.pad[0]}px ${props.pad[1]}px`
    } else {
      style.padding = `${props.pad}px`
    }
  }
  if (props.margin) {
    if (Array.isArray(props.margin)) {
      style.margin = `${props.margin[0]}px ${props.margin[1]}px`
    } else {
      style.margin = `${props.margin}px`
    }
  }
  
  // Visual
  if (props.bg) style.backgroundColor = props.bg
  if (props.color) style.color = props.color
  if (props.rounded) {
    style.borderRadius = props.rounded === true ? '8px' : `${props.rounded}px`
  }
  if (props.shadow) style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
  if (props.border) {
    if (props.border === true) {
      style.border = '1px solid #ddd'
    } else {
      style.border = `1px solid ${props.border}`
    }
  }
  
  // Text
  if (props.bold) style.fontWeight = 'bold'
  if (props.italic) style.fontStyle = 'italic'
  if (props.size) style.fontSize = `${props.size}px`
  if (props.strike) style.textDecoration = 'line-through'
  if (props.small) style.fontSize = '0.875rem'
  if (props.gray) style.color = '#666'
  
  // Interactive
  if (props.clickable || props.onClick) {
    style.cursor = 'pointer'
  }
  
  // Animation
  if (props.fadeIn) {
    style.opacity = '0'
    style.animation = 'fadeIn 0.3s ease-out forwards'
  }
  
  // Events
  if (props.onClick) {
    element.addEventListener('click', props.onClick)
  }
  
  // Hover effects
  if (props.hover) {
    element.addEventListener('mouseenter', () => {
      const hoverStyles: Record<string, string> = {}
      if (props.hover!.bg) hoverStyles.backgroundColor = props.hover!.bg
      if (props.hover!.color) hoverStyles.color = props.hover!.color
      
      Object.assign(element.style, hoverStyles)
    })
    
    element.addEventListener('mouseleave', () => {
      if (props.hover!.bg && props.bg) element.style.backgroundColor = props.bg
      if (props.hover!.color && props.color) element.style.color = props.color
    })
  }
}

// Core element creators
export function div(props?: StyleProps, ...children: (HTMLElement | string)[]) {
  const element = document.createElement('div')
  applyStyles(element, props)
  
  if (children.length > 0) {
    pushContext(element)
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    })
    popContext()
  }
  
  getCurrentContext().appendChild(element)
  return element
}

export function h1(text: string, props?: StyleProps) {
  const element = document.createElement('h1')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function h2(text: string, props?: StyleProps) {
  const element = document.createElement('h2')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function p(text: string, props?: StyleProps) {
  const element = document.createElement('p')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function button(text: string, props?: StyleProps & { primary?: boolean, ghost?: boolean, small?: boolean }) {
  const element = document.createElement('button')
  element.textContent = text
  
  // Default button styles
  const buttonProps = {
    pad: props?.small ? [6, 12] : [12, 24],
    rounded: true,
    border: 'transparent',
    cursor: 'pointer',
    ...props
  } as StyleProps
  
  if (props?.primary) {
    buttonProps.bg = '#007bff'
    buttonProps.color = 'white'
  } else if (props?.ghost) {
    buttonProps.bg = 'transparent'
    buttonProps.border = '#007bff'
    buttonProps.color = '#007bff'
  } else {
    buttonProps.bg = '#f8f9fa'
    buttonProps.border = '#dee2e6'
    buttonProps.color = '#212529'
  }
  
  applyStyles(element, buttonProps)
  getCurrentContext().appendChild(element)
  return element
}

export function input(props?: StyleProps & { 
  placeholder?: string
  type?: string
  value?: string
  size?: 'small' | 'large'
}) {
  const element = document.createElement('input') as HTMLInputElement
  
  if (props?.placeholder) element.placeholder = props.placeholder
  if (props?.type) element.type = props.type
  if (props?.value) element.value = props.value
  
  const inputProps = {
    pad: props?.size === 'large' ? [12, 16] : props?.size === 'small' ? [6, 8] : [8, 12],
    border: '#ddd',
    rounded: 4,
    ...props
  } as StyleProps
  
  // Handle onEnter
  if (props?.onEnter) {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        props.onEnter!(element.value)
      }
    })
  }
  
  applyStyles(element, inputProps)
  getCurrentContext().appendChild(element)
  
  // Add clear method
  (element as any).clear = () => element.value = ''
  
  return element
}

export function img(src: string, props?: StyleProps & {
  alt?: string
  size?: number
  round?: boolean
  cover?: boolean
}) {
  const element = document.createElement('img')
  element.src = src
  if (props?.alt) element.alt = props.alt
  
  const imgProps = { ...props } as StyleProps
  
  if (props?.size) {
    imgProps.width = props.size
    imgProps.height = props.size
  }
  
  if (props?.round) {
    imgProps.rounded = '50%'
  }
  
  if (props?.cover) {
    element.style.objectFit = 'cover'
  }
  
  applyStyles(element, imgProps)
  getCurrentContext().appendChild(element)
  return element
}

// App wrapper
export function app(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn)
  } else {
    fn()
  }
}

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`
document.head.appendChild(style)