import * as fs from "fs";
import * as firebase from "firebase-admin";

const serverset = JSON.parse(fs.readFileSync("bin/server.json", "utf-8"));

async function gettest(url: string) {
    const response = await fetch(`http://korseok.kro.kr/api/${url}`);

    const res = await response.json();
    console.log(res);
}

async function settest(url: string) {
    const body = {
        user_name: "관리자1",
        object_id: 8,
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

function chatreq() {
    firebase.initializeApp({
        credential: firebase.credential.cert(serverset.fcmkey),
    });

    let target_token = `chu1zDfyQJS5gvL9b0CIT-:APA91bGMCVSHbkLBlURPBhpOuL1EpVkiBVxalEGT8I9RVpGusqDSEvfFPgQ8_MCarixJEKSyclV2Gk5GEaLxV0I_PXO2mS-TTo7F1U-VI6rWBH5jKEaodc5-BynH5nkWMjO4praii_hw`;
    //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다

    let message = {
        notification: {
            title: "테스트 데이터 발송",
            body: "데이터가 잘 가나요?",
        },
        token: target_token,
    };

    firebase
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Successfully sent message: : ", response);
        })
        .catch((err) => {
            console.log("Error Sending message!!! : ", err);
        });
}

chatreq();
