
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

    const appendFile = (
        fileData,
        callback,
        filePath = dataPath,
        encoding = 'utf8'
        ) => {
    
        fs.appendFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
          });
        };
    
    // READ
    app.post('/garden', (req, res, next) => {
        data = null;
        fs.readFile(dataPath, 'utf8', (err, data) => {
            console.log("post rec");
            data = JSON.parse(data);
            console.log("data = ", data);
            if(data != undefined){
            
            consolidate_data(data);
          
            // if (err) {
            //     throw err;
            // }
            //console.log("writing data from garden ", data);
            if(data != undefined){
                let garden_data = data['garden']['stress'];
                data = JSON.stringify(data, null, 2);
                
            writeFile(data, () => {
                res.status(200).send(garden_data);
            });
        }
           
            
        }});
    });

    function consolidate_data(data){
                    
            //1. is the last average taken farther away in time from the oldest reading than the window size?
            // if yes ==> then calculate a new average.
            //2. include all values in this average that are within the window size from the oldest reading.
            // remove all values from the queue as they are added to the average.
            //3. once the number of days between the oldest reading and the current reading is larger than the window
            // calculate the average and add it to the averages array with a date of the most recent included value.
            //4. then, check again to see if the last average taken (now the one just calculated) is farther away in time from the oldest reading than the window size.
            // if yes ==> restart and do steps 2 and 3 again.
            //5. repeat this process until either all items in the queue have been cleared or until the number of days between the last average taken and the newest data collected is less than the window size.

            let stress = data['garden']['stress'];
            let stress_queue = data['garden']['stress_queue'];
            let last_date = new Date(data['garden']['stress'][1]);
            let cur_date = new Date();
            let diff = (last_date.getTime() - cur_date.getTime()) / (1000 * 60 * 60 * 24);
            
            console.log("queue" + stress_queue);
            console.log("stress" + stress);
            //this can be set to any size to batch averages, say by week.
            let window_size = 2;
            
            //goal: calculate new average in chunks from stress queue until caught up
            //remove each item in the queue as it is added into average
            let avg = 0;
            let n = 0;

            let last_avg_date = new Date(stress[stress.length-1]);
            let oldest_reading_date = new Date(stress_queue[stress_queue.length-1]);
            if(stress.length < 1 || stress == undefined){
                last_avg_date = new Date();
            }
            let difference = (oldest_reading_date.getTime() - last_avg_date.getTime()) / (1000 * 60 * 60 * 24);
            let next_value;
            let current_date = new Date();
            console.log("difference", difference);
            console.log("last avg", last_avg_date);
            console.log("oldest_reading", oldest_reading_date);
            console.log("last date", new Date(stress_queue[stress_queue.length-1]));
            while(difference > window_size && stress_queue.length >1){
                
                start_of_range = new Date(stress_queue[1]);
                next_value = new Date(stress_queue[3]);

                if(stress_queue.length ==2){
                    start_of_range = new Date(stress_queue[1]);
                    next_value = new Date();
                }
                avg_range = (next_value.getTime() - start_of_range.getTime()) / (1000 * 60 * 60 * 24);
                console.log("avg_range:", avg_range);
                n = 0;
                avg = 0;


                if(Math.round(avg_range) > window_size){
                n +=1;
                avg += Number(stress_queue[0]);
                last_date = new Date(stress_queue[1]);
                stress_queue = stress_queue.slice(2);
                console.log("in the if statement");
                console.log(stress_queue);
                }

                while(Math.round(avg_range) < window_size && avg_range != NaN){
                    avg += Number(stress_queue[0]);
                    console.log(stress_queue[0]);
                    n += 1;
                    next_value = new Date(stress_queue[3]);
                    last_date = new Date(stress_queue[1]);
                    stress_queue = stress_queue.slice(2);
                    // data['garden']['stress_queue'].slice(2);
                    avg_range = (next_value.getTime() - start_of_range.getTime()) / (1000 * 60 * 60 * 24);
                }
                console.log("avg:", avg, "n:", n);
                avg = Math.round(avg/n);
                console.log("average: ", avg);
                stress.push(avg.toString());
                stress.push(last_date.toString());
                // data['garden']['stress'].push(avg);
                // data['garden']['stress'].push(last_date);
                difference = (current_date.getTime() - last_date.getTime()) / (1000 * 60 * 60 * 24);
                data['garden']['stress_queue'] = stress_queue;
                console.log("queue" + stress_queue);
            }
    }

       // READ
       app.get('/data/:id', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            data = JSON.parse(data)
            uid = req.params["id"];
            console.log("request recieved");
            if(data[uid] != undefined){
            let stress_user = data[uid]['stress'];
            res.status(200).send(stress_user);
            }else{
                res.status(200).send("undefined");
            }
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
            data['garden']['stress_queue'].push(req.body.percent_stress);
            data['garden']['stress_queue'].push(req.body.last_login);
            
            // if(data[userId]['stress'].length < 8){
            
            // }else
            //     data[userId]['stress'].splice(-2, 2);
            // }
            console.log("request to add stress data ", data);
            if(data != undefined){
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('date');
            });
        }
           
        },
            true);
    });


    // UPDATE
    app.put('/users/:id', (req, res) => {
        data = null;
        readFile(data => {
            if(data != undefined){
                console.log("pulling data ", data);
            // add the new user

            const userId = req.params["id"];
            data[userId] = req.body;
            console.log(userId);
            console.log(req.body);
            
            // appendFile(JSON.stringify(data, null, 2), () => {
            //     res.status(200).send(`users id:${userId} updated`);
            // });
            console.log("req to add new user ", data);
            data = JSON.stringify(data, null, 2)
            console.log("what is going on ", data);

            if(data != undefined){
            writeFile(data, () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        }
        }},
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
    // app.delete('/users/:id', (req, res) => {

    //     readFile(data => {

    //         // delete the user
    //         const userId = req.params["id"];
    //         delete data[userId];

    //         writeFile(JSON.stringify(data, null, 2), () => {
    //             res.status(200).send(`users id:${userId} removed`);
    //         });
    //     },
    //         true);
    // });

    
};

module.exports = userRoutes;
