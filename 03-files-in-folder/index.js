const fs = require('fs');
const path = require('path');

fs.readdir(
    path.join(__dirname, 'secret-folder'),
    { withFileTypes: true },
    (err, files) => {
        if (err) console.log(err);
        else {
            files.forEach((file) => {
                if (file.isFile()) {
                    const [name, ext] = [...file.name.split('.')];

                    fs.stat(
                        path.join(__dirname, 'secret-folder', file.name),
                        (err, stats) => {
                            console.log(`${name} - ${ext} - ${stats.size}b`);
                        }
                    );
                }
            });
        }
    }
);
