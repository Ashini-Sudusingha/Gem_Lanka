async function signOut() {
    const response = await fetch("http://localhost:8080/JemLankaBackEnd/SignOut",
         {
            method: "GET",
            credentials: "include"
        }
    );
        if (response.ok) {
            const json = await response.json();
            if (json.status) {
                window.location = "http://localhost/jemLanka/sign-in.html";
            } else {
                window.location.reload();
            }
        } else {
            console.log("Logout Failed!");
        }
}

 