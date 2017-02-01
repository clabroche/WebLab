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
    var cache = flatCache.load('slaves');
    cache.setKey(this.req.body.ip, { port: this.req.body.port, ip: this.req.body.ip });
    cache.save();

    console.log(cache.getKey(this.req.body.ip));
  }
}

module.exports = SlaveController;
