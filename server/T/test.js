// // const bcrypt = require('bcrypt')
// // const A = async()=>{const salt = await bcrypt.genSalt(10);
// // console.log(salt)}
// // A()
// const db = require('../src/db/db')
// // const id = 22
// // const print = async()=>{
// //     const { rows } = await db.query('SELECT user_id, email FROM users WHERE user_id = $1',[id])
// //     console.log(rows)
// // }
// // print()
// //console.log(rows[0].user_id)
// // console.log(Math.floor(100000 + Math.random()*900000))
// value = "abdellaouamir27@gmail.com"
// // const user = async()=>{await db.query('SELECT * from users WHERE email = $1', [value]).then((data)=>{
// //     console.log(data.rows)
// // })}
// //"INSERT INTO userverification (user_id, uniqueString, email) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET uniqueString = $2;", [9, "eee", "eifjiefeui@geij.com"]

const { mlAPI } = require("../src/ML/FastAPI");

// // user()
// async function test (){
//     await db.query('DELETE FROM userverification WHERE user_id = $1',[9]).then((res)=>{
//         console.log(res)
//     }).catch((error)=>{
//         console.log(error)
//     })
// }
// test()

// const http = require('http');

// const options = {
//   hostname: 'localhost',
//   port: 8000,
//   path: '/score',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// };



// test = async (cv, jd)=>{
//     const data = JSON.stringify({
//         cv: cv,
//         jd: jd
//       });
//     const req = http.request(options, (res) => {
//         console.log(`statusCode: ${res.statusCode}`);
        
//         let data = ''
//         res.on('data', (chunk) => {
//             data += chunk
//         })
//         res.on('end',()=>{
//             const json = JSON.parse(data)
//             console.log(json.score)
//         })
//       });
      
//       req.on('error', (error) => {
//         console.error(error);
//       });
      
//       req.write(data);
//       req.end();
// }

// test("John Doe", "john@example.com")


mlAPI(14,27)