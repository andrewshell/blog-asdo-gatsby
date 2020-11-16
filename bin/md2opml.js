const fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    xml2js = require('xml2js'),
    builder = new xml2js.Builder(),
    matter = require('gray-matter'),
    moment = require('moment')
    dateFormat = 'ddd, DD MMM YYYY HH:mm:ss [GMT]',
    unified = require('unified'),
    parse = require('remark-parse'),
    stringify = require('remark-stringify');

const remark = unified()
  .use(parse)
  .use(stringify)
  .freeze();

const struct = {
    "opml": {
        "$": {
            "version": "2.0"
        },
        "head": [
            {
                "title": "Andrew Shell's Weblog",
                "dateCreated": "Wed, 04 Nov 2020 14:51:37 GMT",
                "dateModified": "Wed, 04 Nov 2020 18:07:58 GMT",
                "ownerId": "https://twitter.com/andrewshell/",
                "ownerName": "Andrew Shell",
                "expansionState": "1,2",
                "lastCursor": 2,
                "flPublic": "true",
                "urlPublic": "http://storage.shll.me:1229/users/andrewshell/electric/asdo.opml",
                "urlJson": "http://storage.shll.me:1229/users/andrewshell/electric/asdo.json",
                "urInstant": "http://instantoutliner.com/m7",
                "urlUpdateSocket": "ws://storage.shll.me:1242/",
                "copyright": "&copy; 2006-2020 Andrew Shell",
                "oldSchoolDomain": "os.shll.me:1400",
                "oldSchoolBlogName": "asdo",
                "ownerTwitterScreenName": "andrewshell",
                "ownerFacebookAccount": "andrew.shell",
                "ownerGithubAccount": "andrewshell",
                "ownerLinkedinAccount": "andrewshell",
                "longTitle": "Andrew Shell's Weblog",
                "description": "Hoopla, ballyhoo, and more..."
            }
        ],
        "body": [
            {}
        ]
    }
};

async function doit() {
    const posts = glob.sync(__dirname + '/../src/posts/*');
    posts.forEach((fname) => {
        const fcontents = fs.readFileSync(fname, 'utf-8');
        const fmatter = matter(fcontents);
        const mdate = moment(fmatter.data.date, 'America/Chicago');
        const attributes = {
            name: path.basename(fname, '.md'),
            type: 'outline',
            text: fmatter.data.title,
            created: mdate.utc().format(dateFormat),
        };
        if (fmatter.data.hasOwnProperty('published')) {
            attributes.isComment = !fmatter.data.published;
        }

        const post = createPost(mdate, attributes);
        let htmlLine;

        fmatter.content.split("\n").forEach((line) => {
            if ('' === line.trim()) {
                return;
            }

            mdate.add(1, 'seconds');

            htmlLine = await newOutline().process(line.trim());

            newOutline(post, {
                text: htmlLine,
                created: mdate.utc().format(dateFormat),
            });
        });
    });

    sortByCreated(struct.opml.body[0].outline);
    struct.opml.body[0].outline.forEach((outline) => {
        sortByCreated(outline.outline);
        outline.outline.forEach((outline) => {
            sortByCreated(outline.outline);
        });
    });

    fs.writeFileSync('asdo.json', JSON.stringify(struct, null, 4), 'utf-8');
    fs.writeFileSync('asdo.opml', builder.buildObject(struct), 'utf-8');
}

doit()
    .then(() => {
        console.log('done');
    })
    .catch(err => {
        console.error(err);
    });

function sortByCreated(outline) {
    outline.sort((a, b) => {
        const ca = moment.utc(a.$.created, "ddd, D MMM YYYY HH:mm:ss [GMT]", true);
        const cb = moment.utc(b.$.created, "ddd, D MMM YYYY HH:mm:ss [GMT]", true);

        if (ca.isSame(cb)) {
            return 0;
        }

        if (ca.isAfter(cb)) {
            return -1;
        }

        return 1;
    });
}

function newOutline(parent, attributes) {
    const outline = {
        '$': attributes
    };

    if (!parent.outline) {
        parent.outline = [];
    }

    parent.outline.push(outline);

    return outline;
}

function createPost(mdate, attributes) {
    const day = createDay(mdate);

    if (!day.outline) {
        day.outline = [];
    }

    let post = day.outline.find((post) => {
        return post['$'].name === attributes.name;
    });

    if (!post) {
        post = newOutline(day, attributes);
    }

    post['$'] = attributes;

    return post;
}

function createDay(mdate) {
    const attributes = {
        created: mdate.utc().format(dateFormat),
        text: mdate.format('MMMM D'),
        name: mdate.format('DD').toLowerCase(),
    };

    const month = createMonth(mdate);

    if (!month.outline) {
        month.outline = [];
    }

    let day = month.outline.find((day) => {
        return day['$'].name === attributes.name;
    });

    if (!day) {
        day = newOutline(month, attributes);
    }

    day['$'] = attributes;

    return day;
}

function createMonth(mdate) {
    const attributes = {
        created: mdate.utc().format(dateFormat),
        text: mdate.format('MMMM YYYY'),
        name: mdate.format('MMMMYYYY').toLowerCase(),
    };

    const body = struct.opml.body[0];

    if (!body.outline) {
        body.outline = [];
    }

    let month = body.outline.find((month) => {
        return month['$'].name === attributes.name;
    });

    if (!month) {
        month = newOutline(body, attributes);
    }

    month['$'] = attributes;

    return month;
}
