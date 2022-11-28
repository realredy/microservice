const express = require('express');
const Redis = require('redis'); // ! importamos la libreria de redis
const app = express();
const cors = require('cors');


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
      console.log('Cached response actived...')
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


app.get('/:id', async (req, res) =>{
  const id = req.params.id
 
   try {
    const response = await client.get(id);
    if (response) {
      console.log('Cached response actived...')
      res.status(200).json(JSON.parse(response)); // ! si existen datos no continuará
    }else{
      const response = await fechdata(id)
      // console.log("🚀 ~ file: index.js ~ line 60 ~ app.get ~ response", response)
      client.setEx(id, oneHoutCacheData, JSON.stringify(response));

      console.log('Chargin data from default resource... ')

      res.status(200).json(response);

    }
   } catch (error) {
    console.log(err);
    res.status(500).json({ msg: `Internal Server Error.` });
   }

 
}) 
app.listen(4000, () => {
  console.log('Ready and listend port 4000');
})
