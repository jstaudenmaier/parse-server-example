// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var stormpath = require('express-stormpath');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://medsafe_lab:elixir-vitae@ds021711.mlab.com:21711/medsafe_management',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'medsafe-manager',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://medsafe-manager.herokuapp.com/',  // Don't forget to change to https if needed
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

//Initialize stormpath
app.use(stormpath.init(app, { website: true }));



// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being an opalescent web site.');
});

app.get('/validate', function(req, res) {
  try {
    var incomingToken = jwt.verify(req.query.token, "smart is sexy");
  } catch (ex) {
    console.error(ex.stack);
    return res.status(401).send('jwt error');
  }
});

app.on('stormpath.ready', function() {
  app.listen(process.env.PORT || 3000);
});

//var port = process.env.PORT || 1337;
//app.listen(port, function() {
//    console.log('parse-server-example running on port ' + port + '.');
//});
