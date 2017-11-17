const rp = require('request-promise');
const {Readable} = require('stream');
const json2csv = require('json2csv');
const RedditArticle = require('./model');

async function route(req, res, next) {

    const {url, command, ...options} = req.body;

    if (!url) return res.status(400).send('URL not found');
    if (!command) return res.status(400).send('Command not found');

    try {

        const json = await rp(url);

        const docs = JSON.parse(json).data.children.map(article => article.data);

        // clear collection from old data
        await RedditArticle.remove({});
        await RedditArticle.insertMany(docs);

        switch (command) {
            case 'sorting':
                await sorting(options, res, next);
                break;
            case 'aggregate':
                await aggregate(options, res, next);
                break;
            default:
                res.status(400).send('Bad command');
        }

    } catch (e) {
        next(e);
    }
}

function jsonToCSV(data, fields, delimiter = ',') {

    const stream = new Readable();
    const result = json2csv({data: data, fields, del: delimiter});

    stream.push(result);
    stream.push(null);

    return stream;
}

function jsonToSQL(data, fields, tableName) {

    const stream = new Readable();
    const values = data.map(doc => `(${fields.map(field => doc[field]).join()})`).join();
    const sql = `INSERT INTO ${tableName} (${fields.join()}) VALUES ${values}`;

    stream.push(sql);
    stream.push(null);

    return stream;
}


async function sorting(options, res, next) {

    const {order = 'asc', field, format = 'csv', delimiter = ',', tableName = 'reddit'} = options;
    const sortQuery = {
        [field]: order
    };
    const fields = [
        'id', 'title',
        'created_utc', 'score'
    ];


    if (!field) return res.status(400).send('Sorting field not found');

    try {

        let stream;

        const docs = await RedditArticle
            .find({}, fields)
            .sort(sortQuery);

        const result = docs.map(doc => {
            const obj = doc.toObject();
            obj.id = obj._id;
            delete obj._id;

            return obj;
        });

        if (format === 'csv') stream = jsonToCSV(result, fields, delimiter);
        if (format === 'sql') stream = jsonToSQL(result, fields, tableName);

        stream.pipe(res);

    } catch (e) {
        next(e);
    }
}

async function aggregate(options, res, next) {

    const {order = 'asc', field = "domain", format = 'csv', delimiter = ',', tableName = 'stats'} = options;
    const fields = ['domain', 'count', 'score'];
    let sort = order === 'asc' ? 1 : -1;
    let stream;

    if (fields.indexOf(field) === -1) return res.status(400).send(`Data doesn\'t have ${field} field`);

    try {
        const result = await RedditArticle.aggregate(
            {$group: {_id: "$domain", score: {$sum: "$score"}, count: {$sum: 1}}},
            {$project: {_id: 0, domain: "$_id", score: 1, count: 1}},
            {$sort: {[field]: sort}}
        );

        if (format === 'csv') stream = jsonToCSV(result, fields, delimiter);
        if (format === 'sql') stream = jsonToSQL(result, fields, tableName);

        stream.pipe(res);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    route,
    jsonToCSV,
    jsonToSQL
};