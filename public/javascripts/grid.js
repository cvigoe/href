function renderGrid(){

  if($(window).width() > 900){
    var blocks = document.getElementsByClassName("thread");
    var pad = 10, cols = Math.floor(($(window).width())/40), newleft, newtop;
    reset();
    $("#index").css("width", "1077px");
    $(".thread").css("position", "absolute");
    
    for(var i = 1; i < blocks.length; i++){
      if (i % cols == 0) {
        newtop = (blocks[i-cols].offsetTop + blocks[i-cols].offsetHeight) + pad;
        blocks[i].style.top = newtop+"px";
      } else {
        if(blocks[i-cols]){
          newtop = (blocks[i-cols].offsetTop + blocks[i-cols].offsetHeight) + pad;
          blocks[i].style.top = newtop+"px";
        }
        newleft = (blocks[i-1].offsetLeft + blocks[i-1].offsetWidth) + pad;
        blocks[i].style.left = newleft+"px";  
      }
    }
    $("#index").css("width", cols*358 + "px");
  } else{
    $("#index").css("width", "358px");
    $(".thread").css("position", "inherit");
  }
}

renderGrid();
window.addEventListener("load", renderGrid, false);
window.addEventListener("resize", renderGrid, false);


function reset(){
  $(".thread").removeAttr('style');
}