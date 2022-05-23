const path = require('path');
const fs = require('fs/promises');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

async function createBundle() {
    async function mergeStyles(source, destBundle) {
        try {
            let cssData = '';
            const sourceElements = await fs.readdir(source, {
                withFileTypes: true,
            });

            for (const element of sourceElements) {
                if (element.isFile() && path.extname(element.name) === '.css') {
                    const cssPath = path.join(source, element.name);

                    // cssData += cssData === '' ? '' : '\n';
                    cssData += (await fs.readFile(cssPath, 'utf8')) + '\n';
                }
            }
            await fs.writeFile(destBundle, cssData, 'utf8');
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }

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

    const readComponents = async (folderPath) => {
        let markup = {};
        try {
            const dirElements = await fs.readdir(folderPath, {
                withFileTypes: true,
            });

            for (const element of dirElements) {
                if (
                    element.isFile() &&
                    path.extname(element.name) === '.html'
                ) {
                    const elementPath = path.join(folderPath, element.name);
                    const elementName = path.parse(element.name).name;
                    markup[elementName] = await fs.readFile(
                        elementPath,
                        'utf8'
                    );
                }
            }

            return markup;
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    };

    const createIndexFile = async (source, projectPath, components) => {
        try {
            let template = await fs.readFile(source, 'utf8');
            const markup = await readComponents(components);

            template = template.replace(/{{(.+)}}/g, ($1) => {
                return markup[$1.slice(2, -2)];
            });

            await fs.writeFile(projectPath, template, 'utf8');
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    };

    const projectPath = path.join(__dirname, '/project-dist');

    await fs.rm(projectPath, { force: true, recursive: true });

    const sourceStylePath = path.join(__dirname, '/styles');
    const destStylePath = path.join(projectPath, 'style.css');

    mergeStyles(sourceStylePath, destStylePath);

    souceCopyPath = path.join(__dirname, '/assets');
    destCopyPath = path.join(projectPath, '/assets');

    copyDir(souceCopyPath, destCopyPath);

    const sourceTemplatePath = path.join(__dirname, 'template.html');
    const distTemplatePath = path.join(projectPath, 'index.html');
    const componentsPath = path.join(__dirname, 'components');

    await createIndexFile(sourceTemplatePath, distTemplatePath, componentsPath);
}
createBundle();
