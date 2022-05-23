const path = require('path');
const fs = require('fs/promises');

const sourcePath = path.join(__dirname, '/styles');
const destinationPath = path.join(__dirname, '/project-dist', 'bundle.css');

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

mergeStyles(sourcePath, destinationPath);
