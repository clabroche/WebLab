/*module gerant la page d'acceuil*/
let http = require('http')
const url = require('url');
let rp = require('request-promise');

let controller = require('./controller')
let hardwareController = class HardwareController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }

  index(){
    rp({
      uri: 'http://127.0.0.1:3001/hardware',
      json: true // Automatically parses the JSON string in the response
    }).then((listHardware) => {
      this.res.render('app/hardware', {hardware:listHardware });
    }).catch(function (err) {
      console.log("une erreur c'est produite");
    });
  }
}

module.exports = hardwareController;
