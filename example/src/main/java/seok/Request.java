package seok;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.UnknownServiceException;
import java.util.UUID;

import org.json.JSONException;
import org.json.JSONObject;

public class Request {
    public JSONObject reqget(String url) throws UnknownServiceException, IOException, JSONException {
        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        if (huc.getResponseCode() == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            System.out.println("정상적으로 동작함");
            String json = new BufferedReader(new InputStreamReader(huc.getInputStream(), "utf-8")).readLine();   //json 읽기
            return new JSONObject(json); // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            String json = new BufferedReader(new InputStreamReader(huc.getErrorStream(), "utf-8")).readLine();
            JSONObject jo = new JSONObject(json);   //json 읽기
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐
            throw new UnknownServiceException(err);
        }
    }

    public JSONObject reqpost(String url, JSONObject outputjson) throws UnknownServiceException, IOException, JSONException {
        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        huc.setRequestMethod("POST"); // 요청 메소드 (get/post)
        huc.setRequestProperty("Content-Type", "application/json"); // 전송 타입
        huc.setRequestProperty("Accept", " application/json"); // 받을 타입
        huc.setDoOutput(true); // 데이터를 보낼껀지 설정

        OutputStream is = huc.getOutputStream();
        is.write(outputjson.toString().getBytes("utf-8")); // 데이터 보내기
        is.flush(); // 바이트 초기화

        if (huc.getResponseCode() == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            System.out.println("정상적으로 동작함");
            String json = new BufferedReader(new InputStreamReader(huc.getInputStream(), "utf-8")).readLine();   //json 파일 읽기
            return new JSONObject(json); // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            String json = new BufferedReader(new InputStreamReader(huc.getErrorStream(), "utf-8")).readLine();   //json 파일 읽기
            JSONObject jo = new JSONObject(json);
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐

            if (err.equals("type_err")) {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                System.out.println("타입 오류, 올바른 타입:" + jo.getJSONObject("type"));
                throw new UnknownServiceException(err);
            } else {
                throw new UnknownServiceException(err);
            }
        }
    }

    public JSONObject fileupload(String url, JSONObject outputjson) throws IOException, FileNotFoundException, JSONException {
        if (outputjson.isNull("user_name") || outputjson.isNull("file")) {
            //값이 빠지지는 않았는지 유효성 검사
            throw new UnknownServiceException("less_data");
        }

        String file = outputjson.getString("file");
        String user_name = outputjson.getString("user_name");

        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        String boundary = UUID.randomUUID().toString(); // 요청을 구분하기 위한 코드
        huc.setRequestMethod("POST");
        huc.setRequestProperty("Connection", "Keep-Alive");
        huc.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        huc.setDoOutput(true);
        // 파일 전송을 위한 해더 설정

        DataOutputStream dos = new DataOutputStream(huc.getOutputStream()); // 해더작성을 하기위한 객체

        dos.writeBytes("--" + boundary + "\r\n");
        dos.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"" + file + "\"" + "\r\n");
        dos.writeBytes("\r\n");
        // 파일이 전송되는 부분

        FileInputStream fis = new FileInputStream(file);
        byte[] buffer = new byte[1024]; // 버퍼 크기설정
        int bytesRead;
        while ((bytesRead = fis.read(buffer)) != -1) {
            dos.write(buffer, 0, bytesRead);
        }
        fis.close();
        // 파일 내용 전송

        dos.writeBytes("\r\n");
        dos.writeBytes("--" + boundary + "\r\n");
        dos.writeBytes("Content-Disposition: form-data; name=\"user_name\"" + "\r\n");
        dos.writeBytes("Content-Type: Application/json; charset=UTF-8" + "\r\n");
        dos.writeBytes("\r\n");
        dos.write(user_name.getBytes("utf-8"));

        dos.writeBytes("\r\n");
        dos.writeBytes("--" + boundary + "--" + "\r\n");
        dos.flush();
        dos.close();
        // 마지막 바운더리 추가

        if (huc.getResponseCode() == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            System.out.println("정상적으로 업로드");
            String json = new BufferedReader(new InputStreamReader(huc.getInputStream(), "utf-8")).readLine();
            return new JSONObject(json); // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            String json = new BufferedReader(new InputStreamReader(huc.getErrorStream(), "utf-8")).readLine();   //json 읽기
            JSONObject jo = new JSONObject(json);
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐

            if (err.equals("type_err")) {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                System.out.println("타입 오류, 올바른 타입:" + jo.getJSONObject("type"));
                throw new UnknownServiceException(err);
            } else {
                throw new UnknownServiceException(err);
            }
        }
    }

    public static void main(String[] args) {
        Request rq = new Request();

        try {
            JSONObject jsonObject = rq.reqget("http://dmumars.kro.kr/api/getdetailmark/css/1");    //get요청
            System.out.println(jsonObject.getJSONArray("results").getJSONObject(0).getInt("mark_id"));
            // /getdetailmark 부분 파싱 results에서 JSONArray 뽑고 JSONArray[0]에 mark_id = 3
        } catch (Exception e) {
            // API 사용법에 나와있는 모든 오류응답은 여기서 처리
            System.out.println(e.getMessage());
            // 이미 reqget() 메소드에서 파싱 했기에 json 형태가 아닌 value 만 저장 된 상태 만약 {err: "type_err"} 인데 e.getMessage() 는 type_err만 반환
        }

        try {
            JSONObject outputjson = new JSONObject();   //json 생성
            outputjson.put("user_name", "관리자1");
            outputjson.put("type", "cat");
            outputjson.put("look", "식별하는무언가1");  //int 데이터
            outputjson.put("color", "식별하는무언가2");
            //  outputjson.put("color", JSONObject.NULL); 값의 null이 들어가능 경우 JSONObject.NULL 로 입력
            /*
            해당 구문을 통해 json 형태의 요청 텍스트를 만듬
            {id: "id", look: 1, color: 2} 이런식으로 만들어짐
             */

            JSONObject jsonObject = rq.reqpost("http://dmumars.kro.kr/api/setuseravatar", outputjson);
            // jsonObject 변수에는 정상응답 json 객체가 저장되어있음
            System.out.println(jsonObject.getString("results")); //results 데이터가 ture만 나오는 경우 굳이 처리 해줄 필요 없은
            // getter는 자료형 별로 getint getJSONArray 이런것들이 있으니 결과 값에 따라 메소드를 변경해서 쓸것

        } catch (UnknownServiceException e) {
            // API 사용법에 나와있는 모든 오류응답은 여기서 처리
            if (e.getMessage().equals("ER_DUP_ENTRY ")) { /* 중복오류 발생 예외처리구문 */}
            System.out.println(e.getMessage());
            // 이미 reqget() 메소드에서 파싱 했기에 json 형태가 아닌 value 만 저장 된 상태 만약 {err: "type_err"} 인데 e.getMessage() 는 type_err만 반환
        } catch (Exception e) {
            e.printStackTrace();
        }

/*         try {
            JSONObject outputjson = new JSONObject();
            outputjson.put("user_name", "관리자1");
            outputjson.put("file", "test.png");

            rq.fileupload("http://korseok.kro.kr/api/uploadprofile",  outputjson);
            // 사실상 응답 데이터가 {results: true} 밖에 없서서 데이터를 따로 저장하진 않음
        } catch (UnknownServiceException e) {
            // API 사용법에 나와있는 모든 오류응답은 여기서 처리
            String messge = e.getMessage(); // 해당 주소에서 발생가능한 애러 메세지 (api 사용법 참고)
            if (messge.equals("less_data")) {
                System.out.println("파일 업로드 중에 오류 발생");
            }
            System.out.println(messge);
        } catch (FileNotFoundException e) {
            //선택한 파일이 없어진 경우
            System.out.println("파일없음");
        } catch (Exception e) {
            e.printStackTrace();
        } */
    }
}
