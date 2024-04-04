//select image
let toggle = [true, true, true, true, true, true, true, true, true, true, true, true];

let pictures = ['images', 'images1', 'images2','images3','images4','images5','images6','images7','images8','images9','images10','images11' ];

// let popsound = new Audio ('pop.aac');
// popsound.volume = 0.1;

for( i=0; i < pictures.length; i++ ){

const img = document.getElementById(pictures[i]);
console.log(pictures[i]);


img.addEventListener('click',function(e){
    // popsound.play();

    //this is a hacky solution to a problem caused by undergraduate intern doing her best
    let id = this.id;
    let n = id.charAt(id.length-1);
    let n1 = id.charAt(id.length-2);
    
    if(n == "s"){
        n = 0;
    }else if(n1 != "s" && n1 != e){
        n = n1 + n;
    }
    console.log(toggle[n]);
    toggle[n] =!toggle[n];
    if(toggle[n]){
        img.src = 'images/bubble.png';
        waterGarden(3);
    }
    else{
        img.src = 'images/bubblepoped.png';
        waterGarden(3);
    }
})

}

function resetBubbles(){
    for( i=0; i < pictures.length; i++ ){
        const img = document.getElementById(pictures[i]);
        img.src = 'images/bubble.png';
        toggle[i] = true;
    }
}

document.getElementById("reset_bubbles").addEventListener("click", resetBubbles);
document.getElementById("reset_bubbles").addEventListener("touchstart", resetBubbles)