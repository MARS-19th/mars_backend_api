type login = {
    access_token: string,
    refresh_token: string,
    expires_in: string, // 토큰이 만료 되는 시간 (밀리초)
}
// 로컬스토리지 타입
let login: login = JSON.parse(localStorage?.getItem("login") as string);

// 브라우저에서 로그인이 된 상태가 아닌경우
if (!login) {
    window.location.href = "/admin/login";
}

const jwt = async () => {
    const reqverify = await fetch("/admin/api/verifyjwt", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            access_token: login.access_token,
        }),
    });

    // 정상 응답 타입 (사실상 해당 데이터 사용안함)
    type resjwt = {
        exp: number;
        iat: number;
        id: string;
        iss: string;
    } & {
        //오류 응답 타입
        err: string;
    };
    let userdata: resjwt = await reqverify.json();
    console.log(userdata);

    // refresh 토큰
    if (userdata.err === "jwt expired") {
        const reqrefresh = await fetch("/admin/api/refreshjwt", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: login.access_token,
                refresh_token: login.refresh_token,
            } as login),
        });

        // refreshjwt 응답
        type resrefresh = login & {
            err: "refresh_fail";
        };
        const resrefresh: resrefresh = await reqrefresh.json();
        console.log(resrefresh);

        if (resrefresh.err) {
            // refresh_token이 만료되거나 갱신 불가
            localStorage.removeItem("login");
            window.location.href = "/admin/login";
            return;
        }

        // 갱신한 토큰 localStorage 에 저장
        localStorage.setItem("login", JSON.stringify(resrefresh));

        // localStorage 갱신
        login = JSON.parse(localStorage?.getItem("login") as string);
    } else if (userdata.err) {
        // access_token 인증시 알 수 없는 오류 발생
        localStorage.removeItem("login");
        window.location.href = "/login";
        return;
    }
};

jwt();