const fs = require('fs');
const path = require('path');

const roadmapPath = path.join(__dirname, '../docs/roadmap.json');
const outputPath = path.join(__dirname, '../docs/ROADMAP.md');

try {
  console.log('Læser docs/roadmap.json...');
  const data = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));

  let markdown = `# ${data.title}\n\n`;
  markdown += `> *Dette dokument er autogenereret ud fra \`docs/roadmap.json\` via \`node scripts/generate_roadmap.js\`.*\n\n`;

  data.components.forEach(component => {
    markdown += `## ${component.name}\n\n`;
    markdown += `| Feature | MVP | V1 | V2 | Note |\n`;
    markdown += `| :--- | :---: | :---: | :---: | :--- |\n`;
    
    component.features.forEach(feature => {
      markdown += `| ${feature.name} | ${feature.mvp} | ${feature.v1} | ${feature.v2} | ${feature.note} |\n`;
    });
    
    markdown += `\n---\n\n`;
  });

  fs.writeFileSync(outputPath, markdown);
  console.log(`✅ Succes! Roadmap gemt i: ${outputPath}`);
} catch (error) {
  console.error('❌ Fejl under generering af roadmap:', error);
  process.exit(1);
}
