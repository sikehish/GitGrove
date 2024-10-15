const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit();

const listDirectories = (dirPath) => {
  return fs.readdirSync(dirPath)
    .map(file => path.join(dirPath, file))
    .filter(file => fs.statSync(file).isDirectory());
};

const selectDirectory = async (currentPath) => {
  const directories = listDirectories(currentPath);

  const choices = directories.map(dir => ({
    name: path.basename(dir),
    value: dir,
  }));

  if (path.dirname(currentPath) !== currentPath) {
    choices.unshift({ name: 'Go back', value: '..' });
  }

  choices.push({ name: 'Exit', value: null });
  choices.push({ name: 'Clone', value: 'clone' });

  const { selectedDir } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedDir',
      message: `Select a directory (Current: ${currentPath}):`,
      choices: choices,
    },
  ]);
  console.log
  return selectedDir;
};

const cloneSelectedDirectory = async (selectedDir, dest) => {
  const newDest = path.join(dest, path.basename(selectedDir));
  console.log(`Cloning ${selectedDir} to ${newDest}...`);
  fs.cpSync(selectedDir, newDest, { recursive: true });

  console.log(`Successfully cloned ${path.basename(selectedDir)} to ${newDest}`);
};

const main = async () => {
  const { repoUrl, dest } = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoUrl',
      message: 'Enter the GitHub repository URL:',
    },
    {
      type: 'input',
      name: 'dest',
      message: 'Enter the destination path for cloning:',
    },
  ]);

  const tempDir = path.join(dest, 'temp_repo');

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  console.log(`Cloning the repository into ${tempDir}...`);
  await git.clone(repoUrl, tempDir);

  let currentPath = tempDir;
  while (true) {
    const selectedDir = await selectDirectory(currentPath);

    if (selectedDir === null) {
      console.log('Exiting...');
      break;
    }

    if (selectedDir === '..') {
      currentPath = path.dirname(currentPath);
      continue;
    }

    if(selectedDir=='clone'){
        const { confirmClone } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirmClone',
              message: `Clone ${path.basename(currentPath)}?`,
              default: false,
            },
          ]);

          console.log(currentPath, dest)
      
          if (confirmClone) {
            await cloneSelectedDirectory(currentPath, dest);
            break;
          }
    }

    currentPath = selectedDir;
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Temporary repository removed. Process complete.');
};

main().catch(console.error);
