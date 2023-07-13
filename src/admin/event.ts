async function setname(event: MouseEvent) {
    event.preventDefault();
    const id = document.getElementById("id") as HTMLInputElement;
    const passwd = document.getElementById("passwd") as HTMLInputElement;
    if (!id.value && !id.value) {
        return;
    }
    const response = await fetch(`${window.location.origin}/api/setname`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id.value,
            passwd: passwd.value,
        }),
    });

    if (response.ok) {
        id.value = "";
        passwd.value = "";
    } else {
        console.log("오류남");
    }
}

document.getElementById("add")?.addEventListener("click", (e) => setname(e));
