function LoginPageEV() {
    const okbt = document.getElementById("input") as HTMLInputElement;
    okbt.addEventListener("click", (e) => {
        e.preventDefault();

        // 비번 맞는지 검증
        const inputtext = document.getElementById("passwd") as HTMLInputElement;
        fetch("/admin/api/verifypasswd", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                passwd: inputtext.value,
            }),
        }).then((line) => {
            if (!line.ok) {
                alert("페스워드를 다시 입력해 주세요.");
            } else {
                loginjwt();
            }
        });
    });
}

// jwt 로그인 과정 시작
async function loginjwt() {
    const reqjwt = await fetch("/admin/api/loginjwt", {
        method: "post"
    });
    const jwttoken: login = await reqjwt.json();

    localStorage.setItem("login", JSON.stringify(jwttoken));
    window.location.href = "/admin";
}
