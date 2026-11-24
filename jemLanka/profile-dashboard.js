async function signOut() {
    try {
        const response = await fetch("http://localhost:8080/JemLankaBackEnd/SignOut", {
            method: "GET",
            credentials: "include"
        });
        if (response.ok) {
            const json = await response.json();
            console.log("Signed out:", json);
        }
    } catch (err) {
        console.error("SignOut error:", err);
    } finally {
        window.location.href = "sign-in.html";
    }
}
