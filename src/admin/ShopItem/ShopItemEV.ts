function ShopItemEV() {
    let ord_table_text: string[]; // 예전 테이블 데이터 보관용
    let td_data: NodeListOf<HTMLInputElement>; //현제 테이블 보관용

    // DB 에서 상점아이템 갖고와서 테이블 체우기
    fetch("/admin/api/getshop").then(async (res) => {
        const table = document.getElementById("db_data") as HTMLTableElement;

        const data: [
            {
                object_id: string;
                type: string;
                item_name: string;
                image_local: string;
                price: string;

                [key: string]: string; //line[obj] 오류방지
            }
        ] = await res.json();

        for (const line of data) {
            const row = table.insertRow();
            row.id = line.object_id;

            Object.keys(line).forEach((obj: string) => {
                const text = document.createElement(
                    "input"
                ) as HTMLInputElement;
                text.id = "tdtext";
                text.disabled = true;
                text.value = line[obj];

                const td = row.insertCell();
                td.appendChild(text);
                td.id = obj;
            });
        }

        ord_table_text = [];
        td_data = document.querySelectorAll(
            "#tdtext"
        ) as NodeListOf<HTMLInputElement>;
        td_data.forEach((element) => {
            ord_table_text.push(element.value);
        });
    });

    // 테이블 수정 버튼 이벤트
    const edit_table = document.getElementById(
        "edit_table"
    ) as HTMLInputElement;
    edit_table.addEventListener("click", (e) => {
        e.preventDefault();

        td_data.forEach((line) => {
            // 수정되게 활성화
            line.disabled = false;
        });

        // 완료, 취소 버튼은 보이게 수정버튼은 안보이게
        edit_complete.style.display = "inline-block";
        edit_cancel.style.display = "inline-block";
        edit_table.style.display = "none";
    });

    // 수정 완료 버튼 클릭 이벤트
    const edit_complete = document.getElementById(
        "edit_complete"
    ) as HTMLInputElement;
    edit_complete.addEventListener("click", async (e) => {
        e.preventDefault();
        let i = 0;
        const editarr: HTMLInputElement[] = [];

        td_data.forEach((line) => {
            line.disabled = false;
            if (line.value !== ord_table_text[i]) {
                editarr.push(line);
            }
            i++;
        });

        // Promise.all = 모든 Promise객체 동기처리
        const results = await Promise.all(
            editarr.map(async (line) => {
                const updata_value = line.value;
                const target_column = line.parentElement?.id;
                const object_id = line.parentElement?.parentElement?.id;

                const updatadb = await fetch("/admin/api/updatadb", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        table_name: "Shop_item",
                        target_column: target_column,
                        updata_value: updata_value,
                        where: `object_id = "${object_id}"`,
                    }),
                });

                if (updatadb.ok) {
                    console.log({
                        code: true,
                        messge: "ok",
                        updata_value: updata_value,
                    });
                    return {
                        code: true,
                        messge: "ok",
                        updata_value: updata_value,
                    };
                } else {
                    const resdata = await updatadb.json();
                    console.log({
                        code: false,
                        messge: resdata,
                        updata_value: updata_value,
                    });
                    return {
                        code: false,
                        messge: resdata,
                        updata_value: updata_value,
                    };
                }
            })
        );

        const err_results = results.filter((item) => {
            return item.code === false;
        });

        if (err_results.length) {
            alert(
                `${err_results.length}개 항목을 업데이트 할수 없습니다.\n자세한 사항은 로그를 살펴보세요`
            );
        } else {
            if (results.length) alert("테이블 수정 완료");
        }

        // ord_table_text 초기화
        ord_table_text = [];
        td_data = document.querySelectorAll(
            "#tdtext"
        ) as NodeListOf<HTMLInputElement>;
        td_data.forEach((element) => {
            ord_table_text.push(element.value);
        });

        // 테이블 수정안되게
        td_data.forEach((line) => {
            line.disabled = true;
        });

        // 완료, 취소 버튼은 안보이게 수정버튼은 안보이게
        edit_complete.style.display = "none";
        edit_cancel.style.display = "none";
        edit_table.style.display = "inline-block";
    });

    // 취소 버튼 클릭 이벤트
    const edit_cancel = document.getElementById(
        "edit_cancel"
    ) as HTMLInputElement;
    edit_cancel.addEventListener("click", (e) => {
        e.preventDefault();

        // 수정된거 있으면 기존으로 되돌리기
        let i = 0;
        td_data.forEach((line) => {
            line.disabled = true;
            if (line.value !== ord_table_text[i]) {
                line.value = ord_table_text[i];
            }
            i++;
        });

        // 완료, 취소 버튼은 안보이게 수정버튼은 안보이게
        edit_complete.style.display = "none";
        edit_cancel.style.display = "none";
        edit_table.style.display = "inline-block";
    });
}
