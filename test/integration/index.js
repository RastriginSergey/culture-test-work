const app = require('../../app');
const request = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});
const host = 'http://localhost:3000';

let server;

describe("Reddit REST API", async function () {

    let body;

    before(done => {
        server = app.listen(3000, done);
    });

    after(done => {
        server.close(done);
    });

    describe("API /", async function () {

        beforeEach(() => {
            body = {
                url: 'http://www.reddit.com/r/javascript/.json',
                command: 'sorting',
                field: 'title',
                order: 'asc',
                delimiter: ',',
                format: 'csv',
            };
        });

        it("returns 400 if URL is not provided", async () => {
            delete body.url;

            let response = await request({
                method: 'post',
                uri: host,
                json: true,
                body
            });

            response.statusCode.should.eql(400);
        });

        it("returns 400 if Command is not provided", async () => {
            delete body.command;

            let response = await request({
                method: 'post',
                uri: host,
                json: true,
                body
            });

            response.statusCode.should.eql(400);
        });


        context("Sorting", () => {

            it("return sorted csv data", async () => {
                let response = await request({
                    method: 'post',
                    uri: host,
                    json: true,
                    body
                });

                response.statusCode.should.eql(200);
            });

            it("return sorted sql request", async () => {
                body.format = 'sql';
                body.field = 'domain';

                let response = await request({
                    method: 'post',
                    uri: host,
                    json: true,
                    body
                });

                response.statusCode.should.eql(200);
            });
        });

        context("Aggregation", () => {

            beforeEach(() => {
                body = {
                    url: 'http://www.reddit.com/r/javascript/.json',
                    command: 'aggregate',
                    field: 'domain',
                    order: 'desc',
                    delimiter: ',',
                    format: 'csv',
                };
            });

            it("return aggregated data in csv format", async () => {
                let response = await request({
                    method: 'post',
                    uri: host,
                    json: true,
                    body
                });

                response.statusCode.should.eql(200);
            });

            it("returns aggregated data in sql format", async () => {

                body.format = 'sql';

                let response = await request({
                    method: 'post',
                    uri: host,
                    json: true,
                    body
                });

                response.statusCode.should.eql(200);
            });
        });

    });
});
