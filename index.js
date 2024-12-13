const express = require('express');

const fs = require('fs')

const users = require('./MOCK_DATA.json'); // Ensure MOCK_DATA.json exists
const { ifError } = require('assert');
const app = express();
const PORT = 8000;


app.use(express.urlencoded({ extended: false }))

// Routes
app.get('/', (req, res) => {
   return res.json(users);
});

app.get('/users', (req, res) => {
   return res.json(users);
});

app.get('/api/users', (req, res) => {
   const html = `
    <ul>
        ${users.map((users) => `<li>${users.first_name}</li>`).join('')}
    </ul>
    `;
   return res.send(html);
});

app.route('/api/users/:id')
   .get((req, res) => {
      const id = Number(req.params.id);
      const user = users.find((user) => user.id === id)
      return res.json(user)
   })
   .patch((req, res, next) => {

      const edituser = users.find(users => users.id === parseInt(req.params.id))

      if (!users) throw res.end("No such User exist.");

      const strlength = parseInt(req.body.first_name.length)

      if (3 >= strlength) {
         res.end("Frist name too short")
      }

      const idexOfuserobj = users.indexOf(edituser)

      Object.assign(edituser, req.body)

      users[idexOfuserobj] = edituser;

      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {

         res.status(200).json({ message: 'User updated successfully', edituser });
      })

   })


   .delete((req, res) => {

      const deleteUserbyid = users.find(users => usr.id === parseInt(req.params.id))
      const indexofdeletobj = users.indexOf(deleteUserbyid);

      if (req.params.id > users.length) {

         res.end("user not exist");

      }
      else if (req.params.id != indexofdeletobj) {
         res.end("User not in the list...")
      }

      users.splice(indexofdeletobj, 1);

      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {

         res.status(200).json({ message: 'User delete successfully of  id :', deleteUserbyid });

         console.log(users.length);

      })
   });

app.post('/api/users', (req, res) => {

   const body = req.body;
   // console.log(body);
   if (!body.email) {
      res.send("Error Email doesn't ex...");
   }
   users.push({ ...body, id: users.length + 1 });
   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {


      return res.json({ status: "sucess", id: users.length })
   })

})



// Start server
app.listen(PORT, () => {
   console.log(`Server started at port: ${PORT}`);
});
