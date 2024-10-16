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

const selectDirectory = async (repoName, currentPath) => {
  const directories = listDirectories(currentPath);

  const choices = directories.map(dir => ({
    name: path.basename(dir),
    value: dir,
  }));

  if (currentPath!==`${repoName}/temp` &&  path.dirname(currentPath) !== currentPath) {
    choices.unshift({ name: 'Go back', value: '..' });
  }

  choices.push({ name: 'Exit', value: null });
  choices.push({ name: 'Clone to Repository Directory', value: 'clone' });

  const { selectedDir } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedDir',
      message: `Select a directory (Current: ${currentPath}):`,
      choices: choices,
    },
  ]);

  return selectedDir;
};

const cloneSelectedDirectory = async (selectedDir, repoDir) => {
  const newDest = path.join(repoDir, path.basename(selectedDir));
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

  const repoName = path.basename(repoUrl, '.git');
  const repoDir = path.join(dest, repoName); 
  const tempDir = path.join(repoDir, 'temp'); 

  if (fs.existsSync(repoDir)) {
    console.log(`Removing existing directory: ${repoDir}`);
    fs.rmSync(repoDir, { recursive: true, force: true });
  }

  console.log(`Cloning the repository temporarily into ${tempDir}...`);
  await git.clone(repoUrl, tempDir);

  let currentPath = tempDir;
  let cloneCount=0;
  while (true) {
    const selectedDir = await selectDirectory(repoName, currentPath);

    if (selectedDir === null) {
      console.log('Exiting...');
      break;
    }

    if (selectedDir === '..') {
      currentPath = path.dirname(currentPath);
      continue;
    }

    if (selectedDir === 'clone') {
      const { confirmClone } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmClone',
          message: `Clone ${path.basename(currentPath)} to ${repoDir}?`,
          default: false,
        },
      ]);

      if (confirmClone) {
        await cloneSelectedDirectory(currentPath, repoDir);
        cloneCount++;
      }
    } else {
      currentPath = selectedDir; 
    }
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
  if(cloneCount===0) {
    fs.rmSync(repoDir, { recursive: true, force: true });
    console.log("You did not clone any files/folders.")
  }else console.log(`You cloned ${cloneCount} files/folders.`)
};

main().catch(console.error);
