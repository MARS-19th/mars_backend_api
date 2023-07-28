# mars 프로젝트 Restful API
-   앱에 필요한 요청/응답 처리를 위한 Node.js 기반 Restful API 입니다.

## API 사용법
요청 메인 URL: <code><b>http://dmumars.kro.kr/api</b></code>
API 목록을 참고하여 필요한 주소로 GET/POST 요청을 하면 됩니다.
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
    -   요청
    ```javascript
    {id: "id", passwd: "passwd"}
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    - 오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "ER_DUP_ENTRY"}`: 아이디가 중복되는 오류

    #### [/login](http://dmumars.kro.kr/api/login): 로그인
    -   요청
    ```javascript
    {id: "admin1", passwd: "admin"}
    ```

    -   정상응답 (code 200)
      
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

    - 오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "is_new"}`: 회원 가입만 해놓고 아무런 정보를 입력하지 않은 상태<br>
    `{err: "empty"}`: DB에서 해당 회원을 찾을 수 없음(아이디, 페스워드 입력오류)

    #### [/deluser](http://dmumars.kro.kr/api/deluser): 회원 탈퇴
    -   요청
    ```javascript
    {id: "id", passwd: "passwd"}
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    - 오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
</details>

유저데이터/목표 부분

-   <details>
    <summary>GET 요청</summary>

    #### [/getuserdata/[유저이름]](http://dmumars.kro.kr/api/getuserdata/관리자1): 해당 유저의 정보 리턴
    -   정상응답 (code: 200)
      
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

    - 오류응답 (code: 500)
      
    `{err: "empty"}`: 해당 유저를 찾을 수 없음

    #### [/getfriend/[유저이름]](http://dmumars.kro.kr/api/getfriend/관리자1): 해당 유저의 친구 목록 리턴
    -   정상응답 (code: 200)
      
    ```javascript
    {
        "results":["관리자2"]   //유저이름은 관리자1
        //results의 value는 jsonarray
    }
    ```

    - 오류응답 (code: 500)
      
    `{err: "empty"}`: 해당 유저를 찾을 수 없음
    #### [/getbtmac/[유저이름]](http://dmumars.kro.kr/api/getbtmac/관리자1): 해당 유저의 블루투스 mac 주소 리턴
    -   정상응답 (code: 200)
      
    ```javascript
    {
        "bt_mac":"bt_mac1" //유저이름은 관리자1
    }
    ```

    - 오류응답 (code: 500)
      
    `{err: "empty"}`: 해당 유저를 찾을 수 없음
</details>

-   <details>
    <summary>POST 요청</summary>

    #### [/setuser](http://dmumars.kro.kr/api/setuser): 유저 정보입력 (최종가입)
    -   요청
    ```javascript
    {
        user_name: "name",  //닉네임
        user_id: "id",  //아이디
        choice_mark: "프로그래밍",  //선택한 목표
        profile_local: "프사파일 이름" 또는 null //프사 설정 안할꺼면 null 로 설정
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    - 오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "ER_DUP_ENTRY"}`: 중복발생<br>
    `{err: "ER_NO_REFERENCED_ROW_2"}`: 설정하려는 id, 목표가 DB에 없음(외래키 문제)

    #### [/setmoney](http://dmumars.kro.kr/api/setmoney): 유저 재화 조정
    -   요청
    ```javascript
    {
        user_name: "관리자1",
        value: 1000 //int 형
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    { 
        results: 1000   //설정한 value 값
    }
    ```

    -   오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setlife](http://dmumars.kro.kr/api/setlife): 유저 목숨 조정
    -   요청
    ```javascript
    {
        user_name: "관리자1",
        value: 2    //int 형
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    { 
        results: 2   //설정한 value 값
    }
    ```

    -   오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setlevel](http://dmumars.kro.kr/api/setlevel): 유저 레벨 조정
    -   요청
    ```javascript
    {
        user_name: "관리자1",
        value: 1    //int 형
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    { 
        results: 1   //설정한 value 값
    }
    ```

    -   오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setusertitle](http://dmumars.kro.kr/api/setusertitle): 유저 칭호 변경
    -   요청
    ```javascript
    {
        user_name: "관리자1",
        value: "새싹"    //int 형
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    { 
        results: "새싹"   //설정한 value 값
    }
    ```

    -   오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "ER_NO_REFERENCED_ROW_2"}`: 설정하려는 칭호가 DB에 없음(외래키 문제)

    #### [/setname](http://dmumars.kro.kr/api/setname): 유저 이름 변경
    -   요청
    ```javascript
    {
        curname: "관리자1", //기존이름
        newname: "관리자3"  //바꿀이름
    }
    ```
    -   정상응답 (code: 200)
      
    ```javascript
        { 
            results: "관리자3"  //바꾼이름
        }
    ```

    오류응답 (code: 500)
    
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "exist"}`: 닉네임 중복 발생

    #### [/checkname](http://dmumars.kro.kr/api/checkname): 닉네임 중복 체크
    -   요청
    ```javascript
    {
        user_name: string //닉네임 
    }
    ```
    -   정상응답 (code: 200)
      
    ```javascript
    {
        results: true 또는 false
        // 중복이면 false 아니면 true
    }
    ```

    오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제

    #### [/setfriend](http://dmumars.kro.kr/api/setfriend): 친구추가
    -   요청
    ```javascript
    {
        user_name: "관리자1",   //친구추가 요청자 닉네임
        friend: "관리자2"  //친구 닉네임
    }
    ```

    -   정상응답 (code: 200)
      
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    -   오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제<br>
    `{err: "ER_DUP_ENTRY"}`: 이미 친구 상태임

    #### [/delfriend](http://dmumars.kro.kr/api/delfriend): 친구삭제
    -   요청
    ```javascript
    {
        user_name: string, // 친삭 요청지 닉네임
        friend: string  // 친구 닉네임
    }
    ```
    -   정상응답 (code: 200)
      
    ```javascript
    {results: true}
    // 정상응답 이라는 것을 나타내므로 http응답 코드로도 처리 할 수 있기에 따로 처리할 필요는 없음
    ```

    오류응답 (code: 500)
      
    `{err: "type_err"}`: 요청하는 json 타입이 일치하지 않아서 발생하는 문제
</details>

아바타 설정/상점 아이템 부분

-   <details>
    <summary>GET 요청</summary>

</details>

-   <details>
      <summary>POST 요청</summary>
    </details>
