let http = require('http');
const url = require('url');
let controller = require('./controller');

let homeController = class HomeController {

    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.controller = new controller(req, res, next);
    }

    index() {
      this.res.render('app/home');
    }
};

module.exports = homeController;
