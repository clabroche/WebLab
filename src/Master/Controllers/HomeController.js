/*module gerant la page d'acceuil*/
let http = require('http')
const url = require('url');
let controller = require('./controller')
var Pandex = require('pantexdb');

let homeController = class HomeController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }

  index(){
    var db = new Pandex('./','App',['slaves']).open()
    db.slaves.find({},(err,slaves) => {
      this.res.render('app/home', {"slaves":slaves });
    });

  }
}

module.exports = homeController;
