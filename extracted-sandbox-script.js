import { h1, h2, p, div, button, input } from '../lib/src/simplest-v2.js';
import { state } from '../lib/src/state.js';
import { navigation } from './components.js';

console.log('Starting sandbox...');

navigation('sandbox');

// Main container
div({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: 'calc(100vh - 70px)',
    gap: 0
},
    // Left panel - Code editor
    () => div({
        bg: '#1a1a1a',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
        // Editor header
        () => div({
            bg: '#0f0f0f',
            pad: [12, 20],
            row: true,
            between: true,
            alignItems: 'center'
        },
            () => p('Code Editor', {
                color: '#e1e1e1',
                bold: true,
                margin: 0
            }),
            () => div({ row: true, gap: 10 },
                () => button('Run ▶', {
                    bg: '#10b981',
                    color: 'white',
                    pad: [8, 20],
                    rounded: 6,
                    border: 'none',
                    onClick: runCode
                }),
                () => button('Clear', {
                    bg: '#374151',
                    color: '#9ca3af',
                    pad: [8, 16],
                    rounded: 6,
                    border: 'none',
                    onClick: clearCode
                })
            )
        ),
        // Editor textarea  
        () => {
            const textarea = document.createElement('textarea');
            textarea.id = 'editor';
            textarea.spellcheck = false;
            textarea.value = `// Welcome to Simplest.js Sandbox!
h1('Hello Simplest.js!', { 
  center: true, 
  color: '#667eea' 
});

p('Edit this code and click Run to see changes.', {
  center: true,
  size: 18
});

// Interactive example
const count = state(0);

div({ center: true, margin: [40, 0] },
  () => {
    const display = p('Count: ' + count.value, {
      size: 24,
      margin: [0, 0, 20, 0]
    });
    
    count.subscribe(val => {
      display.textContent = 'Count: ' + val;
    });
    
    return display;
  },
  () => div({ row: true, gap: 10, center: true },
    () => button('-', {
      bg: '#ef4444',
      color: 'white',
      pad: [10, 20],
      onClick: () => count.value--
    }),
    () => button('+', {
      bg: '#10b981', 
      color: 'white',
      pad: [10, 20],
      onClick: () => count.value++
    })
  )
);`;
            
            document.body.appendChild(textarea);
            return textarea;
        }
    ),
    
    // Right panel - Output
    () => div({
        bg: 'white',
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
    },
        // Output header
        () => div({
            bg: '#f9fafb',
            pad: [12, 20],
            borderBottom: '1px solid #e5e7eb'
        },
            () => p('Output', {
                bold: true,
                color: '#374151',
                margin: 0
            })
        ),
        // Output iframe
        () => {
            const iframe = document.createElement('iframe');
            iframe.id = 'output-frame';
            iframe.sandbox = 'allow-scripts allow-modals';
            document.body.appendChild(iframe);
            return iframe;
        }
    )
);

// Helper functions
window.runCode = function() {
    console.log('Running code...');
    const code = document.getElementById('editor').value;
    const iframe = document.getElementById('output-frame');
    
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
        * { box-sizing: border-box; }
    </style>
</head>
<body>
    <script type="module">
        import { h1, h2, h3, p, div, button, input } from '/lib/src/simplest-v2.js';
        import { state } from '/lib/src/state.js';
        
        try {
            ${code}
        } catch (err) {
            console.error('Error:', err);
            document.body.innerHTML = '<p style="color: red;">Error: ' + err.message + '</p>';
        }
    </script>
</body>
</html>`;
};

window.clearCode = function() {
    document.getElementById('editor').value = '';
    document.getElementById('output-frame').srcdoc = '';
};

// Run initial code
setTimeout(runCode, 100);

console.log('Sandbox loaded successfully!');