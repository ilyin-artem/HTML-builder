const { createWriteStream } = require('fs');
const { join } = require('path');
const process = require('process');
const readline = require('readline');
const { stdin, stdout, stderr } = process;

const messageHello = 'Добро пожаловать, пожалуйста введите текст\n';
const messageBye = 'Спасибо, удачного дня!';
const fileName = 'text.txt';
stdout.write(messageHello);

const ws = createWriteStream(join(__dirname, fileName)).on('error', (err) =>
    console.log(err)
);
const rl = readline
    .createInterface({
        input: stdin,
        output: stdout,
        terminal: false,
    })
    .on('error', (err) => console.log(err));

rl.on('line', function (line) {
    if (line.toLowerCase() === 'exit') {
        process.exit();
    }
    ws.write(`${line}\n`);
});

process.on('SIGINT', () => {
    process.exit();
});
process.on('exit', (code) => {
    if (code === 0) {
        stdout.write(messageBye);
    } else {
        stderr.write(
            `Что-то пошло не так. Программа завершилась с кодом ${code}`
        );
    }
});
