function VRExamOptionEV() {
    let ord_table_text: string[]; // 예전 테이블 데이터 보관용
    let td_data: NodeListOf<HTMLInputElement>; //현제 테이블 보관용

    // DB 에서 VR 문제 가져와서 테이블 채우기
    fetch("/admin/api/getvrexamoption").then(async (res) => {
        const table = document.getElementById("db_data") as HTMLTableElement;

        const data: [
            {
                exam_id: string;
                exam_option: string;

                [key: string]: string; //line[obj] 오류방지
            }
        ] = await res.json();

        for (const line of data) {
            const row = table.insertRow();
            row.id = `${line.exam_id}|${line.exam_option}`;

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

        // 완료, 취소, 항목추가 버튼은 보이게 수정버튼은 안보이게
        edit_complete.style.display = "inline-block";
        edit_cancel.style.display = "inline-block";
        edit_add.style.display = "inline-block";
        edit_table.style.display = "none";
    });

    // 취소 버튼 클릭 이벤트
    const edit_cancel = document.getElementById(
        "edit_cancel"
    ) as HTMLInputElement;
    edit_cancel.addEventListener("click", (e) => {
        e.preventDefault();

        // 추가한 값 제거
        document.querySelectorAll(".new_add").forEach((line) => {
            line.remove();
        });

        // 수정된거 있으면 기존으로 되돌리기
        let i = 0;
        td_data.forEach((line) => {
            line.disabled = true;
            if (line.value !== ord_table_text[i]) {
                line.value = ord_table_text[i];
            }
            i++;
        });

        // 완료, 취소, 항목추가 버튼은 안보이게 수정버튼은 안보이게
        edit_complete.style.display = "none";
        edit_cancel.style.display = "none";
        edit_add.style.display = "none";
        edit_table.style.display = "inline-block";
    });

    // 항목추가 버튼 클릭 이벤트
    const edit_add = document.getElementById("edit_add") as HTMLInputElement;
    let add_id = 0; // 아이템 추가 횟수
    edit_add.addEventListener("click", (e) => {
        e.preventDefault();

        // 행추가
        const table = document.getElementById("db_data") as HTMLTableElement;
        const point_cell = table.rows.item(0)?.childNodes; // 첫번째 행에 자식요소들
        const row = table.insertRow();
        row.id = `add_${add_id}`;
        row.className = "new_add";

        point_cell?.forEach((line) => {
            const element = line as HTMLTableCellElement;

            const text = document.createElement("input") as HTMLInputElement;
            text.id = "tdtext";
            text.value = `<값을 입력해 주세요>`;

            const td = row.insertCell();
            td.appendChild(text);
            td.id = element.id;
        });

        // 테이블 스크롤 맨 아래로
        const table_header = document.getElementById(
            "table-header"
        ) as HTMLSelectElement;
        table_header.scrollTop = table_header.scrollHeight;

        td_data = document.querySelectorAll("#tdtext"); // td_data 새로고침

        add_id++;
    });

    // 수정 완료 버튼 클릭 이벤트
    const edit_complete = document.getElementById(
        "edit_complete"
    ) as HTMLInputElement;
    edit_complete.addEventListener("click", async (e) => {
        e.preventDefault();
        let i = 0;
        const editarr: HTMLInputElement[] = []; // 수정된 항목 보관
        const addarr: HTMLTableRowElement[] = []; // 추가된 항목 보관

        document.querySelectorAll(".new_add").forEach((line) => {
            addarr.push(line as HTMLTableRowElement);
        });

        td_data.forEach((line) => {
            line.disabled = false;

            if (line.value !== ord_table_text[i]) {
                const parentclass = line.parentElement?.parentElement?.className;
                // 수정된 항목만 추가하게
                if (parentclass !== "new_add") {
                    editarr.push(line);
                }
            }
            i++;
        });

        // 추가한 항목 Promise.all = 모든 Promise객체 동기처리
        const add_results = await Promise.all(addarr.map(async (line) => {
            const addvalue: { insert_item: string; insert_value: string } = {
                insert_item: "",
                insert_value: "",
            };

            line.childNodes.forEach((child) => {
                const td = child as HTMLTableCellElement;
                const element = td.children.item(0) as HTMLInputElement;

                addvalue.insert_item += `${td.id},`;
                addvalue.insert_value += `"${element.value}",`;
            });

            // 마지막에 , 지우기
            addvalue.insert_item = addvalue.insert_item.slice(0, -1);
            addvalue.insert_value = addvalue.insert_value.slice(0, -1);

            const insertd = await fetch("/admin/api/insertdb", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    table_name: "VR_exam_option",
                    insert_item: addvalue.insert_item,
                    insert_value: addvalue.insert_value,
                }),
            });

            if (insertd.ok) {
                const resdata = await insertd.json();
                console.log(resdata);
                
                //
                const exam_id = line.children.item(0)?.children.item(0) as HTMLInputElement;
                const exam_option = line.children.item(1)?.children.item(0) as HTMLInputElement;
                line.className = "";
                line.id = `${exam_id.value}|${exam_option.value}`; // 추가한 항목에 exam_id|exam_option

                console.log({
                    code: true,
                    messge: "ok",
                });
                return {
                    code: true,
                    messge: "ok",
                };
            } else {
                const resdata = await insertd.json();
                console.log({
                    code: false,
                    messge: resdata,
                });
                return {
                    code: false,
                    messge: resdata,
                };
            }
        }));

        const add_err_results = add_results.filter((item) => {
            return item.code === false;
        });

        if (add_err_results.length) {
            alert(
                `${add_err_results.length}개 항목을 추가 할수 없습니다.\n자세한 사항은 로그를 살펴보세요`
            );
        } else {
            if (add_results.length) alert(`${add_results.length}항목 추가`);
        }

        // 수정한 항목 Promise.all = 모든 Promise객체 동기처리
        const edit_results = await Promise.all(
            editarr.map(async (line) => {
                const updata_value = line.value;
                const target_column = line.parentElement?.id;
                const where = line.parentElement?.parentElement?.id.split("|") as string[];

                const updatadb = await fetch("/admin/api/updatadb", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        table_name: "VR_exam_option",
                        target_column: target_column,
                        updata_value: updata_value,
                        where: `exam_id = "${where[0]}" && exam_option = "${where[1]}"`,
                        // 0번은 exam_id 1번은 exam_option
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

        const edit_err_results = edit_results.filter((item) => {
            return item.code === false;
        });

        if (edit_err_results.length) {
            alert(
                `${edit_err_results.length}개 항목을 업데이트 할수 없습니다.\n자세한 사항은 로그를 살펴보세요`
            );
        } else {
            if (edit_results.length) alert("테이블 수정 완료");
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

        // 완료, 취소, 항목추가 버튼은 안보이게 수정버튼은 안보이게
        edit_complete.style.display = "none";
        edit_cancel.style.display = "none";
        edit_add.style.display = "none";
        edit_table.style.display = "inline-block";
    });
}
