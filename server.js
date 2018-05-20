const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

//http://expressjs.com/en/guide/using-template-engines.html
// After the view engine is set, you don’t have to specify the engine or load the template engine module in your app; Express loads the module internally, as shown below (for the above example).

// app.set('view engine', 'pug')
//register the directory where partials are stored
//
hbs.registerPartials('views/partials');
app.set('view engine', 'hbs');

//Server give access to file in following directory
//app.use() to register middleware
app.use(express.static('public'));
//use 'next' to tell express your middleware function is done
app.use((request, response, next) => {
    let now = new Date().toString();
    //https://expressjs.com/en/api.html#req.method
    let log = `${now}: ${request.method} ${request.originalUrl}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('unable to append to server.log');
        }
    });
    //next() should always be called
    next();
});

app.use((request, response, next) => {
    response.render('maintenance.hbs');
    // next();    
});


hbs.registerHelper('getCurrentYear', () => {
    //return 'test';
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (request, response) => {
    //response.send('<h1>Hello   Express</h1>');
    // response.send({
    //     name: 'Arie Platvoet',
    //     age: 5,
    //     likes: [
    //         'apple',
    //         'bananas',
    //         'pears'
    //     ]
    // });

    //use view engine handlebars
    response.render('home.hbs', {
        pageTitle: 'Welcome!',
        welcomeMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    });
});
//different url
app.get('/about', (request, response) => {
    //response.send('About Page');
    response.render('about.hbs', {
        pageTitle: 'About page!!'
    });
});

//another url
app.get('/bad', (request, response) => {
    response.send({
        "errorMessage": "Unable to handle request"
    });
});

//start web server
app.listen(3000, () => console.log('Server is up on port 3000'));