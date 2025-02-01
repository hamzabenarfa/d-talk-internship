
const fs = require('fs').promises;
const path = require('path');

async function renameFilesInDirectory(directory) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (err) {
    console.error(`Error reading directory ${directory}: ${err}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories.
      await renameFilesInDirectory(fullPath);
    } else if (entry.isFile()) {
      // Check for .jsx files first (since .jsx also ends with .js).
      if (fullPath.endsWith('.jsx')) {
        const newFullPath = fullPath.slice(0, -'.jsx'.length) + '.tsx';
        console.log(`Renaming: ${fullPath} -> ${newFullPath}`);
        try {
          await fs.rename(fullPath, newFullPath);
        } catch (err) {
          console.error(`Error renaming file ${fullPath}: ${err}`);
        }
      } else if (fullPath.endsWith('.js')) {
        const newFullPath = fullPath.slice(0, -'.js'.length) + '.ts';
        console.log(`Renaming: ${fullPath} -> ${newFullPath}`);
        try {
          await fs.rename(fullPath, newFullPath);
        } catch (err) {
          console.error(`Error renaming file ${fullPath}: ${err}`);
        }
      }
    }
  }
}

// Determine the target directory.
// Use the command-line argument if provided, otherwise default to "src" in the current directory.
const targetDirectory = process.argv[2] || path.join(process.cwd(), 'src');

renameFilesInDirectory(targetDirectory)
  .then(() => console.log('Renaming completed!'))
  .catch(err => console.error(`Error during renaming: ${err}`));
