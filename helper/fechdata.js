const env = require('dotenv').config();

 const fechdata = async function getdata(id=null, type='get'){
 // https://front-test-api.herokuapp.com/api/product/8hKbH2UHPM_944nRHYN1n
   
    const getProduct = !id ?  'product' :  `product/${id}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(process.env.ALLDATA_URL)}${getProduct}`; 
     
   const options = {
   method: 'GET',
   headers: {
     'Access-Control-Allow-Origin': '*'
   }
 };
   const getAllData = await fetch(url, options);
     let response = await getAllData.json();
       
       
		if(id){
            const jsonConverted = JSON.parse(response.contents); 
       // ? Return a object filtred only One
          return jsonConverted;
        }else{
      // ? Return all thee data
            return response;
        }
          
}

module.exports = { fechdata }