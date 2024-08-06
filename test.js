const git = require('isomorphic-git');
const fs = require('fs');

async function getFileHistory(repoPath, filePath) {
  try {
    const commits = await git.log({
      fs,
      dir: repoPath,
      filepath: filePath
    });
    commits.forEach(commit => {
      console.log(`Commit: ${commit.oid}`);
      console.log(`Author: ${commit.commit.author.name}`);
      console.log(`Date: ${commit.commit.author.timestamp * 1000}`);
      console.log(`Message: ${commit.commit.message}`);
      console.log('-----------------------');
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

getFileHistory('path/to/your/repo', 'path/to/your/file');
