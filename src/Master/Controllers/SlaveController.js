/*module gerant la page d'acceuil*/
let http = require('http');
const url = require('url');
let flatCache = require('flat-cache')

let controller = require('./controller')
let SlaveController = class SlaveController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }
  index(){
    var slaves = flatCache.load('slaves');
    slaves.setKey(this.req.body.ip, { port: this.req.body.port, ip: this.req.body.ip });
    slaves.save();
  }
}

module.exports = SlaveController;
