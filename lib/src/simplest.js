// Simplest.js - Natural Web Development
// The library that works exactly as designed

// Auto-detect when DOM is ready and start accepting elements
let isReady = false
let elementQueue = []

function waitForReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            isReady = true
            // Process any queued elements
            elementQueue.forEach(fn => fn())
            elementQueue = []
        })
    } else {
        isReady = true
        fn()
    }
}

// Current container context (starts with body)
let currentContainer = null

function getCurrentContainer() {
    if (!currentContainer) {
        return document.body
    }
    return currentContainer
}

function withContainer(container, fn) {
    const prevContainer = currentContainer
    currentContainer = container
    const result = fn()
    currentContainer = prevContainer
    return result
}

// Style application - same as before but cleaner
function applyStyles(element, props = {}) {
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
    if (props.bg) style.background = props.bg
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
    
    // Transition for hover effects
    if (props.hover) {
        style.transition = 'all 0.2s ease'
    }
    
    // Events
    if (props.onClick) {
        element.addEventListener('click', props.onClick)
    }
    
    // Hover effects
    if (props.hover) {
        element.addEventListener('mouseenter', () => {
            if (props.hover.bg) element.style.background = props.hover.bg
            if (props.hover.color) element.style.color = props.hover.color
            if (props.hover.scale) element.style.transform = `scale(${props.hover.scale})`
        })
        
        element.addEventListener('mouseleave', () => {
            if (props.hover.bg && props.bg) element.style.background = props.bg
            if (props.hover.color && props.color) element.style.color = props.color
            if (props.hover.scale) element.style.transform = 'scale(1)'
        })
    }
}

// Core element creators - these just work when called
export function h1(text, props) {
    const element = document.createElement('h1')
    element.textContent = text
    applyStyles(element, props)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function h2(text, props) {
    const element = document.createElement('h2')
    element.textContent = text
    applyStyles(element, props)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function h3(text, props) {
    const element = document.createElement('h3')
    element.textContent = text
    applyStyles(element, props)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function p(text, props) {
    const element = document.createElement('p')
    element.textContent = text
    applyStyles(element, props)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function div(props, ...children) {
    const element = document.createElement('div')
    applyStyles(element, props)
    
    // Handle children with proper context
    if (children.length > 0) {
        withContainer(element, () => {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child))
                } else if (child && child.nodeType) {
                    element.appendChild(child)
                } else if (typeof child === 'function') {
                    child() // Execute function in this context
                }
            })
        })
    }
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function button(text, props = {}) {
    const element = document.createElement('button')
    element.textContent = text
    
    // Default button styles
    const buttonProps = {
        pad: props.small ? [6, 12] : [12, 24],
        rounded: true,
        border: 'none',
        cursor: 'pointer',
        ...props
    }
    
    if (props.primary) {
        buttonProps.bg = '#007bff'
        buttonProps.color = 'white'
    } else if (props.ghost) {
        buttonProps.bg = 'transparent'
        buttonProps.border = '2px solid #007bff'
        buttonProps.color = '#007bff'
    } else {
        buttonProps.bg = '#f8f9fa'
        buttonProps.border = '1px solid #dee2e6'
        buttonProps.color = '#212529'
    }
    
    applyStyles(element, buttonProps)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function input(props = {}) {
    const element = document.createElement('input')
    
    if (props.placeholder) element.placeholder = props.placeholder
    if (props.type) element.type = props.type
    if (props.value) element.value = props.value
    
    const inputProps = {
        pad: props.size === 'large' ? [12, 16] : props.size === 'small' ? [6, 8] : [8, 12],
        border: '1px solid #ddd',
        rounded: 4,
        ...props
    }
    
    // Handle onEnter
    if (props.onEnter) {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                props.onEnter(element.value)
            }
        })
    }
    
    applyStyles(element, inputProps)
    
    // Add clear method
    element.clear = () => {
        element.value = ''
        return element
    }
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

export function img(src, props = {}) {
    const element = document.createElement('img')
    element.src = src
    if (props.alt) element.alt = props.alt
    
    const imgProps = { ...props }
    
    if (props.size) {
        imgProps.width = props.size
        imgProps.height = props.size
    }
    
    if (props.round) {
        imgProps.rounded = '50%'
    }
    
    if (props.cover) {
        element.style.objectFit = 'cover'
    }
    
    applyStyles(element, imgProps)
    
    const addToDOM = () => getCurrentContainer().appendChild(element)
    
    if (isReady) {
        addToDOM()
    } else {
        elementQueue.push(addToDOM)
    }
    
    return element
}

// Initialize the auto-rendering system
waitForReady(() => {
    // DOM is ready, elements will now auto-append
})

// Add CSS animations
const style = document.createElement('style')
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
`
document.head.appendChild(style)