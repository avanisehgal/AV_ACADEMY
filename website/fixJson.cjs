const fs = require('fs');
const path = require('path');
const dir = 'src/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let data = fs.readFileSync(filePath, 'utf8');

  // Fix known issues specifically to avoid messing up valid strings
  data = data.replace(/\[\ \ /g, '[ ');
  data = data.replace(/\\implies/g, '\\\\implies');
  data = data.replace(/\\cos/g, '\\\\cos');
  data = data.replace(/\\sin/g, '\\\\sin');
  data = data.replace(/\\tan/g, '\\\\tan');

  // Regex fix for any remaining single slash unescaped:
  data = data.replace(/(?<!\\)\\(?![\\\"\/bfnrtu])/g, '\\\\');

  try {
    JSON.parse(data);
    fs.writeFileSync(filePath, data, 'utf8');
    console.log('Fixed', f);
  } catch(e) {
    console.log('Failed', f, e.message);
  }
});
