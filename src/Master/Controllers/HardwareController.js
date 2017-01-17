/*module gerant la page d'acceuil*/
let http = require('http')
const url = require('url');

let controller = require('./controller')
let hardwareController = class HardwareController{
  constructor(req, res, next) {
    this.req=req;
    this.res=res;
    this.next=next;
    this.controller = new controller(req, res, next);
  }

  index(){
    let infos = http.get('http://127.0.0.1:3001/hardware', (res) => {
      let rawData = '';
      res.on('data', function(chunk){rawData += chunk});
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          this.res.render('app/hardware', {hardware:parsedData });
        } catch (e) {
          console.log(e.message);
        }
      });
      res.on('error', function(err) {
          res.send('error: ' + err.message);
      });
    })
  }
}

module.exports = hardwareController;
