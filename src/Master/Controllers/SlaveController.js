let http = require('http');
const url = require('url');
let Pandex = require('pantexdb');
let Slave = require('../Models/Slave');
let controller = require('./controller');

let SlaveController = class SlaveController {

    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.controller = new controller(req, res, next);
    }

    index() {
        let db = new Pandex('./', 'App', ['slaves']).open();
        let slave = new Slave(this.req.body.ip, this.req.body.port);
        db.slaves.find(slave, (err, slaves) => {
            if (slaves.length === 0) {
                db.slaves.save(slave, (err, obj) => {});
            }
        });
    }
};

module.exports = SlaveController;
