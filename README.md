# mars 프로젝트 Restful API

-   앱에 필요한 요청/응답 처리를 위한 Node.js 기반 Restful API 입니다.

## API 사용법

API 목록을 참고하여 필요한 주소로 GET/POST 요청을 하면 됩니다.

요청 메인 URL: <code><b>http://dmumars.kro.kr/api</b></code>

> 예시: /getuserdata = `http://dmumars.kro.kr/api/getuserdata`

-   관리자1 로그인 = `admin1, admin`
-   관리자2 로그인 = `admin2, admin`

### 주의사항

-   모든 요청/응답 처리는 `JSON` 으로 처리합니다. 따라서 `JSONobject` 및 `JSONarray` 의 사용법을 숙지하시기 바랍니다.
-   POST 요청시 `JSON` 변수타입(int, string 등등) 유의하여 요청해 주세요
-   모든 오류응답은 `{err: 오류...}`로 반환 됩니다.
-   처리 해야하는 오류들만 정리하였으나, 필요하다면 [해당링크](https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html)에서 DB오류 코드를 참고하세요.

### (참고) POST 요청해더 예시

```javascript
method: post,
headers: {
    Content-Type: "application/json",
    Accept: "application/json"
},
body: {
    {값을 보내려는 json}
},
```

### API 목록

회원가입/로그인 부분

<dl>
<dd>
<details>
<summary>POST 요청</summary>

#### [/setperson](http://dmumars.kro.kr/api/setperson): 처음 회원 가입시

요청

```javascript
{ id: "id", passwd: "passwd" }
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_DUP_ENTRY"}`: 아이디가 중복되는 오류

#### [/login](http://dmumars.kro.kr/api/login): 로그인

요청

```javascript
{ id: "admin1", passwd: "admin" }
```

정상응답 (code: 200)

```javascript
{
    user_name: "관리자1",   //이름
    user_id: "admin1",  //아이디
    choice_mark: "프로그래밍",  //설정 목표
    user_title: "관리자",   //칭호
    profile_local: "default_profile.png",   //프사 경로
    life: 3,    //목숨
    money: 0,   //제화
    level: 1    //레벨
}
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "is_new"}`: 회원 가입만 해놓고 아무런 정보를 입력하지 않은 상태<br>
-   `{err: "empty"}`: DB에서 해당 회원을 찾을 수 없음(아이디, 페스워드 입력오류)

#### [/deluser](http://dmumars.kro.kr/api/deluser): 회원 탈퇴

요청

```javascript
{ id: "id", passwd: "passwd" }
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/getuseridpd](http://dmumars.kro.kr/api/getuseridpd): 닉네임으로 아이디, 비번 리턴

요청

```javascript
{
    user_name: "관리자1";
} //닉네임
```

정상응답 (code: 200)

```javascript
{ passwd: "admin", id: "admin1" }
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
-   `{err: "empty"}`: 해당 유저를 찾을 수 없음

</details>
</dd>

유저 데이터 부분

<dd>
<details>
<summary>GET 요청</summary>

#### [/getuserdata/[유저이름]](http://dmumars.kro.kr/api/getuserdata/관리자1): 해당 유저의 정보 리턴

정상응답 (code: 200)

```javascript
{
    user_name: "관리자1",   //이름
    user_id: "admin1",  //아이디
    choice_mark: "프로그래밍",  //설정 목표
    user_title: "관리자",   //칭호
    profile_local: "default_profile.png",   //프사 경로
    life: 3,    //목숨
    money: 0,   //제화
    level: 1    //레벨
    //유저이름은 관리자1
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저를 찾을 수 없음

#### [/getfriend/[유저이름]](http://dmumars.kro.kr/api/getfriend/관리자1): 해당 유저의 친구 목록 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        //유저이름은 관리자1
        {
            friend: "관리자2", //친구 닉네임
            isaccept: true, //해당 친구의 친추수락 여부
        },
        {
            friend: "석씨s",
            isaccept: false,
        },
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의 */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저를 찾을 수 없음

#### [/getreqfriend/[유저이름]](http://dmumars.kro.kr/api/getreqfriend/관리자1): 해당 유저의 친구 요청자 목록 리턴

정상응답 (code: 200)

```javascript
{
    results: ["yoona", "석씨s"];
} //유저이름은 관리자1
// jsonarray 타입임
// 친구 요청자 목록은 한쪽에서만 친구가 추가된 상태인 경우 리턴됨
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저를 찾을 수 없거나 친구 요청자가 없음

#### [/usertitle](http://dmumars.kro.kr/api/usertitle): 모든 칭호들 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        {
            user_title: "새싹", //칭호 제목
            class: "all", //프론트 = front, 백 = back, 전체 = all
            level: 0, //달성레벨
        },
        {
            user_title: "관리자",
            class: "admin",
            level: 1,
        },
        {
            user_title: "초보 백엔드 냥이",
            class: "back",
            level: 1,
        },
        {
            user_title: "초보 프냥이",
            class: "front",
            level: 1,
        },
        /* 이하 생략 */
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의 */
}
```

오류응답 (code: 500)

-   없음

#### [/usergettitle/[유저이름]](http://dmumars.kro.kr/api/usergettitle/관리자1): 해당 유저가 획득한 칭호들 리턴

정상응답 (code: 200)

```javascript
{
    results: ["관리자"];
} //유저이름은 관리자1
// jsonarray 타입임
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저를 찾을 수 없음

#### [/getuserbtuuid/[유저이름]](http://dmumars.kro.kr/api/getuserbtuuid/관리자1): 해당 유저의 블루투스 uuid 주소 리턴

정상응답 (code: 200)

```javascript
{
    identifier_code: "1c99ad9c-8767-40d9-83f2-3d64e3e95d32";
} //유저이름은 관리자1
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저를 찾을 수 없음

#### [/getbtuserdata/[uuid]](http://dmumars.kro.kr/api/getbtuserdata/1c99ad9c-8767-40d9-83f2-3d64e3e95d32): 해당 블루투스 uuid에 해당하는 유저 데이터 리턴

정상응답 (code: 200)

```javascript
{
    user_name: "관리자1",   //이름
    user_id: "admin1",  //아이디
    choice_mark: "프로그래밍",  //설정 목표
    user_title: "관리자",   //칭호
    profile_local: "default_profile.png",   //프사 경로
    life: 3,    //목숨
    money: 0,   //제화
    level: 1    //레벨
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 uuid에 해당하는 유저를 찾을 수 없음
</details>
</dd>

<dd>
<details>
<summary>POST 요청</summary>

#### [/setuser](http://dmumars.kro.kr/api/setuser): 유저 정보입력 (최종가입)

요청

```javascript
{
    user_name: "name",  //닉네임
    user_id: "id",  //아이디
    choice_mark: "프로그래밍",  //선택한 목표
    profile_local: "프사파일 이름" 또는 null //프사 설정 안할꺼면 null 로 설정
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_DUP_ENTRY"}`: 중복발생<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 설정하려는 id, 목표가 DB에 없음(외래키 문제)

#### [/setmoney](http://dmumars.kro.kr/api/setmoney): 유저 재화 조정

요청

```javascript
{ user_name: "관리자1", value: 1000 }
```

정상응답 (code: 200)

```javascript
{
    results: 1000;
} //설정한 value 값
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/setlife](http://dmumars.kro.kr/api/setlife): 유저 목숨 조정

요청

```javascript
{ user_name: "관리자1", value: 2 }
```

정상응답 (code: 200)

```javascript
{
    results: 2;
} //설정한 value 값
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/setlevel](http://dmumars.kro.kr/api/setlevel): 유저 레벨 조정

요청

```javascript
{ user_name: "관리자1", value: 1 }
```

정상응답 (code: 200)

```javascript
{
    results: 1;
} //설정한 value 값
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/setusertitle](http://dmumars.kro.kr/api/setusertitle): 유저 칭호 변경

요청

```javascript
{ user_name: "관리자1", value: "새싹" } //추가 되는 칭호가 있으면 연락 바람
```

정상응답 (code: 200)

```javascript
{
    results: "새싹";
} //설정한 value 값
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 설정하려는 칭호가 DB에 없음(외래키 문제)

#### [/setname](http://dmumars.kro.kr/api/setname): 유저 이름 변경

요청

```javascript
{
    curname: "관리자1", //기존이름
    newname: "관리자3"  //바꿀이름
}
```

정상응답 (code: 200)

```javascript
{
    results: "관리자3";
} //바꾼이름
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "exist"}`: 닉네임 중복 발생

#### [/checkname](http://dmumars.kro.kr/api/checkname): 닉네임 중복 체크

요청

```javascript
{
    user_name: "닉네임";
} //닉네임
```

정상응답 (code: 200)

```javascript
{ results: true 또는 false }    //중복이면 false 아니면 true
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/setfriend](http://dmumars.kro.kr/api/setfriend): 친구추가

요청

```javascript
{
    user_name: "관리자1",   //친구추가 요청자 닉네임
    friend: "관리자2"  //친구 닉네임
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_DUP_ENTRY"}`: 이미 친구 상태임

#### [/delfriend](http://dmumars.kro.kr/api/delfriend): 친구삭제

요청

```javascript
{
    user_name: "관리자1", // 친삭 요청자 닉네임
    friend: "관리자2"  // 친구 닉네임
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/setuserbtuuid](http://dmumars.kro.kr/api/setuserbtuuid): 사용자 블루투스 uuid 설정

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    bt_uuid: "블루투스 mac 주소" //블루투스 mac주소
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 해당 닉네임이 DB에 존재하지 않음

#### [/setuserfcmtoken](http://dmumars.kro.kr/api/setuserfcmtoken): 사용자 fcm 토큰키 설정

> fcm 토큰키는 firebase 클라우드 메시징에 사용됨

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    fcm_token: "fcm토큰키" //fcm토큰키
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 해당 닉네임이 DB에 존재하지 않음

#### [/pushuserchat](http://dmumars.kro.kr/api/pushuserchat): 유저 채팅 fcm 서버에 전송

> 전송된 메시지는 받는 유저의 onMessageReceived() 메소드에서 받아볼 수 있음

요청

```javascript
{
    user_name: "관리자1",   //보내는 유저 닉네임
    from_user: "관리자2",   //받는 유저 닉네임
    messge: "메시지",   //보낼 메시지
}
```

정상응답 (code: 200)

```javascript
{
  results: "success_send",  // 정상적으로 전송됬다는 의미
  notification: { title: "관리자1", body: "메시지" }   //전송된 데이터 원형
}
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
-   `{err: "unfound_fcm_token"}`: 받는 유저의 fcm_token값이 존재하지 않거나, 해당 유저가 DB에 존재하지 않음
-   `{err: "send_err"}`: 메시지를 전송하는 과정에서 알 수 없는 오류가 발생함
</details>
</dd>

<dd>
<details>
<summary>리소스 업/다운로드</summary>

#### [/uploadprofile](http://dmumars.kro.kr/api/uploadprofile): 프로필 사진 업로드 (POST)

> 파일 업로드 부분은 예제코드 참고, 파일은 [jpg, jpeg, png] 만 업로드 가능

요청

```javascript
{
    user_name: "관리자1",   // 닉네임
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "file_upload_err"}`: 파일 업로드 과정에서 오류가 생김

#### [/getprofile/[닉네임]](http://dmumars.kro.kr/api/getprofile/관리자1): 유저 프로필 사진 불러오기 (GET)

> 리소스 불러오는 부분은 MainMypageFragment의 96라인 참고

정상응답 (code: 200)

```
유저 프로필 사진 이미지
```

오류응답 (code: 500)

-   `{err: "empty"}`: 닉네임이 DB에 존재하지 않음

</details>
</dd>

유저 목표 부분

<dd>
<details>
<summary>GET 요청</summary>

#### [/getdetailmark/[스킬명]](http://dmumars.kro.kr/api/getdetailmark/css): 해당 스킬에 전체 세부목록 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        //스킬명 = css
        {
            mark_id: 3, //스킬 아이디
            mark_list: "CSS 1주차 강의 듣기", // 세부목표 내용
            level: 1, //주차
        },
        { mark_id: 4, mark_list: "CSS 2주차 강의 듣기", level: 2 },
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    스킬명은 스킬트리에 적힌 스킬명 */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 스킬명이 DB에 존재하지 않음

#### [/getdetailmark/[스킬명]/[주차]](http://dmumars.kro.kr/api/getdetailmark/css/1): 세부 목표에 id 값과 세부목표를 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        //스킬명 = css, 주차 = 1
        {
            mark_id: 1, //스킬 아이디
            mark_list: "CSS 1주차 강의 듣기", //세부목표 내용
        },
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    스킬명은 스킬트리에 적힌 스킬명 */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 스킬명이나 해당 주차가 DB에 존재하지 않음

#### [/getuserskill/[유저이름]](http://dmumars.kro.kr/api/getuserskill/관리자1): 해당 유저의 선택한 스킬트리를 리턴

정상응답 (code: 200)

```javascript
{
    results: ["css", "html", "java", "python"];
} //선택한 스킬트리 (얻은 순서대로 정렬)
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저가 DB 에 존재하지 않음

#### [/getusermark/[유저이름]/[스킬명]/[주차]](http://dmumars.kro.kr/api/getusermark/관리자1/html/1): 해당 유저의 세부목표 진행상황 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        {
            mark_id: 1, //목표 아이디
            progress: 100, //진행도
            date: "2023-07-09T00:00:00.000Z", //진행날짜
        },
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것 */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 이름, 스킬명, 해당주차가 DB에 존재하지 않음

#### [/getmoredata/[목표 아이디]](http://dmumars.kro.kr/api/getmoredata/1): 해당 세부목표에 추가 자료를 제공 ex) 유튜브 링크같은거

정상응답 (code: 200)

```javascript
{
    results: [
        {
            info_data: "https://www.youtube.com/watch?v=8kJwTrs6e-4&t=10s",
            type: "타입지정바람",
        },
    ];

    /* 
    results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    해당 세부목표에 유튜브 링크 같은 요소 제공 
    목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것 
    */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 목표id 가 존재하지 않음

#### [/getskilltree/[목표명]](http://dmumars.kro.kr/api/getskilltree/프로그래밍): 해당 목표에 대한 스킬트리 리턴

> 목표: 프로그래밍, 등산

정상응답 (code: 200)

```javascript
{
    results: [
        { skill_field: "css", skill_level: 1 },
        { skill_field: "python", skill_level: 1 },
        { skill_field: "html", skill_level: 1 },
        { skill_field: "java", skill_level: 1 },
        { skill_field: "js", skill_level: 2 },
        { skill_field: "backend", skill_level: 3 },
        { skill_field: "frontend", skill_level: 3 },
        { skill_field: "중간시험", skill_level: 4 },
        { skill_field: "jsp", skill_level: 5 },
        { skill_field: "node", skill_level: 5 },
        { skill_field: "diango", skill_level: 5 },
        { skill_field: "react", skill_level: 5 },
        { skill_field: "spring", skill_level: 5 },
    ];

    // results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 목표가 존재하지않음

#### [/getuserdatemark/[닉네임]](http://dmumars.kro.kr/api/getuserdatemark/관리자1): 해당 유저가 추가한 모든 일간목표 클리어 여부 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        {
            mark_id: 1, //일간목표id
            mark_list: "사용자목표1", //목표목록
            is_clear: true, //클리어여부
            add_time: "2023-10-01T10:57:26.000Z", //추가한 시간
        },
        {
            mark_id: 2,
            mark_list: "사용자목표2",
            is_clear: false,
            add_time: "2023-10-01T10:57:26.000Z",
        },
    ];
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저가 아무런 일간목표를 추가하지 않거나 닉네임이 DB에 없음

#### [/getuserdatemark/[닉네임]/day](http://dmumars.kro.kr/api/getuserdatemark/관리자1/day): 해당 유저가 24시간 이내의 추가한 일간목표 클리어 여부 리턴

정상응답 (code: 200)

```javascript
{
    "results": [
        {
            mark_id: 1, //일간목표id
            mark_list: "사용자목표1",   //목표목록
            is_clear: true, //클리어여부
            add_time: "2023-10-01T10:57:26.000Z",   //추가한 시간
            remaining: 84240    //남은시간(초)
        },
        {
            mark_id: 2,
            mark_list: "사용자목표2",
            is_clear: false,
            add_time: "2023-10-01T10:57:26.000Z",
            remaining: 84240
        }
    ]

    /* 24시간이 지난 일간목표는 표시되지 않음 */
}
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 유저가 아무런 일간목표를 추가하지 않거나 모든 목표가 만료됨 또는 닉네임이 DB에 없음
</details>
</dd>

<dd>
<details>
<summary>POST 요청</summary>

#### [/setuserskill](http://dmumars.kro.kr/api/setuserskill): 사용자 스킬트리 추가

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    skill: "js" //추가할 스킬
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 추가할 스킬이 DB에 존재하지 않음<br>
-   `{err: "ER_DUP_ENTRY"}`: 이미 추가된 스킬

#### [/setuserdetailskill](http://dmumars.kro.kr/api/setuserdetailskill): 사용자 세부진행 목표 설정

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    mark_id: 1, //목표아이디
    progress: 100,  //진행도

    /* 세부 목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것
    세부목표 추가시 연락할것 */
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 목표아이디가 DB에 존재하지 않음

#### [/setuserdatemark](http://dmumars.kro.kr/api/setuserdatemark): 사용자 일간목표 추가

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    mark_list: "추가하고 싶은 일간목표",    //추가할 목표

    /* 추가시 클리어 여부는 무조건 false */
}
```

정상응답 (code: 200)

```javascript
{
    results: 5;
} //추가된 일간목표에 목표id
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임이 DB에 존재하지 않음

#### [/upuserdatemark](http://dmumars.kro.kr/api/upuserdatemark): 사용자 일간목표 달성 여부 및 목표 수정

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    mark_id: 1, //일간목표id
    mark_list: "바꾸고 싶은 목표",  //수정할 목표
    is_clear: true 또는 false   //클리어여부
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

#### [/deluserdatemark](http://dmumars.kro.kr/api/deluserdatemark): 사용자 일간목표 삭제

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    mark_id: 1, //일간목표id
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
</details>
</dd>

아바타 설정/상점 아이템 부분

<dd>
<details>
<summary>GET 요청</summary>

#### [/getuseravatar/[유저이름]](http://dmumars.kro.kr/api/getuseravatar/관리자1): 유저의 아바타 불러오기

정상응답 (code: 200)

```javascript
{
    type: "cat", //아바타 타입(cat)
    look: "식별하는무언가1",    //표정
    color: "식별하는무언가2",   //색상
    moun_shop: 1, //장착한 상점 아이템id

    // moun_shop 은 장착한 아이템이 없으면 null
}
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 유저가 DB 에 존재하지 않음

#### [/getshopitemid](http://dmumars.kro.kr/api/getshopitemid): 상점 전체 아이템 정보 불러오기

> 아이템 타입: bag, fish, cap, glasses, meat, wind, fork

정상응답 (code: 200)

```javascript
{
    results: [
        {
            object_id: 1, //아이템id
            item_name: "가방", //아이템 이름
            type: "bag", //아이템 타입
            price: 2400, //가격
        },
        {
            object_id: 2,
            item_name: "생선",
            type: "fish",
            price: 500,
        },
        /* 이하생략 */
    ];

    // results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
}
```

오류응답 (code: 500)

-   없음

#### [/getshopitemid/[아이템타입]](http://dmumars.kro.kr/api/getshopitemid/cap): 해당 아이템 타입에 상점 아이템 정보 불러오기

> 아이템 타입: bag, fish, cap, glasses, meat, wind, fork

정상응답 (code: 200)

```javascript
{
    results: [
        //아이템타입 = cap
        {
            object_id: 3, //아이템id
            item_name: "모자", //아이템 이름
            price: 1200, //가격
        },
    ];

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    추후 아이템 타입 변경시 연락바람 */
}
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 유저가 아이템타입이 DB에 존재하지 않음

#### [/getuserfititem/[닉네임]](http://dmumars.kro.kr/api/getuserfititem/관리자1): 해당 유저가 장착한 상점 아이템 아이디 불러오기

정상응답 (code: 200)

```javascript
{
    moun_shop: 1;
} //장착한 상점 아이템id
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 유저가 아이템타입이 DB에 존재하지 않음

#### [/getuserinventory/[닉네임]](http://dmumars.kro.kr/api/getuserinventory/관리자1): 해당 유저의 인벤토리 블러오기

> 아이템 타입: bag, fish, cap, glasses, meat, wind, fork

정상응답 (code: 200)

```javascript
{
    results: [
        {
            object_id: 1, // 아이템id
            item_name: "모자1", //  아이템이름
            type: "cap", //  아이템 타입
        },
        {
            object_id: 3,
            item_name: "상의1",
            type: "top",
        },
        /* 이하생략 */
    ];
}
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 유저가 얻은 아이템이 없거나 닉네임이 DB에 존재하지 않음
</details>

<details>
<summary>POST 요청</summary>

#### [/setuseravatar](http://dmumars.kro.kr/api/setuseravatar): 유저 아바타 생성

요청

```javascript
{
    user_name: "관리자1",    //유저 닉네임
    type: "cat",    //아바타 타입(cat, monkey)
    look: "식별하는무언가", //표정
    color: "식별하는무언가2",   //색상

    /* 프론트에서 유저가 선택한 표정이랑 색상정보를 식별할수 있는 값으로 저장 해야함 */
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임이 DB에 존재하지 않음

#### [/setuserfititem](http://dmumars.kro.kr/api/setuserfititem): 유저 장착한 아이템 변경

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    moun_shop: 1 또는 null,   //장착한 상점 아이템id

    /* 장착을 취소한 경우엔 null로 */
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 아이템id 가 존재하지 않음

#### [/setuserinventory](http://dmumars.kro.kr/api/setuserinventory): 유저 인벤토리 아이템 추가

> 유저가 아이템을 구매한 경우 사용

요청

```javascript
{
    user_name: "관리자1",   //닉네임
    object_id: 1    // 아이템id
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 아이템id 가 존재하지 않음<br>
-   `{err: "ER_DUP_ENTRY"}`: 이미 구매한 아이템임
</details>
</dd>

<dd>
<details>
<summary>리소스 업/다운로드</summary>

#### [/getshopitemimg/[아이템id]](http://dmumars.kro.kr/api/getshopitemimg/1): 해당 상점 아이템 미리보기 이미지 불러오기 (GET)

> 리소스 불러오는 부분은 MainMypageFragment의 96라인 참고

정상응답 (code: 200)

```
해당 아이템id에 미리보기 이미지
아이템id 얻는건 /getshopitemid 으로
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 아이템id 가 DB에 존재하지 않음

#### [/getshopitemasset/[아이템id]](http://dmumars.kro.kr/api/getshopitemasset/1): 해당 상점 아이템 에셋파일 불러오기 (GET)

> 유니티 에셋을 불러올 수 있어야함

정상응답 (code: 200)

```
해당 아이템id에 유니티 에셋파일
아직 미완성
```

오류응답 (code: 500)

-   `{err: "empty"}`: 해당 아이템id 가 DB에 존재하지 않음
</details>
</dd>

VR 문제 부분

<dd>
<details>
<summary>GET 요청</summary>

#### [/vr/getallexam/[목표명]](http://dmumars.kro.kr/api/vr/getallexam/프로그래밍): 해당 목표에 모든 문제들 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        //목표명 = 프로그래밍
        {
            exam_id: 1, //문제 id
            skill_field: "html", //타겟스킬
            exam: "HTML에서 외부 링크를 생성하는 태그는 무엇인가요?", //문제명
            correct: "<a>", //정답
            exam_type: "stand", //문제타입 (4지선다=stand, ox=ox)
            rate: 50, //정답률
            exam_option: ["<a>", "<href>", "<link>", "<src>"], //문제 선지들
        },
        /* 이하 생략 */
    ];

    // results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
}
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 목표가 DB에 존재하지 않음

#### [/vr/getallexam/[목표명]/[문제타입]](http://dmumars.kro.kr/api/vr/getallexam/프로그래밍/stand): 해당 목표와 문제타입에 대한 랜덤 문제 리턴

> 문제타입: 4지선다="stand" ox문제="ox"로 표기

정상응답 (code: 200)

```javascript
// 목표 = 프로그래밍, 문제타입 = stand
{
    exam_id: 17, //문재 id
    skill_field: "js",  //스킬명
    exam: "JavaScript에서 함수를 정의하는 키워드는 무엇인가요?",  //문제명
    correct: "function", //정답
    rate: 0,    //정답룰
    exam_option: ["define","func","function","method"]  //문제 선지들
}
//요청할때 마다 문제가 바뀜
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 목표 또는 스킬이 DB에 존재하지 않음

#### [/vr/userexam/[닉네임]](http://dmumars.kro.kr/api/vr/userexam/관리자1): 사용자가 푼 문제 리턴

정상응답 (code: 200)

```javascript
{
    results: [
        {
            exam: "문제1",  //문제이름
            is_correct: 100 //맞춘여부 (100 이면 맞은거, 0 이면 틀린거)
        }
    ],

    // results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
}
```

오류응답 (code: 500)

-   `{ err: "empty" }`: 해당 닉네임이 DB에 존재하지 않음
</details>
</dd>

<dd>
<details>
<summary>POST 요청</summary>

#### [/vr/iscorrect](http://dmumars.kro.kr/api/vr/iscorrect): 사용자 정답 여부 (유저가 답을 입력한경우 요청바람)

요청

```javascript
{
    user_name: "관리자1",   // 닉네임
    exam_id: 1, // 문제 id
    iscorrect: 100  // 맞춘경우 100으로, 틀린경우 0으로 설정 바람
}
```

정상응답 (code: 200)

```javascript
{
    results: true;
}
// 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
```

오류응답 (code: 500)

-   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
-   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 문제 id가 DB에 존재하지 않음
</details>
</dd>
</dl>

### 안드로이드 스튜디오에서 사용

#### HTTP 설정

안드로이드는 기본적으로 HTTP 통신이 막혀있어 허용을 해줘야 합니다.

1. `AndroidManifest.xml` 에서 manifest 항목 안에 해당 구문을 추가합니다<br>

    ```xml
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools">
    <!-- 기존내용 -->

    <!-- 추가 -->
    <uses-permission android:name="android.permission.INTERNET" />
    ```

2. `AndroidManifest.xml` 에서 application 항목 끝에 해당 구문을 추가합니다
    ```xml
    <application
        ...생략...
        android:usesCleartextTraffic="true">
    ```

#### 메인 쓰레드 문제

액티비티가 작동중인 쓰레드에서 웹 요청 같은 작업을 하면 오류가 납니다. 따라서 쓰레드를 분리 후 작업해야 합니다.

-   새로운 쓰레드 생성 예

    ```Kotlin
    Thread {
        //GET, POST 요청 작업들
    }.start();
    ```

## 예제코드

### `Kotlin`

<b>[해당 텍스트](https://github.com/MARS-19th/mars_backend_api/blob/main/example/src/main/java/seok/Request.kt) 를 눌러 전체 소스코드를 다운받아 안드로이드 프로젝트에서 바로 쓸 수 있습니다.</b>

-   #### GET 요청
    https://github.com/MARS-19th/mars_backend_api/blob/5f12fcdafcad3af66ebddfa39015c13deabed876/example/src/main/java/seok/Request.kt#L16-L34

메인함수

```Kotlin
fun main() {
    try {
        val jsonObject = Request().reqget("http://dmumars.kro.kr/api/getdetailmark/css/1") //get요청
        println(jsonObject.getJSONArray("results").getJSONObject(0).getInt("mark_id"))
        // /getdetailmark 부분 파싱 results에서 JSONArray 뽑고 JSONArray[0] 에 mark_id = 3
    } catch (e: UnknownServiceException) {
        // API 사용법에 나와있는 모든 오류응답은 여기서 처리
        println(e.message)
        // 이미 reqget() 메소드에서 파싱 했기에 json 형태가 아닌 value 만 저장 된 상태 만약 {err: "type_err"} 인데 e.getMessage() 는 type_err만 반환
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

-   #### POST 요청
    https://github.com/MARS-19th/mars_backend_api/blob/5f12fcdafcad3af66ebddfa39015c13deabed876/example/src/main/java/seok/Request.kt#L37-L71

메인함수

```Kotlin
fun main(args: Array<String>) {
    try {
        val outputjson = JSONObject() //json 생성
        outputjson.put("user_name", "관리자1")
        outputjson.put("look", 1) //int 데이터
        outputjson.put("color", 2)
        //  outputjson.put("color", JSONObject.NULL); 값의 null이 들어가능 경우 JSONObject.NULL 로 입력
        /*
        해당 구문을 통해 json 형태의 요청 텍스트를 만듬
        {id: "id", look: 1, color: 2} 이런식으로 만들어짐
         */

        val jsonObject = Request().reqpost("http://dmumars.kro.kr/api/setuseravatar", outputjson)
        // jsonObject 변수에는 정상응답 json 객체가 저장되어있음

        println(jsonObject.getString("results")) //results 데이터가 ture만 나오는 경우 굳이 처리 해줄 필요 없은
        // getter는 자료형 별로 getint getJSONArray 이런것들이 있으니 결과 값에 따라 메소드를 변경해서 쓸것
    } catch (e: UnknownServiceException) {
        // API 사용법에 나와있는 모든 오류응답은 여기서 처리

        if (e.message == "ER_DUP_ENTRY ") { /* 중복오류 발생 예외처리구문 */
        }
        println(e.message)
        // 이미 reqget() 메소드에서 파싱 했기에 json 형태가 아닌 value 만 저장 된 상태 만약 {err: "type_err"} 인데 e.getMessage() 는 type_err만 반환
    } catch (e: Exception) {
        e.printStackTrace()
    }
}
```

-   #### 파일 업로드
    https://github.com/MARS-19th/mars_backend_api/blob/1d93835b6897db0f29351a974dac317e8b8a0848/example/src/main/java/seok/Request.kt#L74-L134

안드로이드 이미지 파일 업로드 예제

```Kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // 이미지 선택 Intent 실행
        val intent = Intent(Intent.ACTION_PICK)
        intent.type = "image/*"
        launcher.launch(intent)
    }

    // 이미지 선택 후 콜백 메소드
    val launcher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
        if (it.resultCode == RESULT_OK) {
            Thread {
                // 파일 uri 값 얻기
                val data = it.data?.data!!

                // 파일 이름 얻기
                val filename =  getFilename(data, activity?.applicationContext!!)

                // 가져온 파일을 inputStream으로 리턴
                val fileInputStream = activity?.contentResolver?.openInputStream(data)!!

                // json 생성
                val json =  JSONObject()
                json.put("user_name", "관리자1")

                // 파일 보내기
                Request().fileupload("http://dmumars.kro.kr/api/uploadprofile", json, filename, fileInputStream)
            }.start()
        }
    }

    // 파일 이름 얻기
    private fun absolutelyPath(path: Uri?, context : Context): String {
        val c = context.contentResolver.query(path!!, null, null, null, null)
        val index = c?.getColumnIndexOrThrow(OpenableColumns.DISPLAY_NAME)
        c?.moveToFirst()
        val result = c?.getString(index!!)
        c?.close()

        return result!!
    }
}
```

## 관리자 페이지

-   [`http://dmumars.kro.kr/admin`](http://dmumars.kro.kr/admin)
    > 관리자 암호는 따로 물어봐 주세요

## 빌드 및 테스트

> DB 주소와 로그인은 따로 물어봐 주세요

빌드 전 먼저 `dmumars.kro.kr` 도메인을 할당 받고

Nginx를 사용할 경우 적절한 IP로 리버스 프록시 등록 필요 합니다.

`server.json` 에 `sshtunnel.privateKeyPath` 부분은 `dbssh/dbssh.pem` 로 고정합니다

### Docker 사용

1. 서버의 SSH 키와 `server.json`의 원문을 준비

2. 리포지토리를 Clone 받고 해당 위치로 이동

3. 이미지 빌드

    ```bash
    docker buildx build --load -t grow-verse . && \
    docker buildx prune -f --all; \
    docker rm -fbuildx_buildkit_multi-arch-builder0; \
    docker rmi moby/buildkit:buildx-stable-1
    ```

4. 컨테이너 시작

    ```bash
    docker run -it \
    -e SERVER_JSON="$(cat <server.json 파일 위치>)" \
    -e DB_SSH="$(cat <서버 SSH 파일 위치>)" \
    -d --name grow-verse grow-verse
    ```

5. 로그보기

    ```bash
    docker logs -f -n 100 grow-verse
    ```

### 로컬에서 직접 사용

#### 공통 작업

1. [Node.js 와 npm 을 설치합니다.](https://nodejs.org/ko/download)

2. 해당 리포지토리를 복제 합니다 `git clone https://github.com/MARS-19th/mars_backend_api.git`

3. clone된 디렉토리로 이동한 뒤 `src` 폴더의 `server.json` 을 수정합니다.

4. `src/dbssh/`폴더에 서버 SSH키를 `dbssh.pem` 으로 이름을 바꾸어 복사합니다.

#### 리눅스 환경

1. 최상위 디렉토리로 이동한 뒤 `$chmod +x start.sh` 를 입력합니다.
2. `./start.sh`를 입력하여 서버를 실행합니다.

#### 윈도우 환경

1. 최상위 디렉토리로 이동한 뒤 커멘트 창을 열고, `npm run build` 와 `npm run start`를 차례대로 입력합니다.

## 개발 환경

### DB

-   `Mariadb 10.6.14` (AWS-RDS)
-   ER 다이어그램(DB 구조): https://www.erdcloud.com/d/DTJM4Xsnybqyun7vd

### 개발 언어

-   `Typescript`
-   `Node.js`
-   `Express.js`
