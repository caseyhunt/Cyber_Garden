//to do:
//add auto log out
//add water garden activities
//add back buttons to assessment?






//id of acive page (page being displayed)
let activepage = "landing";





//start by displaying the landing page
document.getElementById(activepage).style.display = 'block';



let active_user = {};
let user_values = [];
scanRFID();

initSliders();
initColorPicker();
populatePAM();

//open serial port
document.getElementById("open_port").addEventListener("click", openPort);

// welcome page buttons
// document.getElementById("water").addEventListener("click", function(){alert("Thanks for your interest, this feature has not yet been developed. Please click another option :)")});
document.getElementById("water").addEventListener("click", function(){swapPage("user", "w_garden")});
// document.getElementById("water").addEventListener("click", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("click", function(){swapPage("user", "question1")});

document.getElementById("water").addEventListener("touchstart", function(){swapPage("user", "w_garden")});
document.getElementById("record").addEventListener("touchstart", function(){swapPage("user", "question1")});

document.getElementById("log_out").addEventListener("click", logout);
document.getElementById("log_out").addEventListener("touchstart", logout);

document.getElementById("log_out_1").addEventListener("click", logout1);
document.getElementById("log_out_1").addEventListener("touchstart", logout1);

document.getElementById("log_out_2").addEventListener("click", logout2);

//place hand on sensor
// document.getElementById("cancel_sensor").addEventListener("click", function(){swapPage("r_data", "user")});
// document.getElementById("cancel_sensor").addEventListener("touchstart", function(){swapPage("r_data", "user")});

// document.getElementById("hand_sensor").addEventListener("click", function(){swapPage("r_data", "r_inprogress")});
// document.getElementById("hand_sensor").addEventListener("touchstart", function(){swapPage("r_data", "r_inprogress")});


//assessment buttons
document.getElementById("continue_to_assessment").addEventListener("click", function(){swapPage("r_complete", "question1")});
document.getElementById("continue_to_assessment").addEventListener("touchstart", function(){swapPage("r_complete", "question1")});

// document.getElementById("to_question1").addEventListener("click", function(){swapPage("start_assessment", "question1")});
// document.getElementById("to_question1").addEventListener("touchstart", function(){swapPage("start_assessment", "question1")});

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


document.getElementById("to_question5").addEventListener("click", function(){swapPage("question4", "question5")});

document.getElementById("to_complete").addEventListener("click", function(){swapPage("question5", "overview")});

// document.getElementById("to_overview").addEventListener("click", function(){swapPage("assessment_complete", "overview")});

//document.getElementById("to_record_result").addEventListener("click", function(){swapPage("overview", "recorded_result")});

document.getElementById("to_record_result").addEventListener("click", dataToArduino);

document.getElementById("complete").addEventListener("click", function(){swapPage("recorded_result", "user")});

document.getElementById("test").addEventListener("click", function(){swapPage("r_inprogress", "r_complete")});

//cancel buttons
for(i=0; i<document.querySelectorAll(".cancel").length; i++){
    document.querySelectorAll(".cancel")[i].addEventListener("click", function(){swapPage(activepage, "user")});
}

document.getElementById("anon").addEventListener("click", anonymousUser);

document.getElementById("graph_link").addEventListener("click", function(){swapPage("user", "graph")})

document.getElementById("go_home").addEventListener("click", function(){swapPage("graph", "user")});

document.getElementById("bubble").addEventListener("click", function(){swapPage("w_garden", "bubbles")});

document.getElementById("pinwheel_select").addEventListener("click", function(){swapPage("w_garden", "pinwheel")});
// document.getElementById("pinwheel_select").addEventListener("click", function(){swapPage("w_garden", "pinwheel_animation")});



for(i=0; i<document.querySelectorAll(".go_back").length; i++){
    document.querySelectorAll(".go_back")[i].addEventListener("click", function(){swapPage(activepage, "w_garden")});
}

