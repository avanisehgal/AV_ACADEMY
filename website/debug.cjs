const fs = require('fs');

const dir = 'src/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

files.forEach(f => {
  const filePath = require('path').join(dir, f);
  let data = fs.readFileSync(filePath, 'utf8');

  // Let's replace any single unescaped backslash with a double backslash
  // But wait, the standard way is: replace all \\ with \ first, then replace all \ with \\
  // Except for \" and \n which we want to keep as \" and \n in JSON string.
  // This is too complex.
  
  // Let's try to parse character by character to find the exact failure position
  try {
    JSON.parse(data);
  } catch (e) {
    if (e.message.includes('position')) {
       let pos = parseInt(e.message.split('position ')[1]);
       console.log('Error in', f, 'at pos', pos);
       console.log('Context:', data.substring(pos - 15, pos + 15));
    } else {
       console.log(f, e.message);
    }
  }
});
