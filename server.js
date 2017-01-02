/**
 * SERVER.JS
 * MAIN FILE
 * @author Xavier CHOPIN, Corentin LABROCHE, David LEBRUN, Maxence ANTOINE
 * @license    MIT (3-clause)
 * @copyright  (c) 2016-2017 University of Lorraine
 * @link       http://github.com/tpcisiie/weblab
 */


/**
  -------------------------------------
 | Settings                            |
 |-------------------------------------
 |
 | Initialization of ExpressJS and Twig
 |
 */

let app = require('express')();

app.set (
    'views', __dirname + '/src/App/Views',
    'twig options', { strict_variables: false }
);

/**
  -------------------------------------
 | Routes                              |
 |-------------------------------------
 |
 | Routes of the web application
 |
 */

app.get('/', (request, response) => {
    response.render('app/home.twig', {
        message: 'Hello Twig this is World'
    });
});

app.listen(8080);