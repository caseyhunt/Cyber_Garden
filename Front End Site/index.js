//id of acive page (page being displayed)
let activepage = "question1";

//start by displaying the landing page
document.getElementById("question1").style.display = 'block';



let active_user = {};
let user_values = [];

initSliders();

var colorPicker = new iro.ColorPicker("#picker", {
    width:150,
    height:150,
    layout: [
      {
        component: iro.ui.Wheel
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "value"
        }
      },
    ]
  });

  colorPicker.on('color:change', function(color) {
    // log the current color as a HEX string
    console.log(color.hexString);
    document.getElementById("picker").style.backgroundColor = color.hexString;
  });

//open serial port
document.getElementById("open_port").addEventListener("click", openPort);

// welcome page buttons
document.getElementById("water").addEventListener("click", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("click", function(){swapPage("user", "r_data")});

document.getElementById("water").addEventListener("touchstart", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("touchstart", function(){swapPage("user", "r_data")});

document.getElementById("log_out").addEventListener("click", function(){swapPage("user", "landing")});
document.getElementById("log_out").addEventListener("touchstart", function(){swapPage("user", "landing")});

//place hand on sensor
document.getElementById("cancel_sensor").addEventListener("click", function(){swapPage("r_data", "user")});
document.getElementById("cancel_sensor").addEventListener("touchstart", function(){swapPage("r_data", "user")});

document.getElementById("hand_sensor").addEventListener("click", function(){swapPage("r_data", "r_inprogress")});
document.getElementById("hand_sensor").addEventListener("touchstart", function(){swapPage("r_data", "r_inprogress")});


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

//registration form buttons
document.getElementById("continue_to_user").addEventListener("click", submitUserReg);
document.getElementById("continue_to_user").addEventListener("touchstart", submitUserReg);

document.getElementById("cancel_registration").addEventListener("click", function(){swapPage("user_reg", "landing")});
document.getElementById("cancel_registration").addEventListener("touchstart", function(){swapPage("user_reg", "landing")});

document.getElementById("cancel").addEventListener("click", function(){swapPage(activepage, "user")});

document.getElementById("to_overview").addEventListener("click", function(){swapPage(activePage, )})





if(activepage == "landing"){
scanRFID();
}
