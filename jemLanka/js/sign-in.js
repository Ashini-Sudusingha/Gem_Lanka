async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorM = document.getElementById("errorMessage");
    const errortype = document.getElementById("errortype");

    const signIn = {
        email: email,
        password: password
    };

    const signInJson = JSON.stringify(signIn);

    const response = await fetch(
        "http://localhost:8080/JemLankaBackEnd/SignIn",
        {
            method: "POST",
            body: signInJson,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        }
    );

    // check the response is ok server statusnne
    if (response.ok) { // success
        const json = await response.json();
        if (json.status) { // if true
            if (json.message === "1") {
                console.log("enava")
           openOtp();
            } else {
                window.location = "index.html";
            }

        } else {// when status fail
            // custom message
            // js
            errortype.innerHTML = json.message;
            errorM.classList.remove("hidden");
            //if you want to use json
            //$("message").html(json.message);
        }
    } else {
        document.getElementById("errortype").innerHTML = "Registration failed, Please try again";
    }

}

const otpModal = document.getElementById('otp-modal');
function openOtp() {

    const otpInputs = document.querySelectorAll('.otp-input');
    // Function to open the OTP modal
    //  function openOtpModal(phoneNumber = '+91 8888888888') { // Default phone number

    otpModal.classList.add('active');
    otpInputs[0].focus(); // Focus on the first OTP input
    //      }


}