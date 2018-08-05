var assert = require("assert");
var human = require("../lib/human");
var h = new human.human("hoge piyo", 99);
describe("human class test", function () {
    it("say method", function () {
        assert.equal("I'm hoge piyo:) Hello!", h.say("Hello!"));
    });
});