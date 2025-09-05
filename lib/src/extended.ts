// Extended Simplistic - Additional DOM Elements and Advanced Components
// This extends the core library with full HTML5 element support

import { StyleProps, applyStyles, getCurrentContext } from './simplest.js'

// Extended HTML5 Elements
export function textarea(props?: StyleProps & {
  placeholder?: string
  value?: string
  rows?: number
  cols?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  onInput?: (value: string) => void
}) {
  const element = document.createElement('textarea') as HTMLTextAreaElement
  
  if (props?.placeholder) element.placeholder = props.placeholder
  if (props?.value) element.value = props.value
  if (props?.rows) element.rows = props.rows
  if (props?.cols) element.cols = props.cols
  
  const textareaProps = {
    pad: [8, 12],
    border: '#ddd',
    rounded: 4,
    resize: props?.resize || 'vertical',
    fontFamily: 'inherit',
    ...props
  } as StyleProps & { resize?: string; fontFamily?: string }
  
  if (props?.onInput) {
    element.addEventListener('input', () => props.onInput!(element.value))
  }
  
  // Apply resize style
  if (textareaProps.resize) {
    element.style.resize = textareaProps.resize
  }
  if (textareaProps.fontFamily) {
    element.style.fontFamily = textareaProps.fontFamily
  }
  
  applyStyles(element, textareaProps)
  getCurrentContext().appendChild(element)
  return element
}

export function select(options: { value: string; label: string }[], props?: StyleProps & {
  value?: string
  onChange?: (value: string) => void
}) {
  const element = document.createElement('select')
  
  options.forEach(option => {
    const optionEl = document.createElement('option')
    optionEl.value = option.value
    optionEl.textContent = option.label
    if (props?.value === option.value) optionEl.selected = true
    element.appendChild(optionEl)
  })
  
  const selectProps = {
    pad: [8, 12],
    border: '#ddd',
    rounded: 4,
    bg: 'white',
    ...props
  } as StyleProps
  
  if (props?.onChange) {
    element.addEventListener('change', () => props.onChange!(element.value))
  }
  
  applyStyles(element, selectProps)
  getCurrentContext().appendChild(element)
  return element
}

export function form(props?: StyleProps & {
  onSubmit?: (data: FormData) => void
}, ...children: HTMLElement[]) {
  const element = document.createElement('form')
  
  if (props?.onSubmit) {
    element.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(element)
      props.onSubmit!(formData)
    })
  }
  
  children.forEach(child => element.appendChild(child))
  
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

// Semantic HTML5 elements
export function nav(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('nav')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function header(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('header')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function footer(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('footer')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function section(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('section')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function article(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('article')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function aside(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('aside')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function main(props?: StyleProps, ...children: HTMLElement[]) {
  const element = document.createElement('main')
  children.forEach(child => element.appendChild(child))
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

// List elements
export function ul(items: string[] | HTMLElement[], props?: StyleProps) {
  const element = document.createElement('ul')
  
  items.forEach(item => {
    const li = document.createElement('li')
    if (typeof item === 'string') {
      li.textContent = item
    } else {
      li.appendChild(item)
    }
    element.appendChild(li)
  })
  
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function ol(items: string[] | HTMLElement[], props?: StyleProps) {
  const element = document.createElement('ol')
  
  items.forEach(item => {
    const li = document.createElement('li')
    if (typeof item === 'string') {
      li.textContent = item
    } else {
      li.appendChild(item)
    }
    element.appendChild(li)
  })
  
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

// Table element
export function table(data: { headers: string[]; rows: (string | HTMLElement)[][] }, props?: StyleProps) {
  const element = document.createElement('table')
  
  // Create header
  if (data.headers.length > 0) {
    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    
    data.headers.forEach(header => {
      const th = document.createElement('th')
      th.textContent = header
      th.style.padding = '12px'
      th.style.fontWeight = 'bold'
      th.style.borderBottom = '2px solid #e2e8f0'
      headerRow.appendChild(th)
    })
    
    thead.appendChild(headerRow)
    element.appendChild(thead)
  }
  
  // Create body
  const tbody = document.createElement('tbody')
  data.rows.forEach(row => {
    const tr = document.createElement('tr')
    
    row.forEach(cell => {
      const td = document.createElement('td')
      td.style.padding = '12px'
      td.style.borderBottom = '1px solid #e2e8f0'
      
      if (typeof cell === 'string') {
        td.textContent = cell
      } else {
        td.appendChild(cell)
      }
      tr.appendChild(td)
    })
    
    tbody.appendChild(tr)
  })
  
  element.appendChild(tbody)
  
  const tableProps = {
    border: '1px solid #e2e8f0',
    rounded: 8,
    bg: 'white',
    width: '100%',
    ...props
  } as StyleProps
  
  element.style.borderCollapse = 'collapse'
  
  applyStyles(element, tableProps)
  getCurrentContext().appendChild(element)
  return element
}

// Advanced UI Components
export function modal(content: HTMLElement, props?: StyleProps & {
  title?: string
  onClose?: () => void
  size?: 'small' | 'medium' | 'large'
}) {
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `
  
  const modal = document.createElement('div')
  const maxWidth = props?.size === 'small' ? '400px' : props?.size === 'large' ? '800px' : '600px'
  
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: ${maxWidth};
    max-height: 90vh;
    overflow-y: auto;
    margin: 20px;
    width: 100%;
  `
  
  if (props?.title) {
    const header = document.createElement('div')
    header.style.cssText = `
      padding: 24px 24px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 24px;
    `
    
    const title = document.createElement('h2')
    title.textContent = props.title
    title.style.margin = '0'
    title.style.fontSize = '24px'
    title.style.fontWeight = 'bold'
    
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '✕'
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #64748b;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    
    const closeModal = () => {
      overlay.remove()
      if (props?.onClose) props.onClose()
    }
    
    closeBtn.addEventListener('click', closeModal)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal()
    })
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', escHandler)
      }
    })
    
    header.appendChild(title)
    header.appendChild(closeBtn)
    modal.appendChild(header)
  }
  
  const contentContainer = document.createElement('div')
  contentContainer.style.padding = '24px'
  contentContainer.appendChild(content)
  modal.appendChild(contentContainer)
  
  overlay.appendChild(modal)
  document.body.appendChild(overlay)
  
  // Focus management for accessibility
  modal.focus()
  
  return {
    close: () => overlay.remove(),
    element: modal
  }
}

export function tooltip(target: HTMLElement, content: string, props?: StyleProps & {
  position?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const tooltip = document.createElement('div')
  tooltip.textContent = content
  tooltip.style.cssText = `
    position: absolute;
    background: #1f2937;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  `
  
  const position = props?.position || 'top'
  
  const showTooltip = () => {
    document.body.appendChild(tooltip)
    const targetRect = target.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    
    let top, left
    
    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 8
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        break
      case 'bottom':
        top = targetRect.bottom + 8
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        left = targetRect.left - tooltipRect.width - 8
        break
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2
        left = targetRect.right + 8
        break
    }
    
    tooltip.style.top = `${top + window.scrollY}px`
    tooltip.style.left = `${left + window.scrollX}px`
    tooltip.style.opacity = '1'
  }
  
  const hideTooltip = () => {
    tooltip.style.opacity = '0'
    setTimeout(() => tooltip.remove(), 200)
  }
  
  target.addEventListener('mouseenter', showTooltip)
  target.addEventListener('mouseleave', hideTooltip)
  
  return { show: showTooltip, hide: hideTooltip }
}

export function accordion(sections: { title: string; content: HTMLElement }[], props?: StyleProps & {
  allowMultiple?: boolean
}) {
  const container = document.createElement('div')
  const allowMultiple = props?.allowMultiple || false
  let openSections: Set<number> = new Set()
  
  sections.forEach((section, index) => {
    const sectionEl = document.createElement('div')
    sectionEl.style.cssText = `
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
    `
    
    const header = document.createElement('button')
    header.textContent = section.title
    header.style.cssText = `
      width: 100%;
      padding: 16px;
      background: #f8fafc;
      border: none;
      text-align: left;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    `
    
    const contentEl = document.createElement('div')
    contentEl.style.cssText = `
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    `
    
    const contentWrapper = document.createElement('div')
    contentWrapper.style.padding = '16px'
    contentWrapper.appendChild(section.content)
    contentEl.appendChild(contentWrapper)
    
    header.addEventListener('click', () => {
      const isOpen = openSections.has(index)
      
      if (!allowMultiple) {
        // Close all other sections
        openSections.forEach(openIndex => {
          if (openIndex !== index) {
            const otherSection = container.children[openIndex] as HTMLElement
            const otherContent = otherSection.querySelector('[style*="max-height"]') as HTMLElement
            otherContent.style.maxHeight = '0'
          }
        })
        openSections.clear()
      }
      
      if (isOpen) {
        contentEl.style.maxHeight = '0'
        openSections.delete(index)
      } else {
        contentEl.style.maxHeight = contentEl.scrollHeight + 'px'
        openSections.add(index)
      }
    })
    
    sectionEl.appendChild(header)
    sectionEl.appendChild(contentEl)
    container.appendChild(sectionEl)
  })
  
  applyStyles(container, props)
  getCurrentContext().appendChild(container)
  return container
}

// Additional heading elements
export function h3(text: string, props?: StyleProps) {
  const element = document.createElement('h3')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function h4(text: string, props?: StyleProps) {
  const element = document.createElement('h4')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function h5(text: string, props?: StyleProps) {
  const element = document.createElement('h5')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function h6(text: string, props?: StyleProps) {
  const element = document.createElement('h6')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

// Inline elements
export function span(text: string, props?: StyleProps) {
  const element = document.createElement('span')
  element.textContent = text
  applyStyles(element, props)
  getCurrentContext().appendChild(element)
  return element
}

export function a(text: string, href: string, props?: StyleProps & { target?: string }) {
  const element = document.createElement('a')
  element.textContent = text
  element.href = href
  if (props?.target) element.target = props.target
  
  const linkProps = {
    color: '#2563eb',
    hover: { color: '#1d4ed8' },
    ...props
  } as StyleProps
  
  applyStyles(element, linkProps)
  getCurrentContext().appendChild(element)
  return element
}