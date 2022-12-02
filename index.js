const express = require('express');
const Redis = require('redis'); // ! importamos la libreria de redis
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { fechdata } = require('./helper/fechdata');

app.use(cors());
const REDIS_PORT = 5000;
const client = Redis.createClient(REDIS_PORT);
// ? ======   confirmamos si existe un error en la coneccion con el servidor de redis ====== ? //
client.on('error', (err) => console.error('Redis Client Error', err));

// * iniciamos la coneccion con el servidor de redis //
client.connect();


const oneHoutCacheData = 3600; // ? 3600 = 1 hora en segundos


app.get('/', async (req, res) => {

  try {
    /**
     * * Tratamos de conseguir el dato cargado en cache desde redis
     *      -- Esto evitará que recarguemos llamadas al servidor
    */
    const response = await client.get('response'); // ! puede tener datos o devolver null

    if (response) {
      console.log("🚀 ~ file: index.js:35 ~ app.get ~ response", response)
      console.log('Cached response actived without id...')
      res.status(200).json(JSON.parse(response)); // ! si existen datos no continuará
    } else {


      const response = await fechdata()
      /**
       * * setex usa tres parametros
       * * 1.ro. el key que retorna los datos
       * * 2.do. Tiempo de cacheado en segundos
       * * 3.ro. Los datos a guardar en string
       *  ! Redis solo guarda en string por eso un json debe
       *  ! convertirse en string
      */
     
      client.setEx('response', oneHoutCacheData, JSON.stringify(response));

      console.log('Chargin data from default resource... ')

      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
  }

})

app.post('/cart', async (req, res) => {
  console.log("Staring frmo /cart...")
   
   	let response = await fechdata(null,"POST", JSON.stringify(req.body))
    	console.log( 'getting boddy::', JSON.stringify(req.body))
   	res.status(200).json({contents:response , status:{http_code:200}});
  	
});
  

app.get('/:id', async (req, res) =>{
  const id = req.params.id
   
   try {
    const response = await client.get(id);
    // console.log("🚀 ~ file: index.js ~ line 66 ~ app.get ~ response", response)
    if (response) {
      console.log('Cached response actived from single...'); 
      res.status(200).json( {contents:JSON.parse(response), status:{http_code:200}}); // ! si existen datos no continuará
    }else{
      const response = await fechdata(id)
       
      client.setEx(id, oneHoutCacheData, JSON.stringify(response));

      console.log('Chargin data from default resource with id:... ')

      res.status(200).json({contents:response, status:{http_code:200}});
 
    }
    } catch (error) {
    console.log(error);
    res.status(500).json({ msg: `Internal Server Error.` });
   }
 
}) 
 
   

app.listen(4000, () => {
  console.log('Ready and listend port 4000');
})  