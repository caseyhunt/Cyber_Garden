document.getElementById("landing").style.display = 'block';

for(let i=0; i<document.querySelectorAll(".slider").length;i++){

const range = document.querySelectorAll('.slider')[i];
const thumb = document.querySelectorAll('.thumb')[i];
const track = document.querySelectorAll('.track-inner')[i];

const updateSlider = (value) => {
  thumb.style.left = `${value}%`
  thumb.style.transform = `translate(-${value}%, -50%)`
  track.style.width = `${value}%`
}

range.oninput = (e) =>
  updateSlider(e.target.value)

updateSlider(50) // Init value
}

// page 1 buttons
document.getElementById("water").addEventListener("click", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("click", function(){swapPage("user", "r_data")});

document.getElementById("water").addEventListener("touchstart", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("touchstart", function(){swapPage("user", "r_data")});

//assessment buttons
document.getElementById("continue_to_assessment").addEventListener("click", function(){swapPage("r_complete", "start_assessment")});
document.getElementById("continue_to_assessment").addEventListener("touchstart", function(){swapPage("r_complete", "start_assessment")});

document.getElementById("to_question1").addEventListener("click", function(){swapPage("start_assessment", "question1")});
document.getElementById("to_question1").addEventListener("touchstart", function(){swapPage("start_assessment", "question1")});

document.getElementById("to_question2").addEventListener("click", function(){swapPage("question1", "question2")});
document.getElementById("to_question2").addEventListener("touchstart", function(){swapPage("question1", "question2")});

document.getElementById("to_question3").addEventListener("click", function(){swapPage("question2", "question3")});
document.getElementById("to_question3").addEventListener("touchstart", function(){swapPage("question2", "question3")});

document.getElementById("to_question4").addEventListener("click", function(){swapPage("question3", "question4")});
document.getElementById("to_question4").addEventListener("touchstart", function(){swapPage("question3", "question4")});

function swapPage(oldPage, newPage){
document.getElementById(oldPage).style.display = "none";
document.getElementById(newPage).style.display = "block";
}



let userid = "";
//rfid input
document.addEventListener('keydown', function(event) {
  if(document.getElementById("landing").style.display == "block"){
    // console.log(event.keyCode);

    if(event.keyCode == "13"){
      console.log("user id is: " + userid);
      swapPage("landing", "user");
    }else{
    userid += String.fromCharCode(event.keyCode);
  }
  }
  else{
    alert("Are you trying to log in? There is already a user logged in. Log out and try again.")
  }
});

$(document).ready(function () {
  let endpoint = "http://127.0.0.1:3001/users";
        $.ajax({
          //beforeSend: function (jqXHR, settings) { jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");},
            type: "get",
            url: endpoint,
            //url: endpoint + "?key=" + apiKey,
            //dataType: 'jsonp',
        }).done(
        function(data){
    console.log("Data: " + JSON.stringify(data));
  });
    });

    $(document).ready(function () {
      let endpoint = "http://127.0.0.1:3001/users";
      let userID = "hello 1234567";
      let data = {"command":"on", "test": "true"}
            $.ajax({
              //beforeSend: function (jqXHR, settings) { jqXHR.setRequestHeader("Access-Control-Allow-Origin", "*");},
                type: "put",
                data: data,
                url: endpoint + "/" + userID,
                //url: endpoint + "?key=" + apiKey,
                //dataType: 'jsonp',
            }).done(
            function(data){
        console.log("Data: " + JSON.stringify(data));
      });
        });
