let http = require('http');
const url = require('url');
let Pandex = require('pantexdb');
let controller = require('./controller');

let homeController = class HomeController {

    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.controller = new controller(req, res, next);
    }

    index() {
        let db = new Pandex('./', 'App', ['slaves']).open();
        db.slaves.find({}, (err, slaves) => {
            this.res.render('app/home', {
                "slaves": slaves
            });
        });
    }
};

module.exports = homeController;
