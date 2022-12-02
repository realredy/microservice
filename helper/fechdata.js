const env = require('dotenv').config();

 const fechdata = async function getdata(id=null, type="GET", body=null){  
 
    let url; 
    const getProduct = !id ?  'product' :  `product/${id}`;
     if(type == 'post'){
        url =   `https://api.allorigins.win/get?url=${encodeURIComponent(process.env.ALLDATA_URL_POST)}`;
        }else{
       url = `https://api.allorigins.win/get?url=${encodeURIComponent(process.env.ALLDATA_URL)}${getProduct}`;
     }    
       
     console.log("🚀 ~ file: fechdata.js:41 ~ fechdata ~ response", url)
     console.log("🚀 ~ file: fechdata.js:41 ~ fechdata ~ response", type)
     let options;
      switch (type) {
        case "post":
          options = {
            body: body,
            method: type,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*'
            }};
          break;
      
        default:
          options = {
            method: type,
            headers: {
              'Cache-Control': 'no-cache', 
              'User-Agent': 'Fetch Client',
              'Accept-Encoding': 'gzip, deflate', 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }};
          break;
      }


      console.log("🚀 ~ file: fechdata.js:61 ~ fechdata ~ options", options)
 
     try {
      const getAllData = await fetch(url, options );
     let response = await getAllData.json();
       console.log("🚀 ~ file: fechdata.js:41 ~ fechdata ~ response", response)
       
		if(id){
            const jsonConverted = JSON.parse(response.contents); 
       // ? Return a object filtred only One
          return jsonConverted;
        }else{
      // ? Return all thee data
            return response;
        } 
     } catch (err) {
      console.log(err);
          return err;
     }
   
}
     
 
  
  
module.exports = { fechdata }