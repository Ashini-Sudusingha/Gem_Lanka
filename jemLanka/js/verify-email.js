
function closeOtpModal() {
  otpModal.classList.remove('active');
}



async function verifyAccount() {

  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;
  const num3 = document.getElementById("num3").value;
  const num4 = document.getElementById("num4").value;
  const num5 = document.getElementById("num5").value;
  const num6 = document.getElementById("num6").value;

  console.log(num1);
   console.log(num2);
    console.log(num3);
     console.log(num4);
      console.log(num5);
       console.log(num6);

  const verification = {
    num1:num1,
    num2:num2,
    num3:num3,
    num4:num4,
    num5:num5,
    num6:num6
  };

  const verificationJson = JSON.stringify(verification);

  const response = await fetch("http://localhost:8080/JemLankaBackEnd/VerifyEmail",
    {
      method: "POST",
      body: verificationJson,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    }
  );

  if (response.ok) {
    // Request was successful
    const json = await response.json();
    //  console.log(json);

    if (json.status) {
       closeOtpModal();
    } else {
      if (json.message === "Invalid verification code") {

         document.getElementById("message").innerHTML = json.message;
        
      } else {
       window.location ="sign-in.html";
      }

    }
  } else {
    // Response not OK (e.g., 400 or 500 error)
    document.getElementById("message").innerHTML = "Verificatio fail. Please try again";
  }



}