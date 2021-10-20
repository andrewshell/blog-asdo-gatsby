const xml2js = require('xml2js'),
  fetch = require('node-fetch'),
  parser = new xml2js.Parser({ explicitArray: false }),
  opmlurl = 'http://lo2.geekity.com/andrewshell/myOutlines/asdo.opml',
  moment = require('moment'),
  yaml = require('yaml'),
  fs = require('fs'),
  path = require('path');

async function doit() {
  const opmltext = await (await fetch(opmlurl)).text(),
    struct = await parser.parseStringPromise(opmltext);

  if (!Array.isArray(struct.opml.body.outline)) { struct.opml.body.outline = [struct.opml.body.outline]; }

  for (const oMonth of struct.opml.body.outline) {
    const mMonth = moment(oMonth.$.text, 'MMMM YYYY', true);
    if (!mMonth.isValid()) { continue; }

    if (!Array.isArray(oMonth.outline)) { oMonth.outline = [oMonth.outline]; }

    for (const oDay of oMonth.outline) {
      const mDay = moment(oDay.$.text + ' ' + mMonth.year(), 'MMMM D YYYY', true);
      if (!mDay.isValid()) { continue; }

      if (!Array.isArray(oDay.outline)) { oDay.outline = [oDay.outline]; }

      // const postText = buildPost(oDay);

      for (const oPost of oDay.outline) {
        if (oPost.outline && !(oPost.$.flquote || oPost.$.text.startsWith('> '))) {
          console.log(oPost.$.text);
          const articleText = buildArticle(oPost);
        }
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

function buildPost(oDay) {
  const created = moment.utc(oDay.$.created, "ddd, D MMM YYYY HH:mm:ss [GMT]", true);
  if (!created.isValid()) { throw new Error(`Invalid Date: ${oDay.$.created}`); }
  if (!oDay.outline) { return; } // throw new Error(`Post has no body`); }

  let type = oDay.$.type || 'outline';

  let frontmatter = {
    title: created.format('dddd, MMMM D, YYYY'),
    date: created.format('YYYY-MM-DD HH:mm:ssZ'),
    updated: created.format('YYYY-MM-DD HH:mm:ssZ'),
    published: true
  };

  if ((oDay.$.enclosure !== undefined) && (oDay.$.enclosureType !== undefined) && (oDay.$.enclosureLength !== undefined)) {
    frontmatter.enclosure = {
      url: oDay.$.enclosure,
      size: oDay.$.enclosureLength,
      type: oDay.$.enclosureType
    };
  }

  let body = "---\n";
  body += yaml.stringify(frontmatter);
  body += "---\n\n";

  if (!Array.isArray(oDay.outline)) { oDay.outline = [oDay.outline]; }

  for (const oOutline of oDay.outline) {
    if (oOutline.outline) {
      body += buildSection(oOutline, 2, type, true);
    } else if (oOutline.$.inlineImage) {
      body += `<figure><img src="${oOutline.$.inlineImage}"><figcaption>${oOutline.$.text}</figcaption></figure>\n\n`;
    } else {
      body += `${oOutline.$.text}\n\n`;
    }
  }

  // const postpath = path.join(__dirname, '../src/posts', created.format('YYYY-MM-DD') + '.md');
  // console.log(postpath);
  // fs.writeFileSync(postpath, body);
}

function buildArticle(oPost) {
  const created = moment.utc(oPost.$.created.substring(5, oPost.$.created.length - 4), "DD MMM YYYY HH:mm:ss", true);
  if (!created.isValid()) { throw new Error(`Invalid Date: |${oPost.$.created.substring(5, oPost.$.created.length - 4)}|`); }
  if (!oPost.outline) { return; } // throw new Error(`Post has no body`); }

  let type = oPost.$.type || 'outline';

  let frontmatter = {
    title: oPost.$.text,
    date: created.format('YYYY-MM-DD HH:mm:ssZ'),
    updated: created.format('YYYY-MM-DD HH:mm:ssZ'),
    published: true
  };

  if ((oPost.$.enclosure !== undefined) && (oPost.$.enclosureType !== undefined) && (oPost.$.enclosureLength !== undefined)) {
    frontmatter.enclosure = {
      url: oPost.$.enclosure,
      size: oPost.$.enclosureLength,
      type: oPost.$.enclosureType
    };
  }

  let body = "---\n";
  body += yaml.stringify(frontmatter);
  body += "---\n\n";

  if (!Array.isArray(oPost.outline)) { oPost.outline = [oPost.outline]; }

  for (const oOutline of oPost.outline) {
    if (oOutline.outline) {
      body += buildSection(oOutline, 2, type);
    } else if (oOutline.$.inlineImage) {
      body += `<figure><img src="${oOutline.$.inlineImage}"><figcaption>${oOutline.$.text}</figcaption></figure>\n\n`;
    } else {
      body += `${oOutline.$.text}\n\n`;
    }
  }

  const postpath = path.join(__dirname, '../src/posts', slugify(oPost.$.text) + '.md');
  if (!fs.existsSync(postpath)) {
    console.log(postpath);
    fs.writeFileSync(postpath, body);
  }
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

function plaintextChildren(aChildren, level) {
  let body = '';
  for (const oChild of aChildren) {
    body += " ".repeat(level * 2) + oChild.$.text + "\n";
    if (oChild.outline && Array.isArray(oChild.outline)) {
      body += plaintextChildren(oChild.outline, level + 1);
    }
  }
  return body;
}

function buildSection(oOutline, level, type, flatten) {
  if (!Array.isArray(oOutline.outline)) { oOutline.outline = [oOutline.outline]; }

  let body = '',
    prefix = '',
    ulinc = 1,
    codeFormat = '';

  if (undefined === flatten) {
    flatten = false;
  }

  if (oOutline.$.flbulletedsubs) {
    type = 'flBulletedSubs';
  } else if (oOutline.$.flnumberedsubs) {
    type = 'flNumberedSubs';
  } else if (oOutline.$.flquote) {
    type = 'flQuote';
  } else if (oOutline.$.text.startsWith('> ')) {
    type = 'flQuote';
    oOutline.$.text = oOutline.$.text.substr(2);
    oOutline.$.flquote = true;
  } else if (oOutline.$.text.startsWith('```')) {
    type = 'flCode';
    oOutline.$.flcode = oOutline.$.text.substr(3).trim();
    if (Array.isArray(oOutline.outline)) {
      oOutline.$.text = plaintextChildren(oOutline.outline, 0).trim();
      delete oOutline.outline;
    }
  }

  switch (type) {
    case 'flBulletedSubs':
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

    case 'flNumberedSubs':
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

    case 'flQuote':
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

    case 'flCode':
      body = "```" + oOutline.$.flcode + "\n";
      body += oOutline.$.text + "\n";
      body += "```\n\n";
      break;

    default:
      if (flatten && 0 < oOutline.outline.length) {
        let url = '/' + slugify(oOutline.$.text) + '/';
        body += `[${oOutline.$.text}](${url})\n\n`;
      } else {
        body = "#".repeat(level) + ' ' + oOutline.$.text + "\n\n";
        for (const oChild of oOutline.outline) {
          if (oChild.outline) {
            body += buildSection(oChild, level + 1, type);
          } else {
            body += oChild.$.text + "\n\n";
          }
        }
      }
  }

  return body;
}
