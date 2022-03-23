const chai = require('chai');
const chaiGraphQL = require('chai-graphql');
chai.use(chaiGraphQL)

const { assert } = chai;
const baseURL = "http://localhost:4000/graphql"
const request = require("supertest")(baseURL);

describe("Testing GraphQL API Endpoint", () => {
    it("Quering the user data", (done) => {
        request
            .post("")
            .send({
                query: `{users {
                    id
                    email
                }}`
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                if (err) return done(err);
                assert.graphQL(res.body);
                done();
            });
    })
})