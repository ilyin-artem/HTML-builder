const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

sourcePath = path.join(__dirname, '/files');
destinationPath = path.join(__dirname, '/files-copy');

async function copyDir(from, to) {
    async function copyFiles(file) {
        const srcPath = path.join(from, file.name);
        const destPath = path.join(to, file.name);

        if (file.isFile()) {
            await copyFile(srcPath, destPath);
        } else {
            await copyDir(srcPath, destPath);
        }
    }

    try {
        await rm(to, { force: true, recursive: true });
        await mkdir(to, { recursive: true });

        const readFiles = await readdir(from, { withFileTypes: true });

        const result = readFiles.map(copyFiles);
        await Promise.all(result);
    } catch (err) {
        console.error(err);
    }
}

copyDir(sourcePath, destinationPath);
