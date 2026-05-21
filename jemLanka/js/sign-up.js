async function signUp() {
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;
    const checkbox = document.getElementById('checkbox');
    const successM = document.getElementById("successMessage");
      const susstype = document.getElementById("successtype");
    const errorM = document.getElementById("errorMessage");
    const errortype = document.getElementById("errortype");
  

    if (checkbox.checked) {
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobile: mobile,
            password: password,
            confirmpassword: confirmpassword

        };

        const userJson = JSON.stringify(user);

        const response = await fetch("http://localhost:8080/JemLankaBackEnd/SingUp",
            {
                method: "POST",
                body: userJson,
                credentials: "include",
                header: {
                    "Content-Type": "application/json"
                }
            });



        if (response.ok) {

            // Request was successful
            const json = await response.json();
            //  console.log(json);

            if (json.status) {

                successM.innerHTML = json.message;
                susstype.classList.remove("hidden");
                const firstName = document.getElementById("firstname").value ="";
                document.getElementById("lastname").value = "";
                document.getElementById("email").value = "";
                document.getElementById("mobile").value = "";
                document.getElementById("password").value = "";
                document.getElementById("confirmpassword").value = "";
                document.getElementById('checkbox').checked = false;

            } else {

                errortype.innerHTML = json.message;
                errorM.classList.remove("hidden");
            }
        } else {
            // Response not OK (e.g., 400 or 500 error)
            errortype.innerHTML = "Registration fail. Please try again";
            errorM.classList.remove("hidden");
        }


    } else {
        errortype.innerHTML = "Please agree the polices";
        errorM.classList.remove("hidden");
    }

}

