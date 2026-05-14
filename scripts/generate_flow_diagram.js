const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../docs/flow.json');
const mdPath = path.join(__dirname, '../docs/APP_FLOW.md');

function generateMermaid(flowData) {
  let mermaid = '```mermaid\n';
  mermaid += 'stateDiagram-v2\n';
  mermaid += '    direction TB\n\n';

  // Output all screen definitions (nodes)
  flowData.screens.forEach(screen => {
    mermaid += `    ${screen.id}: ${screen.name}\n`;
  });

  mermaid += '\n';

  // Output all transitions (edges)
  flowData.transitions.forEach(transition => {
    // Escape action text for Mermaid
    const actionText = transition.action.replace(/"/g, '\\"');
    mermaid += `    ${transition.from} --> ${transition.to} : ${actionText}\n`;
  });

  mermaid += '```\n';
  return mermaid;
}

function generateMarkdown(flowData, mermaidChart) {
  let md = '# Single Backgammon - App Flow\n\n';
  md += '> *Dette dokument er autogenereret ud fra `docs/flow.json` via `node scripts/generate_flow_diagram.js`.*\n\n';
  
  md += '## Visuelt Flow\n\n';
  md += mermaidChart + '\n\n';

  md += '## Skærme (Screens)\n\n';
  flowData.screens.forEach(screen => {
    md += `### ${screen.name} (\`${screen.id}\`)\n`;
    md += `- **Beskrivelse:** ${screen.description}\n\n`;
  });

  md += '## Overgange (Transitions)\n\n';
  md += '| Fra | Til | Handling | Betingelse / Note |\n';
  md += '| --- | --- | -------- | ----------------- |\n';
  flowData.transitions.forEach(t => {
    md += `| \`${t.from}\` | \`${t.to}\` | **${t.action}** | ${t.condition || '-'} |\n`;
  });

  return md;
}

try {
  console.log('Læser docs/flow.json...');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const flowData = JSON.parse(rawData);

  console.log('Genererer Mermaid diagram...');
  const mermaidChart = generateMermaid(flowData);
  
  console.log('Genererer Markdown...');
  const markdown = generateMarkdown(flowData, mermaidChart);

  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`✅ Succes! Flow-dokumentation gemt i: ${mdPath}`);
} catch (error) {
  console.error('❌ Fejl under generering af diagram:', error);
  process.exit(1);
}
