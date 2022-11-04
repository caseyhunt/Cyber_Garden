
const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/users.json';

    // helper methods
    const readFile = (
      callback,
      returnJson = false,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
      fileData,
      callback,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/users', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/users', (req, res) => {

        readFile(data => {
            // Note: this isn't ideal for production use.
            // ideally, use something like a UUID or other GUID for a unique ID value
          //  const newUserId = Date.now().toString();
            const newUserId = req.query.id;
            // add the new user
            data[newUserId.toString()] = req.body;
            console.log(req.body);
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        },
            true);
    });


    // UPDATE
    app.put('/users/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            data[userId] = req.body;
            console.log(req.body);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },
            true);
    });

    app.get('/users/:id', (req, res) => {

      fs.readFile(dataPath, 'utf8', (err, data) => {
          if (err) {
              throw err;
          }

          const userId = req.params["id"];
          const obj = JSON.parse(data);
          console.log(obj[userId]);
          res.send(obj[userId]);
      });
    });


    // DELETE
    app.delete('/users/:id', (req, res) => {

        readFile(data => {

            // delete the user
            const userId = req.params["id"];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });
};

module.exports = userRoutes;
