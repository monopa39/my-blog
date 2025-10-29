
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');

function addCategoryToPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  fileNames.forEach((fileName) => {
    if (fileName.endsWith('.md')) {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      if (!data.category) {
        data.category = 'Uncategorized';
        const newFileContents = matter.stringify(content, data);
        fs.writeFileSync(fullPath, newFileContents);
        console.log(`Added category to ${fileName}`);
      }
    }
  });
}

addCategoryToPosts();
