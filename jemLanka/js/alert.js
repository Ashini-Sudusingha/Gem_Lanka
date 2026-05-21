function closealert(){
 const close = document.getElementById("errorMessage");
 close.classList.add("hidden");

}


function notyCloseModel(){
    const close = document.getElementById("noty");
 close.classList.add("hidden");
}

function printUser() {
  // alert("OK");

  var fullContent = document.body.innerHTML;
  var printarea = document.getElementById("printuserReports").innerHTML;

  document.body.innerHTML = printarea;

  window.print();

  document.body.innerHTML = fullContent;
}