const fs = require('fs');
const {Readable} = require('stream');
const ListToTree = require('../../optional');
const {jsonToCSV, jsonToSQL} = require('../../controller');
const fixtures = `${__dirname}/../fixtures/`;

describe('unit tests', () => {

    context('Testing functions that change output format', () => {
        it('takes json and gives csv', (done) => {
            const data = fs.readFileSync(fixtures + 'preparedData.json').toString();
            const parsed = JSON.parse(data);
            const csv = fs.readFileSync(fixtures + 'preparedCSV.txt').toString();
            const fields = ["id", "title", "created_utc", "score"];
            const stream = jsonToCSV(parsed, fields);

            let body = '';

            (stream instanceof Readable).should.be.true();

            stream.on('data', chunk => {
                body += chunk;
            });

            stream.on('end', () => {
                body.toString().should.eql(csv);
                done();
            });
        });

        it('takes json and gives sql', () => {
            const data = fs.readFileSync(fixtures + 'preparedData.json').toString();
            const parsed = JSON.parse(data);
            const sql = fs.readFileSync(fixtures + 'preparedSQL.txt').toString;
            const fields = ["id", "title", "created_utc", "score"];

            const stream = jsonToSQL(parsed, fields);

            let body = '';

            (stream instanceof Readable).should.be.true();

            stream.on('data', chunk => {
                body += chunk;
            });

            stream.on('end', () => {
                body.toString().should.eql(sql);
                done();
            });
        });
    });

    context('optional 3rd case', () => {

        it('build a tree from flat data structure', () => {
            const list = [
                {id: 1, parentId: 0}, {id: 2, parentId: 0},
                {id: 3, parentId: 1}, {id: 4, parentId: 1},
                {id: 5, parentId: 2}, {id: 6, parentId: 4},
                {id: 7, parentId: 5}
            ];

            const expected = [{
                "id": 1,
                "parentId": 0,
                "children": [{"id": 3, "parentId": 1}, {"id": 4, "parentId": 1, "children": [{"id": 6, "parentId": 4}]}]
            }, {
                "id": 2,
                "parentId": 0,
                "children": [{"id": 5, "parentId": 2, "children": [{"id": 7, "parentId": 5}]}]
            }];

            const ltt = new ListToTree(list);
            const result = ltt.run();

            result.children.should.eql(expected);
        });

    })
});