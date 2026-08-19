const fs = require('fs');
const path = require('path');

const pages = [
  'src/pages/citizen/CitizenHome.tsx',
  'src/pages/citizen/CitizenMap.tsx',
  'src/pages/citizen/CitizenShelters.tsx',
  'src/pages/citizen/RoutePlanning.tsx',
  'src/pages/citizen/DisasterHistory.tsx',
  'src/pages/citizen/CitizenAlerts.tsx',
  'src/pages/citizen/ReportIncident.tsx',
  'src/pages/Profile.tsx',
  'src/pages/government/GovControlCenter.tsx',
  'src/pages/government/GovMap.tsx',
  'src/pages/government/GovSensors.tsx',
  'src/pages/government/GovShelters.tsx'
];

pages.forEach(p => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const name = path.basename(p, '.tsx');
  const content = `import React from 'react';\n\nconst ${name}: React.FC = () => {\n  return (<div><h2>${name}</h2></div>);\n};\n\nexport default ${name};\n`;
  fs.writeFileSync(p, content);
});
