function closealert(){
 const err = document.getElementById("errorMessage");
 if (err) err.classList.add("hidden");
 const succ = document.getElementById("successMessage");
 if (succ) succ.classList.add("hidden");
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