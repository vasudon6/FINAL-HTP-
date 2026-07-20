const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/export default function App\(\) \{\n  React\.useEffect\(\(\) => \{\n    const data = localStorage\.getItem\('vasu_public_data'\);\n    if \(data\) \{\n      fetch\('\/api\/log-state', \{\n        method: 'POST',\n        headers: \{ 'Content-Type': 'application\/json' \},\n        body: data\n      \}\)\.catch\(console\.error\);\n    \}\n  \}, \[\]\);\n/, 'export default function App() {');
fs.writeFileSync('src/App.tsx', appCode);

let publicCode = fs.readFileSync('src/pages/PublicSite.tsx', 'utf8');
publicCode = publicCode.replace(/export default function PublicSite\(\) \{\n  React\.useEffect\(\(\) => \{\n    const data = localStorage\.getItem\('vasu_public_data'\);\n    if \(data\) \{\n      fetch\('\/api\/log-state', \{\n        method: 'POST',\n        headers: \{ 'Content-Type': 'application\/json' \},\n        body: data\n      \}\)\.catch\(console\.error\);\n    \}\n  \}, \[\]\);\n/, 'export default function PublicSite() {');
fs.writeFileSync('src/pages/PublicSite.tsx', publicCode);

let adminCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
adminCode = adminCode.replace(/export default function AdminDashboard\(\) \{\n  React\.useEffect\(\(\) => \{\n    const data = localStorage\.getItem\('vasu_public_data'\);\n    if \(data\) \{\n      fetch\('\/api\/log-state', \{\n        method: 'POST',\n        headers: \{ 'Content-Type': 'application\/json' \},\n        body: data\n      \}\)\.catch\(console\.error\);\n    \}\n  \}, \[\]\);\n/, 'export default function AdminDashboard() {');
fs.writeFileSync('src/pages/AdminDashboard.tsx', adminCode);

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/  app\.post\("\/api\/log-state", \(req, res\) => \{\n    fs\.writeFileSync\('state_backup\.json', JSON\.stringify\(req\.body, null, 2\)\);\n    res\.json\(\{ success: true \}\);\n  \}\);\n\n  \/\/ API route for chatbot/, '// API route for chatbot');
fs.writeFileSync('server.ts', serverCode);
