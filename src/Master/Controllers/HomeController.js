/*module gerant la page d'acceuil*/
let http = require('http')
const url = require('url');
let flatCache = require('flat-cache')
let controller = require('./controller')
let homeController = class HomeController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }

  index(){
    var slaves = flatCache.load('slaves');
    this.res.render('app/home', { title: 'WebLab', message:'It works!!!!', slaves: slaves._persisted});
  }
}

module.exports = homeController;
