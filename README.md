# mars 프로젝트 Restful API
-   앱에 필요한 요청/응답 처리를 위한 Node.js 기반 Restful API 입니다.

## API 사용법
API 목록을 참고하여 필요한 주소로 GET/POST 요청을 하면 됩니다.

요청 메인 URL: <code><b>http://dmumars.kro.kr/api</b></code>
> 예시: /getuserdata = `http://dmumars.kro.kr/api/getuserdata`
* 관리자1 로그인 = `admin1, admin`
* 관리자2 로그인 = `admin2, admin`

### 주의사항
-   모든 요청/응답 처리는 `JSON` 으로 처리합니다. 따라서 `JSONobject` 및 `JSONarray` 의 사용법을 숙지하시기 바랍니다.
-   모든 오류응답은 `{err: 오류...}`로 반환 됩니다.
-   처리 해야하는 오류들만 정리하였으나, 필요하다면 [해당링크](https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html)에서 DB오류 코드를 참고하세요.

### (참고) POST 요청해더 예시
```javascript
method: "post",
headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
},
body: {
    [값을 보내려는 json]
},
```

### API 목록
회원가입/로그인 부분

-   <details>
      <summary>POST 요청</summary>

    #### [/setperson](http://dmumars.kro.kr/api/setperson): 처음 회원 가입시
    요청
    ```javascript
    {id: "id", passwd: "passwd"}
    ```

    정상응답 (code: 200)
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    -   `{err: "ER_DUP_ENTRY"}`: 아이디가 중복되는 오류

    #### [/login](http://dmumars.kro.kr/api/login): 로그인
    요청
    ```javascript
    {id: "admin1", passwd: "admin"}
    ```

    정상응답 (code 200)
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
    {id: "id", passwd: "passwd"}
    ```

    정상응답 (code: 200)
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
</details>

유저 데이터 부분

-   <details>
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
        "results":["관리자2"]   //유저이름은 관리자1
    }
    ```

    오류응답 (code: 500)  
    -   `{err: "empty"}`: 해당 유저를 찾을 수 없음

    #### [/getbtmac/[유저이름]](http://dmumars.kro.kr/api/getbtmac/관리자1): 해당 유저의 블루투스 mac 주소 리턴
    정상응답 (code: 200)
    ```javascript
    {
        "bt_mac":"bt_mac1" //유저이름은 관리자1
    }
    ```

    오류응답 (code: 500)  
    -   `{err: "empty"}`: 해당 유저를 찾을 수 없음
</details>

-   <details>
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
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)  
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    -   `{err: "ER_DUP_ENTRY"}`: 중복발생<br>
    -   `{err: "ER_NO_REFERENCED_ROW_2"}`: 설정하려는 id, 목표가 DB에 없음(외래키 문제)

    #### [/setmoney](http://dmumars.kro.kr/api/setmoney): 유저 재화 조정
    요청
    ```javascript
    {
        user_name: "관리자1",
        value: 1000
    }
    ```

    정상응답 (code: 200)
      
    ```javascript
    { 
        results: 1000   //설정한 value 값
    }
    ```

    오류응답 (code: 500)  
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setlife](http://dmumars.kro.kr/api/setlife): 유저 목숨 조정
    요청
    ```javascript
    {
        user_name: "관리자1",
        value: 2
    }
    ```

    정상응답 (code: 200)  
    ```javascript
    { 
        results: 2   //설정한 value 값
    }
    ```

    오류응답 (code: 500)
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setlevel](http://dmumars.kro.kr/api/setlevel): 유저 레벨 조정
    요청
    ```javascript
    {
        user_name: "관리자1",
        value: 1
    }
    ```

    정상응답 (code: 200)
    ```javascript
    { 
        results: 1   //설정한 value 값
    }
    ```

    오류응답 (code: 500)  
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setusertitle](http://dmumars.kro.kr/api/setusertitle): 유저 칭호 변경
    요청
    ```javascript
    {
        user_name: "관리자1",
        value: "새싹"
    }
    ```

    정상응답 (code: 200)
    ```javascript
    { 
        results: "새싹"   //설정한 value 값
    }
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
        results: "관리자3"  //바꾼이름
    }
    ```

    오류응답 (code: 500)
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    -   `{err: "exist"}`: 닉네임 중복 발생

    #### [/checkname](http://dmumars.kro.kr/api/checkname): 닉네임 중복 체크
    요청
    ```javascript
    {
        user_name: "닉네임" //닉네임 
    }
    ```

    정상응답 (code: 200)
    ```javascript
    {
        results: true 또는 false // 중복이면 false 아니면 true
    }
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
    {results: true}
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
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/uploadprofile](http://dmumars.kro.kr/api/uploadprofile): 프로필 사진 업로드
    > 파일 업로드 부분은 예제코드 참고, 파일은 [jpg, jpeg, png] 만 업로드 가능

    요청
    ```javascript
    {
        user_name: string, // 유저닉네임
    }
    ```

    정상응답 (code: 200)  
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)
    -   `{err: "file_upload_err"}`: 파일 업로드 과정에서 오류가 생김<br><br>
</details>

</details>

유저 목표 부분

-   <details>
    <summary>GET 요청</summary>

    #### [/getdetailmark/[스킬명]/[주차]](http://dmumars.kro.kr/api/getdetailmark/css/1): 세부 목표에 id 값과 세부목표를 리턴
    정상응답 (code: 200)
    ```javascript
    {"results":[{"mark_id":1,"mark_list":"css의 1주차 강의를 들으시오."}]}  //스킬명 = css , 레벨 = 1

    /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
    스킬명은 스킬트리에 적힌 스킬명 */
    ```

    오류응답 (code: 500)
    - `{ err: "empty" }`: 스킬명이나 해당 주차가 DB에 존재하지 않음

    #### [/getuserskill/[유저이름]](http://dmumars.kro.kr/api/getuserskill/관리자1): 해당 유저의 선택한 스킬트리를 리턴
    정상응답 (code: 200)
    ```javascript
    {"results":["css","html","java","python"]}  //선택한 스킬트리
    ```

    오류응답 (code: 500)
    - `{ err: "empty" }`: 해당 유저가 DB 에 존재하지 않음

    #### [/getusermark/[유저이름]/[스킬명]/[주차]](http://dmumars.kro.kr/api/getusermark/관리자1/css/1): 해당 유저의 선택한 스킬트리를 리턴
    정상응답 (code: 200)
    ```javascript
    {
        "results":
        [{
            "mark_id":3,    //목표 아이디
            "progress":100, //진행도
            "date":"2023-07-09T00:00:00.000Z"   //진행날짜
            
            /* results에 jsonarray가 있고 그 안에 jsonobject가 들어가있는 형태임 파싱시 주의
            목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것 */
        }]
    }
    ```

    오류응답 (code: 500)
    - `{ err: "empty" }`: 이름, 스킬명, 해당주차가 DB에 존재하지 않음

    #### [/getmoredata/[목표 아이디]](http://dmumars.kro.kr/api/getmoredata/1): 해당 세부목표에 추가 자료를 제공
    정상응답 (code: 200)
    ```javascript
    {
        "results":["https://www.youtube.com/watch?v=asasd", "https://www.youtube.com/watch?v=pkr48S22zH0"]

        /* 해당 세부목표에 유튜브 링크 같은 요소 제공 
        목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것 */
    }
    ```
    오류응답 (code: 500)
    - `{ err: "empty" }`: 해당 목표id 가 존재하지 않음
</details>

-   <details>
      <summary>POST 요청</summary>

    #### [/setuserskill](http://dmumars.kro.kr/api/setuserskill): 사용자 세부진행 목표 설정
    요청
    ```javascript
    {
        user_name: "관리자1",   //닉네임
        mark_id: 1, //목표아이디
        progress: 100,  //진행도

        //목표 아이디는 /getdetailmark 에서 값을 얻어 적절히 사용할것
    }
    ```

    정상응답 (code: 200)
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)  
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    -   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임 또는 목표아이디가 DB에 존재하지 않음

    </details>
</details>

아바타 설정/상점 아이템 부분

-   <details>
    <summary>GET 요청</summary>

    #### [/getuseravatar/[유저이름]](http://dmumars.kro.kr/api/getuseravatar/관리자1): 유저의 아바타 파일들 불러오기
    정상응답 (code: 200)
    ```javascript
    {
        look:"식별하는무언가1",   //표정
        color:"식별하는무언가2"   //색상
    }
    ```

    오류응답 (code: 500)
    - `{ err: "empty" }`: 해당 유저가 DB 에 존재하지 않음

</details>

-   <details>
      <summary>POST 요청</summary>

    #### [/setuseravatar](http://dmumars.kro.kr/api/setuseravatar): 유저 아바타 파일 저장
    요청
    ```javascript
    {
        user_name: "관리자1",
        look: "식별하는무언가", //표정
        color: "식별하는무언가2",   //색상

        /* 프론트에서 유저가 선택한 표정이랑 색상정보를 식별할수 있는 값으로 저장 해야함 */
    }
    ```

    정상응답 (code: 200)
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)  
    -   `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    -   `{err: "ER_NO_REFERENCED_ROW_2"}`: 닉네임이 DB에 존재하지 않음
    </details>

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

- 새로운 쓰레드 생성 예

    ```java
    Thread {
        //웹 요청 작업
    }.start();
    ```