const xml2js = require('xml2js'),
    fetch = require('node-fetch'),
    parser = new xml2js.Parser({ explicitArray: false }),
    opmlurl = 'http://storage.shll.me:1229/users/andrewshell/myOutlines/notes.opml',
    moment = require('moment'),
    yaml = require('yaml'),
    fs = require('fs'),
    path = require('path');

async function doit() {
    const opmltext = await (await fetch(opmlurl)).text(),
        struct = await parser.parseStringPromise(opmltext);

    for (const oMonth of struct.opml.body.outline) {
        const mMonth = moment(oMonth.$.text, 'MMMM YYYY', true);
        if (!mMonth.isValid()) { continue; }

        for (const oDay of oMonth.outline) {
            const mDay = moment(oDay.$.text + ' ' + mMonth.year(), 'MMMM D YYYY', true);
            if (!mDay.isValid()) { continue; }

            if (!Array.isArray(oDay.outline)) { oDay.outline = [oDay.outline]; }

            for (const oPost of oDay.outline) {
                const postText = buildPost(oPost);
            }
        }
    }
}

doit()
    .then(() => {
        console.log('done');
    })
    .catch(err => {
        console.error(err);
    });

function buildPost(oPost) {
    const created = moment.utc(oPost.$.created, "ddd, D MMM YYYY HH:mm:ss [GMT]", true);
    if (!created.isValid()) { throw new Error(`Invalid Date: ${oPost.$.created}`); }
    if (!oPost.outline) { return; } // throw new Error(`Post has no body`); }

    let type = oPost.$.type || 'outline';

    let body = "---\n";
    body += yaml.stringify({
        title: oPost.$.text,
        date: created.format('YYYY-MM-DD HH:mm:ssZ')
    });
    body += "---\n\n";

    if (!Array.isArray(oPost.outline)) { oPost.outline = [oPost.outline]; }

    for (const oOutline of oPost.outline) {
        if (oOutline.outline) {
            body += buildSection(oOutline, 2, type);
        } else {
            body += oOutline.$.text + "\n\n";
        }
    }

    const postpath = path.join(__dirname, '../src/posts', slugify(oPost.$.text) + '.md');
    console.log(postpath);
    fs.writeFileSync(postpath, body);
}

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function buildSection(oOutline, level, type) {
    if (!Array.isArray(oOutline.outline)) { oOutline.outline = [oOutline.outline]; }

    let body = '',
        prefix = '',
        ulinc = 1;

    type = oOutline.$.type || type;

    switch (type) {
        case 'ul':
            if (oOutline.$.inList) {
                prefix = ' '.repeat(oOutline.$.text.length - oOutline.$.text.trimLeft().length);
            } else {
                prefix = '';
            }
            body = oOutline.$.text + (oOutline.$.inList ? "\n" : "\n\n");
            for (const oChild of oOutline.outline) {
                oChild.$.text = prefix + (oOutline.$.inList ? '    ' : '') + '* ' + oChild.$.text.trim().replace(/^[* ]+/, '');
                oChild.$.inList = true;
                if (oChild.outline) {
                    body += buildSection(oChild, level + 1, type);
                } else {
                    body += oChild.$.text + "\n";
                }
            }
            body += (oOutline.$.inList ? '' : "\n");
            break;

        case 'ol':
            if (oOutline.$.inList) {
                prefix = ' '.repeat(oOutline.$.text.length - oOutline.$.text.trimLeft().length);
            } else {
                prefix = '';
            }
            body = oOutline.$.text + (oOutline.$.inList ? "\n" : "\n\n");
            for (const oChild of oOutline.outline) {
                oChild.$.text = prefix + (oOutline.$.inList ? '    ' : '') + (ulinc++) + '. ' + oChild.$.text.trim().replace(/^[\d]+\. +/, '');
                oChild.$.inList = true;
                if (oChild.outline) {
                    body += buildSection(oChild, level + 1, type);
                } else {
                    body += oChild.$.text + "\n";
                }
            }
            body += (oOutline.$.inList ? '' : "\n");
            break;

        case 'quote':
            body = '';
            for (const oChild of oOutline.outline) {
                if (oChild.outline) {
                    body += buildSection(oChild, level + 1, type);
                } else {
                    body += "> " + oChild.$.text.replace(/^[\d]+\. +/, '') + "\n";
                }
            }
            body += ">\n> <cite>" + oOutline.$.text + "</cite>\n\n";
            break;

        default:
            body = "#".repeat(level) + ' ' + oOutline.$.text + "\n\n";
            for (const oChild of oOutline.outline) {
                if (oChild.outline) {
                    body += buildSection(oChild, level + 1, type);
                } else {
                    body += oChild.$.text + "\n\n";
                }
            }
    }

    return body;
}
