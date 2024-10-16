const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

const git = simpleGit();

const listItems = (dirPath) => {
  return fs.readdirSync(dirPath)
    .map(file => path.join(dirPath, file))
    .filter(file => fs.statSync(file).isDirectory() || fs.statSync(file).isFile());
};

const selectItem = async (repoName, currentPath) => {
  const items = listItems(currentPath);

  const choices = [];
  if (currentPath !== `${repoName}/temp` && path.dirname(currentPath) !== currentPath) {
    choices.push({ name: 'Go back', value: '..' });
  }
  choices.push({ name: 'Exit', value: null });
  choices.push({ name: 'Clone to Repository Directory', value: 'clone' });

  choices.push(...items.map(item => ({
    name: path.basename(item),
    value: item,
  })));

  const { selectedItem } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedItem',
      message: `Select a file or directory (Current: ${currentPath}):`,
      choices: choices,
    },
  ]);

  return selectedItem;
};

const cloneSelectedItem = async (selectedItem, repoDir) => {
  const newDest = path.join(repoDir, path.basename(selectedItem));
  console.log(`Cloning ${selectedItem} to ${newDest}...`);

  if (fs.statSync(selectedItem).isDirectory()) {
    fs.cpSync(selectedItem, newDest, { recursive: true });
  } else {
    fs.copyFileSync(selectedItem, newDest);
  }

  console.log(`Successfully cloned ${path.basename(selectedItem)} to ${newDest}`);
};

const main = async () => {
  const [repoUrlArg, destArg] = process.argv.slice(2);

  let repoUrl = repoUrlArg;
  let dest = destArg || './'; 

  if (!repoUrl) {
    const answers = await inquirer.prompt([
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
    repoUrl = answers.repoUrl;
    dest = answers.dest;
  } else if (!destArg) {
    const { destPrompt } = await inquirer.prompt([
      {
        type: 'input',
        name: 'destPrompt',
        message: 'Enter the destination path for cloning:',
        default: './',
      },
    ]);
    dest = destPrompt;
  }

  const repoName = path.basename(repoUrl, '.git');
  const repoDir = path.join(dest, repoName);
  const tempDir = path.join(repoDir, 'temp');

  if (fs.existsSync(repoDir)) {
    console.log(`Removing existing directory: ${repoDir}`);
    fs.rmSync(repoDir, { recursive: true, force: true });
  }

  console.log(`Cloning the repository temporarily into ${tempDir}...`);

  try {
    await git.clone(repoUrl, tempDir);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    fs.rmSync(repoDir, { recursive: true, force: true });
    console.log('Exiting...');
    return;
  }

  let currentPath = tempDir;
  let fileCloneCount = 0, folderCloneCount = 0;

  while (true) {
    const selectedItem = await selectItem(repoName, currentPath);

    if (selectedItem === null) {
      console.log('Exiting...');
      break;
    }

    if (selectedItem === '..') {
      currentPath = path.dirname(currentPath);
      continue;
    }

    if (selectedItem === 'clone') {
      const { confirmClone } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmClone',
          message: `Clone ${path.basename(currentPath)} to ${repoDir}?`,
          default: true,
        },
      ]);

      if (confirmClone) {
        await cloneSelectedItem(currentPath, repoDir);
        folderCloneCount++;
      }
    } else {
      if (fs.statSync(selectedItem).isDirectory()) {
        currentPath = selectedItem;
      } else {
        const { confirmCloneFile } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmCloneFile',
            message: `Clone file ${path.basename(selectedItem)} to ${repoDir}?`,
            default: true,
          },
        ]);

        if (confirmCloneFile) {
          await cloneSelectedItem(selectedItem, repoDir);
          fileCloneCount++;
        }
      }
    }
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  if (folderCloneCount === 0 && fileCloneCount === 0) {
    fs.rmSync(repoDir, { recursive: true, force: true });
    console.log("You did not clone any files/folders.");
  } else {
    console.log(`You cloned ${folderCloneCount} directories and ${fileCloneCount} files.`);
  }
};

main().catch(console.error);
