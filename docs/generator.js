// Auto-documentation generator for Simplistic.js
// Parses TypeScript source files and generates interactive documentation

import fs from 'fs'
import path from 'path'

class DocumentationGenerator {
    constructor() {
        this.components = new Map()
        this.examples = new Map()
    }
    
    // Parse TypeScript source files
    parseSourceFiles(srcDir) {
        const files = fs.readdirSync(srcDir, { recursive: true })
            .filter(file => file.endsWith('.ts'))
        
        files.forEach(file => {
            const fullPath = path.join(srcDir, file)
            const content = fs.readFileSync(fullPath, 'utf-8')
            this.parseFile(content, file)
        })
    }
    
    // Parse individual TypeScript file
    parseFile(content, filename) {
        const lines = content.split('\n')
        let currentComponent = null
        let inComment = false
        let commentBlock = []
        
        lines.forEach((line, index) => {
            const trimmed = line.trim()
            
            // Detect multi-line comments
            if (trimmed.startsWith('/**') || trimmed.startsWith('/*')) {
                inComment = true
                commentBlock = []
                return
            }
            
            if (inComment) {
                if (trimmed.endsWith('*/')) {
                    inComment = false
                    return
                }
                commentBlock.push(trimmed.replace(/^\s*\*\s?/, ''))
                return
            }
            
            // Detect exported functions
            const exportMatch = trimmed.match(/export\s+function\s+(\w+)\s*\(([^)]*)\)/)
            if (exportMatch) {
                const [, name, params] = exportMatch
                
                // Parse parameter types
                const parsedParams = this.parseParameters(params)
                
                currentComponent = {
                    name,
                    parameters: parsedParams,
                    description: commentBlock.join(' ').trim() || `Creates a ${name} element`,
                    examples: [],
                    file: filename,
                    line: index + 1
                }
                
                this.components.set(name, currentComponent)
                commentBlock = []
            }
            
            // Extract inline examples from comments
            if (trimmed.includes('// Example:') || trimmed.includes('// Usage:')) {
                const exampleMatch = line.match(/\/\/\s*(Example|Usage):\s*(.+)/)
                if (exampleMatch && currentComponent) {
                    currentComponent.examples.push(exampleMatch[2])
                }
            }
        })
    }
    
    // Parse function parameters and their types
    parseParameters(paramString) {
        if (!paramString.trim()) return []
        
        const params = []
        const paramRegex = /(\w+)(\??):\s*([^,]+)/g
        let match
        
        while ((match = paramRegex.exec(paramString)) !== null) {
            const [, name, optional, type] = match
            
            params.push({
                name,
                type: type.trim(),
                optional: !!optional,
                description: this.getParamDescription(name, type)
            })
        }
        
        return params
    }
    
    // Generate parameter descriptions based on common patterns
    getParamDescription(name, type) {
        const descriptions = {
            'text': 'The text content to display',
            'props': 'Styling and configuration properties',
            'children': 'Child elements to nest inside',
            'src': 'The image source URL',
            'href': 'The link destination URL',
            'placeholder': 'Placeholder text for input fields',
            'value': 'The initial or current value',
            'onClick': 'Function to call when clicked',
            'onChange': 'Function to call when value changes',
            'onEnter': 'Function to call when Enter key is pressed'
        }
        
        return descriptions[name] || `${name} parameter`
    }
    
    // Generate HTML documentation
    generateHTML() {
        const components = Array.from(this.components.values())
            .sort((a, b) => a.name.localeCompare(b.name))
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simplistic.js Documentation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 0;
            text-align: center;
        }
        
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 280px;
            height: 100vh;
            background: white;
            border-right: 1px solid #e5e7eb;
            overflow-y: auto;
            padding: 20px;
            z-index: 100;
        }
        
        .content {
            margin-left: 300px;
            padding: 40px 20px;
        }
        
        .nav-item {
            display: block;
            padding: 8px 16px;
            color: #374151;
            text-decoration: none;
            border-radius: 6px;
            margin-bottom: 4px;
            transition: all 0.2s ease;
        }
        
        .nav-item:hover {
            background: #f3f4f6;
            color: #2563eb;
        }
        
        .nav-item.active {
            background: #eff6ff;
            color: #2563eb;
        }
        
        .component-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .component-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .component-description {
            color: #6b7280;
            margin-bottom: 25px;
            font-size: 16px;
        }
        
        .params-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .params-table th,
        .params-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .params-table th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        
        .type-badge {
            background: #eff6ff;
            color: #2563eb;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-family: monospace;
        }
        
        .optional-badge {
            background: #fef3c7;
            color: #92400e;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            margin-left: 8px;
        }
        
        .example-block {
            background: #1f2937;
            color: #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 14px;
            line-height: 1.4;
            overflow-x: auto;
        }
        
        .try-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .try-button:hover {
            background: #2563eb;
        }
        
        .search-box {
            width: 100%;
            padding: 10px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .search-box:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2 style="color: #1f2937; margin-bottom: 20px;">📚 Components</h2>
        <input type="text" class="search-box" placeholder="Search components..." onkeyup="filterComponents(this.value)">
        <div id="nav-links">
            ${components.map(comp => `
                <a href="#${comp.name}" class="nav-item" data-name="${comp.name.toLowerCase()}">
                    ${comp.name}()
                </a>
            `).join('')}
        </div>
    </div>
    
    <div class="content">
        <div class="header">
            <div class="container">
                <h1 style="font-size: 48px; margin-bottom: 16px;">📖 Documentation</h1>
                <p style="font-size: 20px; opacity: 0.9;">Complete API reference for Simplistic.js</p>
                <p style="margin-top: 20px;">
                    <a href="../sandbox/index.html" style="color: white; text-decoration: none; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 6px;">
                        🚀 Try in Sandbox
                    </a>
                </p>
            </div>
        </div>
        
        ${components.map(comp => this.generateComponentSection(comp)).join('')}
    </div>
    
    <script>
        function filterComponents(query) {
            const links = document.querySelectorAll('.nav-item')
            query = query.toLowerCase()
            
            links.forEach(link => {
                const name = link.getAttribute('data-name')
                if (name.includes(query)) {
                    link.style.display = 'block'
                } else {
                    link.style.display = 'none'
                }
            })
        }
        
        function tryExample(code) {
            const sandboxUrl = '../sandbox/index.html?code=' + btoa(encodeURIComponent(code))
            window.open(sandboxUrl, '_blank')
        }
        
        // Highlight active nav item
        function updateActiveNav() {
            const links = document.querySelectorAll('.nav-item')
            const currentHash = window.location.hash.slice(1)
            
            links.forEach(link => {
                link.classList.remove('active')
                if (link.getAttribute('href') === '#' + currentHash) {
                    link.classList.add('active')
                }
            })
        }
        
        window.addEventListener('hashchange', updateActiveNav)
        updateActiveNav()
    </script>
</body>
</html>`
    }
    
    // Generate section for individual component
    generateComponentSection(component) {
        const examples = this.generateExamples(component)
        
        return `
        <section id="${component.name}" class="component-section">
            <h2 class="component-title">${component.name}()</h2>
            <p class="component-description">${component.description}</p>
            
            ${component.parameters.length > 0 ? `
            <h3>Parameters</h3>
            <table class="params-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${component.parameters.map(param => `
                    <tr>
                        <td>
                            <code>${param.name}</code>
                            ${param.optional ? '<span class="optional-badge">optional</span>' : ''}
                        </td>
                        <td><span class="type-badge">${param.type}</span></td>
                        <td>${param.description}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : ''}
            
            <h3>Examples</h3>
            ${examples}
        </section>`
    }
    
    // Generate interactive examples for component
    generateExamples(component) {
        const basicExample = this.generateBasicExample(component)
        const advancedExample = this.generateAdvancedExample(component)
        
        return `
        <div>
            <h4>Basic Usage</h4>
            <div class="example-block">${basicExample}</div>
            <button class="try-button" onclick="tryExample(\`${basicExample.replace(/`/g, '\\`')}\`)">
                🚀 Try this example
            </button>
            
            <h4>Advanced Usage</h4>
            <div class="example-block">${advancedExample}</div>
            <button class="try-button" onclick="tryExample(\`${advancedExample.replace(/`/g, '\\`')}\`)">
                🚀 Try this example
            </button>
        </div>`
    }
    
    // Generate basic usage example
    generateBasicExample(component) {
        const examples = {
            'div': `div({ center: true, pad: 20 }, 
    'Hello World'
)`,
            'button': `button('Click me!', {
    primary: true,
    onClick: () => alert('Hello!')
})`,
            'input': `input({
    placeholder: 'Enter your name',
    onEnter: (value) => alert(\`Hello \${value}!\`)
})`,
            'h1': `h1('Page Title', { 
    color: '#2563eb',
    center: true 
})`,
            'p': `p('This is a paragraph with some text.', {
    color: '#6b7280',
    size: 16
})`,
            'modal': `button('Open Modal', {
    onClick: () => {
        const content = div({ center: true },
            h3('Modal Title'),
            p('Modal content goes here!')
        )
        modal(content, { title: 'Example Modal' })
    }
})`,
            'table': `table({
    headers: ['Name', 'Age', 'City'],
    rows: [
        ['John Doe', '30', 'New York'],
        ['Jane Smith', '25', 'Los Angeles']
    ]
})`
        }
        
        return examples[component.name] || `${component.name}(/* parameters */)`
    }
    
    // Generate advanced usage example
    generateAdvancedExample(component) {
        const examples = {
            'div': `div({ 
    row: true, 
    gap: 20, 
    bg: '#f8fafc',
    pad: 30,
    rounded: 12,
    shadow: true,
    hover: { bg: '#f1f5f9' }
},
    div({ col: true, gap: 10 },
        h3('Card Title'),
        p('Card description'),
        button('Action')
    )
)`,
            'button': `const isLoading = state(false)

button('Submit Form', {
    primary: true,
    bg: isLoading.value ? '#9ca3af' : '#3b82f6',
    onClick: async () => {
        isLoading.value = true
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000))
        isLoading.value = false
        alert('Form submitted!')
    }
})`,
            'input': `const searchQuery = state('')

input({
    placeholder: 'Search products...',
    value: searchQuery.value,
    onInput: (value) => {
        searchQuery.value = value
        // Trigger search with debouncing
        debounceSearch(value)
    },
    style: {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px'
    }
})`,
            'modal': `const userForm = div({ col: true, gap: 20 },
    h3('User Profile'),
    input({ placeholder: 'Full Name' }),
    input({ type: 'email', placeholder: 'Email' }),
    textarea({ placeholder: 'Bio', rows: 4 }),
    div({ row: true, gap: 15 },
        button('Cancel', { 
            bg: '#f3f4f6',
            color: '#374151' 
        }),
        button('Save', { 
            primary: true,
            onClick: () => alert('Profile saved!') 
        })
    )
)

modal(userForm, {
    title: 'Edit Profile',
    size: 'medium',
    onClose: () => console.log('Modal closed')
})`
        }
        
        return examples[component.name] || `// Advanced ${component.name} usage
${component.name}({
    // Advanced configuration
    advanced: true
})`
    }
    
    // Generate complete documentation site
    generate(srcDir, outputPath) {
        console.log('🔍 Parsing source files...')
        this.parseSourceFiles(srcDir)
        
        console.log(`📝 Found ${this.components.size} components`)
        
        console.log('🏗️ Generating HTML documentation...')
        const html = this.generateHTML()
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath)
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
        }
        
        fs.writeFileSync(outputPath, html, 'utf-8')
        console.log(`✅ Documentation generated: ${outputPath}`)
        
        return {
            components: this.components.size,
            outputPath
        }
    }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new DocumentationGenerator()
    const srcDir = process.argv[2] || '../lib/src'
    const outputPath = process.argv[3] || '../site/docs/index.html'
    
    generator.generate(srcDir, outputPath)
}

export { DocumentationGenerator }