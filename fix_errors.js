// This script adds simple error toasts to catch blocks using a regex replace.
import fs from 'fs';
import path from 'path';

const pagesDir = 'c:/Users/Ziyad Ahmad/Desktop/website files/dexaz-task-hub-main/internship projects/relata/src/pages';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Need to ensure there is a toast state. If not, add it.
  if (!content.includes('const [toast, setToast] = useState<string | null>(null);')) {
    // Add toast state
    content = content.replace(
      /const \[loading, setLoading\] = useState\(true\);/,
      "const [loading, setLoading] = useState(true);\n  const [toast, setToast] = useState<string | null>(null);\n\n  const showToast = (msg: string) => {\n    setToast(msg);\n    setTimeout(() => setToast(null), 3000);\n  };\n"
    );
  }

  // Find catch blocks that do console.error and don't do showToast
  content = content.replace(/catch \((error|e)\) \{\s*console\.error\([^;]+\);\s*\}/g, (match, p1) => {
    return `catch (${p1}: any) {\n      console.error(${p1});\n      showToast(${p1}.message || 'An error occurred. Please check database permissions.');\n    }`;
  });

  // Also add the Toast UI if not present
  if (!content.includes('fixed top-6 right-6 z-50 bg-card')) {
    content = content.replace(
      /(return \(\n\s*<div[^>]+>)/,
      "$1\n      {toast && (\n        <motion.div\n          initial={{ opacity: 0, y: -20 }}\n          animate={{ opacity: 1, y: 0 }}\n          className=\"fixed top-6 right-6 z-50 bg-danger/90 text-white border border-danger shadow-xl rounded-xl px-5 py-3 text-sm font-medium\"\n        >\n          {toast}\n        </motion.div>\n      )}\n"
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'people/PeopleList.tsx',
  'people/PersonProfile.tsx',
  'Tasks.tsx',
  'Meetings.tsx',
  'Documents.tsx',
  'Invoices.tsx',
  'Organizations.tsx',
  'Settings.tsx'
];

files.forEach(f => {
  try {
    fixFile(path.join(pagesDir, f));
    console.log(`Fixed ${f}`);
  } catch (e) {
    console.error(`Failed to fix ${f}:`, e);
  }
});
