const fs = require('fs');
const fetch = require('node-fetch');

const contents = fs.readFileSync('../static/_redirects', 'utf8').split("\n");

for (const row of contents) {
    if (row.length === 0) {
        continue;
    }

    const parts = row.trim().split(' ');
    const url = 'https://blog.andrewshell.org' + parts[1];

    fetch(url).then((response) => {
        if (200 !== response.status) {
            console.log(`${response.status} ${parts[1]}`);
        }
    });
}
