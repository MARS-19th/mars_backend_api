async function UserMarkEV() {
    // js 까지 목표 밀기 이벤트
    const js = document.getElementById("js") as HTMLInputElement;
    js.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = ["html", "java", "python", "css", "js"];

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        // 목표 id 얻기
        data.forEach(async (line) => {
            const res = await fetch(`/admin/api/getdetailsmarkid/${line}`);
            await res.json().then((data) => {
                insertdb(data.results, user_name, line);
            });
        });
    });

    // 백엔드 중간시험 전까지 밀기 이벤트
    const back = document.getElementById("back") as HTMLInputElement;
    back.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = ["html", "java", "python", "css", "js", "backend"];

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        // 목표 id 얻기
        data.forEach(async (line) => {
            const res = await fetch(`/admin/api/getdetailsmarkid/${line}`);
            await res.json().then((data) => {
                insertdb(data.results, user_name, line);
            });
        });
    });

    // 프론트 중간시험 전까지 밀기 이벤트
    const front = document.getElementById("front") as HTMLInputElement;
    front.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = ["html", "java", "python", "css", "js", "frontend"];

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        // 목표 id 얻기
        data.forEach(async (line) => {
            const res = await fetch(`/admin/api/getdetailsmarkid/${line}`);
            await res.json().then((data) => {
                insertdb(data.results, user_name, line);
            });
        });
    });

    // 백엔드 올클리어 이벤트
    const back_all = document.getElementById("back_all") as HTMLInputElement;
    back_all.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = [
            "html",
            "java",
            "python",
            "css",
            "js",
            "backend",
            "중간시험",
            "spring",
            "node",
        ];

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        // 목표 id 얻기
        data.forEach(async (line) => {
            const res = await fetch(`/admin/api/getdetailsmarkid/${line}`);
            await res.json().then((data) => {
                insertdb(data.results, user_name, line);
            });
        });
    });

    // 프론트 올클리어 이벤트
    const front_all = document.getElementById("front_all") as HTMLInputElement;
    front_all.addEventListener("click", async (e) => {
        e.preventDefault();
        const data = [
            "html",
            "java",
            "python",
            "css",
            "js",
            "backend",
            "중간시험",
            "jsp",
            "react",
        ];

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        // 목표 id 얻기
        data.forEach(async (line) => {
            const res = await fetch(`/admin/api/getdetailsmarkid/${line}`);
            await res.json().then((data) => {
                insertdb(data.results, user_name, line);
            });
        });
    });

    // 목표 클리어 버튼 이벤트
    const clear = document.getElementById("clear") as HTMLInputElement;
    clear.addEventListener("click", async (e) => {
        e.preventDefault();

        const user_name = (document.getElementById("name") as HTMLInputElement)
            .value;

        // 닉네임 유효성 검사
        const res = await fetch(`/admin/api/getusername/${user_name}`);
        if (!res.ok) {
            alert("닉네임 다시입력 바람");
            return;
        }

        const User_skill_clear = await fetch("/admin/api/deldb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_skill",
                where: `user_name = "${user_name}"`,
            }),
        });

        const User_mark_clear = await fetch("/admin/api/deldb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_mark",
                where: `user_name = "${user_name}"`,
            }),
        });

        const User_get_title_clear = await fetch("/admin/api/deldb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_get_title",
                where: `user_name = "${user_name}" && user_title != "새싹"`,
            }),
        });

        const update_default_title = await fetch("/admin/api/updatadb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_data",
                target_column: "user_title",
                updata_value: "새싹",
                where: `user_name = "${user_name}"`,
            }),
        });

        if (
            User_skill_clear.ok &&
            User_mark_clear.ok &&
            User_get_title_clear.ok &&
            update_default_title.ok
        ) {
            alert("초기화 완료");
        } else {
            alert("초기화 실패");
        }
    });

    // 얻은 id로 db에 집어 넣기
    async function insertdb(ids: [], user_name: string, skill_field: string) {
        const User_skill_insert = await fetch("/admin/api/insertdb", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                table_name: "User_skill",
                insert_item: `user_name, skill_field`,
                insert_value: `"${user_name}", "${skill_field}"`,
            }),
        });

        if (User_skill_insert.ok) {
            console.log({
                code: true,
                messge: "ok",
            });
        } else {
            const resdata = await User_skill_insert.json();
            console.log({
                code: false,
                messge: resdata,
            });
        }

        ids.forEach(async (line) => {
            const User_mark_insert = await fetch("/admin/api/insertdb", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    table_name: "User_mark",
                    insert_item: `user_name, mark_id, progress`,
                    insert_value: `"${user_name}", ${line}, 100`,
                }),
            });

            if (User_mark_insert.ok) {
                console.log({
                    code: true,
                    messge: "ok",
                });
            } else {
                const resdata = await User_mark_insert.json();
                console.log({
                    code: false,
                    messge: resdata,
                });
            }
        });
    }
}
