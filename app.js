var express 		= require('express')
	, bodyParser 	= require('body-parser')
	, db      		= require('./models')
	, pelicula 		= require('./routes/pelicula')
	, cine 				= require('./routes/cine')
	, colors 			= require('colors')
	, http    		= require('http')
	, path    		= require('path')

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, { message: 'Error del servidor'});
});

colors.setTheme({
	error : 'red',
	post : 'yellow',
	get : 'green',
	put : 'blue',
	del : 'grey'
});

app.get('/api/peliculas',pelicula.select);
app.post('/api/peliculas',pelicula.insert);
app.delete('/api/peliculas/:id',pelicula.delete);
app.put('/api/peliculas/:id',pelicula.update);

app.get('/api/cines',cine.select);
app.post('/api/cines',cine.insert);
app.delete('/api/cines/:id',cine.delete);
app.put('/api/cines/:id',cine.update);

db
  .sequelize
  .sync()
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log(('Servidor corriendo en ' + app.get('port')).bold)
      })
    }
  })