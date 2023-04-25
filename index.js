const express = require('express');
const app = express();
const port = 2000;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const Job = require('./models/card')
// user for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

// use express layouts
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

/**
 * 
 */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/route.html'));
});

app.get('/jobs', (req, res) => {
    Job.find({})
        .then(jobs => { 
            res.render('jobs', {
                jobs: jobs,
                title: 'Job View'
            });
        })
        .catch(err => {
            console.log(err);
            res.send('Error retrieving job listings');
        });
});

app.get('/jobs/new', (req, res) => {
    res.render('new', {
        title: 'Job Listing'
    });
});

app.post('/jobs', (req, res) => {
    const { title, description, company, jobType, jobLink, batch } = req.body;
    const job = new Job({
        title: title,
        description: description,
        company: company,
        jobType: jobType,
        jobLink: jobLink,
        batch: batch
    });

    job.save()
        .then(savedJob => {
            console.log(`Added new job listing: ${savedJob.title}`);
            res.redirect('/jobs');
        })
        .catch(err => {
            console.log(err);
            res.send('Error adding new job listing');
        });
});


app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
    
});
// many action in a file called controller.
