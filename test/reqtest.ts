import * as fs from "fs";
const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const body = {
        user_name: "관리자1",
        object_id: 8
    };

    const response = await fetch(`http://korseok.kro.kr/api/${url}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const res = await response.json();
    console.log(res);
}

async function chatreq() {
    const token = "ya29.a0AfB_byD1c0gZbLcku1kZmBET-akn3OHwK1ksO1H4GrbyosBp7-bb1f9PXjzvpfus0U_KEgWudCpckOOh9HypkptRRY8c70aZReNlBAZ-FfbeYgceeSsfmeIdSHqifR3kpfgCLGG8JzIFK08yI-7YTqKO_Mbx3Fxndzt4aCgYKAQoSARMSFQGOcNnCaQY5pBHjEHCvD3O3DkZWhA0171"

    const body = {
        message: {
            token: "chu1zDfyQJS5gvL9b0CIT-:APA91bGMCVSHbkLBlURPBhpOuL1EpVkiBVxalEGT8I9RVpGusqDSEvfFPgQ8_MCarixJEKSyclV2Gk5GEaLxV0I_PXO2mS-TTo7F1U-VI6rWBH5jKEaodc5-BynH5nkWMjO4praii_hw",
            notification: {
                body: "hi",
                title: "sadada"
            }
        }
    };

    const response = await fetch(`https://fcm.googleapis.com/v1/projects/growverse-21715/messages:send`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ token,
        },
        body: JSON.stringify(body),
    });

    const res = await response.text();
    console.log(res);
}

chatreq();