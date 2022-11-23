//to do: add date recording for "days since", add animation for sensor, finish data input process, add watering process

//change which page is displayed
function swapPage(oldPage, newPage){
activepage = newPage;
if(activepage == "landing"){
  user_id = "";
  user_data = undefined;
}
document.getElementById(oldPage).style.display = "none";
document.getElementById(newPage).style.display = "block";
}


//*******GENERATE DATE FOR USER HISTORY***********
//for testing: add your own date month/day/year
// let d = new Date("11/1/2022");
//for production: use today's date: let d = new Date();
let d = new Date();

//*******RFID***********
function daysSince(date){
  var diff = Math.abs(new Date() - date);
  diff = Math.floor(diff/86400000);
  console.log(diff);
  return diff;
}

function openPort(){
  console.log("serial menu opening");
  port = await navigator.serial.requestPort();
  // Wait for the serial port to open.
  await port.open({ baudRate: 115200 });
  console.log(port);

  while (port.readable) {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    console.log(reader);
    try {
      while (true) {

        const { value, done } = await reader.read();

        if (done) {
          // |reader| has been canceled.

          break;
        }
        // Do something with |value|…
        console.log(value);
      }
    } catch (error) {
      // Handle |error|…
    } finally {
      reader.releaseLock();
    }
  }
})

async function writeserial(message) {
  while(port.writable){
  const writer = port.writable.getWriter();
  await writer.write(message);
  return writer;
}
}

//*******RFID***********

//rfid input
let user_id = "";

function scanRFID(){
  document.addEventListener('keydown', function(event) {
    //each time a key is pressed, add it to the userID
    //end input on return key (13)
    if(document.getElementById("landing").style.display == "block"){
      // console.log(event.keyCode);

      if(event.keyCode == "13"){
        console.log("user id is: " + user_id);
        const user_data = get_id(user_id);
        console.log("data: " + user_data);

      }else{
      user_id += String.fromCharCode(event.keyCode);
    }
    }
  });
}

//******SUBMIT USER REGISTRATION********
function submitUserReg(){
  verifyRegForm();
}

function verifyRegForm(){
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const email = document.getElementById('email').value;
  var radioButtonGroup = document.getElementsByName("degree");
  var checkedRadio = Array.from(radioButtonGroup).find((radio) => radio.checked);
  const isemail = isEmail(email);
  let user_data = {"name": [fname, lname], "email": email, "degree": checkedRadio.value, "last_login": d};
  if("string" == typeof fname && "string" == typeof lname && isemail){
    console.log("form completed " + fname + " " + lname);
    populateUserPage(fname, d, true);
    create_user(user_id, user_data);
    swapPage("user_reg", "user");
  }else{
    alert("email is invalid, please try again!");
  }
}

function isEmail(email){
  if(email.indexOf("@") >0 && email.indexOf("@") != -1 && email.indexOf(".")> 0 && email.indexOf(".")!=-1){
    return true;
  }else{
    return false;
  }
}


//*******POPULATE USER PAGE**********
//user landing page populated with name and days since last visit
function populateUserPage(name, date, first_visit){
  console.log(date);

  if(first_visit != true){
    let days = new Date(date);
    days = daysSince(days).toString();
    console.log('days since ' + daysSince(days));
    add_date(user_id, {"last_login": d});
    document.getElementById("uname").innerHTML = "Back "+ name;
    //to-do: add math for weeks/months?
    document.getElementById("itsbeen").innerHTML = "It's been " + days + " days since we last saw you.";

  }else{

    document.getElementById("uname").innerHTML = name;
    document.getElementById('itsbeen').innerHTML = "This is your first visit! Click here for a tutorial and information about the project.";
  }
}



//*******SLIDER**********
//use .slider to use this code for styling sliders

function initSliders(){
for(let i=0; i<document.querySelectorAll(".slider").length;i++){
  const range = document.querySelectorAll('.slider')[i];
  const thumb = document.querySelectorAll('.thumb')[i];
  const track = document.querySelectorAll('.track-inner')[i];

  //update slider value when user interacts with slider
  range.oninput = (e) =>{
    updateSlider(e.target.value)
    updateSlider(50) // Init value
  }
}
}

//this is a requirement of the current slider styling
const updateSlider = (value) => {
  thumb.style.left = `${value}%`
  thumb.style.transform = `translate(-${value}%, -50%)`
  track.style.width = `${value}%`
}



//*******API CaLLS**********




//get id for user from server
function get_id(id){
  $(document).ready(function () {
  console.log("api call");
    let endpoint = "http://127.0.0.1:3001/users/" + id;
          $.ajax({
            //beforeSend: function (jqXHR, settings) { jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");},
              type: "get",
              url: endpoint,
          }).done(
          function(data){
            console.log("data returned");
            console.log(data);
            if(data.name === undefined){
              swapPage("landing", "user_reg");
            }else{
            const fname = data.name[0];
            const date = data.last_login;
            populateUserPage(fname, date, false);
            swapPage("landing", "user");
            return data;
          }

    });
      });
}


function create_user(id, user_data){
    $(document).ready(function () {
      let endpoint = "http://127.0.0.1:3001/users/";
      let userID = id;
      let data = user_data;
            $.ajax({
                type: "put",
                data: data,
                url: endpoint + userID,
            }).done(
            function(data){
        console.log("Data: " + JSON.stringify(data));
      });
        });
      }

function add_date(id, user_data){
  $(document).ready(function () {
    let endpoint = "http://127.0.0.1:3001/users/";
    let userID = id;
    let data = user_data;
    console.log(data);
          $.ajax({
              type: "post",
              data: data,
              url: endpoint + userID,
          }).done(
          function(data){
      console.log("Data: " + JSON.stringify(data));
    });
      });
}
