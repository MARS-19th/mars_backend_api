function UserMarkTitleEV() {
    // 초보 프냥이
    const f1 = document.getElementById("f1") as HTMLInputElement;
    f1.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "초보 프냥이");
    });

    // 초보 프백냥이
    const f2 = document.getElementById("f2") as HTMLInputElement;
    f2.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "초보 프백냥이");
    });

    // 자바스크립트 프냥이
    const f3 = document.getElementById("f3") as HTMLInputElement;
    f3.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "자바스크립트 프냥이");
    });

    // 프론트엔드 마법사냥
    const f4 = document.getElementById("f4") as HTMLInputElement;
    f4.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "프론트엔드 마법사냥");
    });

    // 프론트엔드 냥스터
    const f5 = document.getElementById("f5") as HTMLInputElement;
    f5.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "프론트엔드 냥스터");
    });

    // 프론트엔드 마에스트냥
    const f6 = document.getElementById("f6") as HTMLInputElement;
    f6.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "프론트엔드 마에스트냥");
    });

    // 초보 백냥이
    const b1 = document.getElementById("b1") as HTMLInputElement;
    b1.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "초보 백냥이");
    });

    // 초보 백프냥이
    const b2 = document.getElementById("b2") as HTMLInputElement;
    b2.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "초보 백프냥이");
    });

    // 자바스크립트 백냥이
    const b3 = document.getElementById("b3") as HTMLInputElement;
    b3.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "자바스크립트 백냥이");
    });

    // 백엔드 냥지니어
    const b4 = document.getElementById("b4") as HTMLInputElement;
    b4.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "백엔드 냥지니어");
    });

    // 백엔드 냥스터
    const b5 = document.getElementById("b5") as HTMLInputElement;
    b5.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "백엔드 냥스터");
    });

    // 백엔드 마에스트냥
    const b6 = document.getElementById("b6") as HTMLInputElement;
    b6.addEventListener("click", async (e) => {
        e.preventDefault();
        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        insert_title(user_name, "백엔드 마에스트냥");
    });

    // 얻은 칭호들 보여주기 이벤트
    const view_bt = document.getElementById("view_bt") as HTMLInputElement;
    let isclick: boolean
    view_bt.addEventListener("click", async (e) => {
        e.preventDefault();
        const view_div = document.getElementById("table_view") as HTMLDivElement;

        if (isclick) {
            view_div.style.display = "none";
            document.querySelectorAll(".title_td").forEach((item) => {
                item.remove();
            })
            isclick = false;
            return;
        }

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }
        const getusertitle = await fetch(`/admin/api/getusertitle/${user_name}`);

        if (getusertitle.ok) {
            console.log({
                code: true,
                messge: "ok",
            });
        } else {
            const err = (await getusertitle.json()).err;
            console.log({
                code: false,
                messge: err,
            });
            if (err === "empty") {
                alert("칭호가 비어있습니다!");
            }
        }
        
        const title_list = (await getusertitle.json()).results as [];

        const tr = document.getElementById("title_tr") as HTMLTableRowElement;

        title_list.forEach((line) => {
            const td = tr.insertCell();
            td.innerHTML = line;
            td.className = "title_td";
        });

        view_div.style.display = "block";
        isclick = true;
    });

    // 얻은 id로 db에 집어 넣기
    async function insert_title(user_name: string, title: string) {
        const title_insert = await fetch("/admin/api/insertdb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_get_title",
                insert_item: `user_name, user_title`,
                insert_value: `"${user_name}", "${title}"`,
            }),
        });

        if (title_insert.ok) {
            console.log({
                code: true,
                messge: "ok",
            });
            alert(`${title}추가 완료`);
        } else {
            const resdata = await title_insert.json();
            console.log({
                code: false,
                messge: resdata,
            });
            if ((resdata.err = "ER_DUP_ENTRY")) {
                if (confirm("이미 추가된 칭호입니다. 삭제할까요?")) {
                    del_title(user_name, title);
                }
            }
        }
    }

    // 칭호 지우기
    async function del_title(user_name: string, title: string) {
        const deldb = await fetch("/admin/api/deldb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_get_title",
                where: `user_name = "${user_name}" && user_title = "${title}"`,
            }),
        });

        if (deldb.ok) {
            console.log({
                code: true,
                messge: "ok",
            });
        } else {
            const resdata = await deldb.json();
            console.log({
                code: false,
                messge: resdata,
            });
        }
    }
}
