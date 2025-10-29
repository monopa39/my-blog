
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');

function updateCategoryToWindows() {
  const fileNames = fs.readdirSync(postsDirectory);

  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md')) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      data.category = 'Windows';
      const newFileContents = matter.stringify(content, data);
      fs.writeFileSync(fullPath, newFileContents);
      console.log(`Updated category to Windows for ${fileName}`);
    }
  });
}

updateCategoryToWindows();
