// Shared components for Simplest.js website
import { div, button, h1, p } from '../lib/src/simplest-v2.js';

export function navigation(currentPage = 'home') {
  div({
    position: 'fixed',
    top: 0,
    width: '100%',
    bg: 'rgba(255, 255, 255, 0.98)',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  },
    () => div({
      maxWidth: 1200,
      margin: '0 auto',
      row: true,
      between: true,
      pad: [16, 24],
      alignItems: 'center'
    },
      // Logo
      () => button('✨ Simplest.js', {
        bg: 'transparent',
        border: 'none',
        size: 20,
        bold: true,
        color: '#2563eb',
        onClick: () => window.location.href = '/site/index.html'
      }),
      
      // Nav links
      () => div({ row: true, gap: 32 },
        () => navLink('Home', '/site/index.html', currentPage === 'home'),
        () => navLink('Docs', '/site/docs.html', currentPage === 'docs'),
        () => navLink('Sandbox', '/site/sandbox.html', currentPage === 'sandbox'),
        () => navLink('Examples', '/site/examples.html', currentPage === 'examples'),
        () => navLink('Tutorial', '/site/tutorial.html', currentPage === 'tutorial'),
        () => button('GitHub', {
          bg: '#24292f',
          color: 'white',
          pad: [8, 16],
          rounded: 6,
          border: 'none',
          onClick: () => window.open('https://github.com/TheNexusGroup/simplest-js', '_blank')
        })
      )
    )
  );
  
  // Spacer for fixed nav
  div({ height: 70 });
}

function navLink(text, href, isActive = false) {
  button(text, {
    bg: 'transparent',
    border: 'none',
    color: isActive ? '#2563eb' : '#6b7280',
    fontWeight: isActive ? 'bold' : 'normal',
    onClick: () => window.location.href = href,
    hover: { color: '#2563eb' }
  });
}

export function hero(title, subtitle) {
  div({
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    pad: [100, 20],
    center: true,
    col: true,
    gap: 20
  },
    () => h1(title, {
      size: 48,
      center: true,
      margin: [0, 0, 10, 0]
    }),
    () => p(subtitle, {
      size: 20,
      center: true,
      opacity: 0.9,
      maxWidth: 600,
      margin: '0 auto'
    })
  );
}

export function footer() {
  div({
    bg: '#0f172a',
    color: 'white',
    pad: [60, 20],
    marginTop: 100
  },
    () => div({
      maxWidth: 1200,
      margin: '0 auto',
      center: true,
      col: true,
      gap: 40
    },
      () => div({ row: true, between: true, width: '100%' },
        () => div({ col: true, gap: 10 },
          () => p('✨ Simplest.js', { size: 24, bold: true, color: '#60a5fa' }),
          () => p('Natural web development', { color: '#94a3b8' }),
          () => p('MIT License • Open Source', { color: '#6b7280', size: 14 })
        ),
        
        () => div({ row: true, gap: 60 },
          () => footerSection('Learn', [
            ['Documentation', '/site/docs.html'],
            ['Tutorial', '/site/tutorial.html'],
            ['Examples', '/site/examples.html'],
            ['Sandbox', '/site/sandbox.html']
          ]),
          
          () => footerSection('Community', [
            ['GitHub', 'https://github.com/TheNexusGroup/simplest-js'],
            ['Issues', 'https://github.com/TheNexusGroup/simplest-js/issues'],
            ['Discussions', 'https://github.com/TheNexusGroup/simplest-js/discussions']
          ])
        )
      ),
      
      () => div({ width: '100%', height: 1, bg: '#334155', margin: [20, 0] }),
      
      () => p('Made with ❤️ by The Nexus Group • Built with Simplest.js itself', {
        center: true,
        color: '#6b7280',
        size: 14
      })
    )
  );
}

function footerSection(title, links) {
  div({ col: true, gap: 15 },
    () => p(title, { bold: true, color: '#e2e8f0', margin: [0, 0, 5, 0] }),
    ...links.map(([text, href]) =>
      () => button(text, {
        bg: 'transparent',
        border: 'none',
        color: '#94a3b8',
        pad: 0,
        textAlign: 'left',
        fontSize: 14,
        onClick: () => {
          if (href.startsWith('http')) {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        },
        hover: { color: '#60a5fa' }
      })
    )
  );
}

export function codeBlock(code, language = 'javascript') {
  const el = document.createElement('pre');
  el.style.cssText = `
    background: #1a1a1a;
    color: #e1e1e1;
    padding: 24px;
    border-radius: 12px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
    margin: 20px 0;
  `;
  
  const codeEl = document.createElement('code');
  codeEl.textContent = code;
  el.appendChild(codeEl);
  
  // Use the current context from the Simplest engine instead of document.body
  const currentContext = window.simplestEngine?.currentContext || document.body;
  currentContext.appendChild(el);
  return el;
}