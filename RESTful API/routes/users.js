
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
            data = JSON.parse(data)
            let users = Object.keys(data)
            let overall_stress = 0;
            let user_count = 0;
            users.forEach( user =>{
                if(data[user]['stress'] == undefined){

                }else if(data[user]['stress'].length != 0){
                overall_stress+=Number(data[user]['stress'][1]);
                user_count +=1
                }
                // console.log(data);
            }    
            )
            overall_stress = overall_stress/user_count;
            // console.log(users);
            overall_stress = {"stress": overall_stress}
            console.log(overall_stress);

            //to do: need to add each recieved stress to the queue
            let last_date = new Date(data['garden']['stress'][1]);
            let cur_date = new Date();
            var diff = (last_date.getTime() - cur_date.getTime()) / (1000 * 60 * 60 * 24);
            if(diff >= 1 && data['garden']['stress_queue'].length != 0){
                //calculate new average in 24 hour chunks from stress queue until caught up
                //remove each item in the queue as it is added in
            }
            // if (err) {
            //     throw err;
            // }
           
            res.status(200).send(overall_stress);
        });
    });

    // add user session date
    app.post('/users/:id', (req, res) => {

        readFile(data => {
            const userId = req.params["id"];
            // console.log(req.body.last_login);
            console.log(req.body);
            data[userId]["last_login"] = req.body.last_login;
            data[userId]['stress'].unshift(req.body.last_login);
            data[userId]['stress'].unshift(req.body.percent_stress);
            data[userId]['stress'].unshift(req.body.color);
            // if(data[userId]['stress'].length < 8){
            
            // }else{
            //     data[userId]['stress'].splice(-2, 2);
            // }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('date');
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
            console.log(userId);
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
          console.log("recieved request for uid: " + userId);
          console.log(obj[userId]);
          if(obj[userId]=="undefined"){
            res.send("false");
          }else{
          res.send(obj[userId]);
          }
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
