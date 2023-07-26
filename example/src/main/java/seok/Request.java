package seok;

import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

import org.json.JSONObject;

public class Request {

    public JSONObject reqpost(String url, JSONObject outputjson) throws Exception {
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
            System.out.println("정상적으로 추가됨");
            byte by[] = huc.getInputStream().readAllBytes();
            return new JSONObject(new String(by, "utf-8")); // 정상 응답일 경우 리턴

        } else {
            // 비정상 응답
            byte by[] = huc.getErrorStream().readAllBytes();
            JSONObject jo = new JSONObject(new String(by, "utf-8"));
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐

            if (err.equals("type_err")) {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                System.out.println("타입 오류, 올바른 타입:" + jo.optJSONObject("type")); // optJSONObject 해당하는 객체가 또다른 객체를 가지고
                                                                                 // 있을때
                throw new Exception(err);
            } else {
                throw new Exception(err);
            }
        }
    }

    public JSONObject reqget(String url) throws Exception {
        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        if (huc.getResponseCode() == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            System.out.println("정상적으로 불러옴");
            byte by[] = huc.getInputStream().readAllBytes();
            return new JSONObject(new String(by, "utf-8")); // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            byte by[] = huc.getErrorStream().readAllBytes();
            JSONObject jo = new JSONObject(new String(by, "utf-8"));
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐

            throw new Exception(err);
        }
    }

    public JSONObject fileupload(String url, String file, JSONObject outputjson) throws Exception {
        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        String boundary = UUID.randomUUID().toString(); // 요청을 구분하기 위한 코드
        huc.setRequestMethod("POST");
        huc.setRequestProperty("Connection", "Keep-Alive");
        huc.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
        huc.setDoOutput(true);
        // 파일 전송을 위한 해더 설정

        DataOutputStream dos = new DataOutputStream(huc.getOutputStream()); // 해더작성을 하기위한 객체

        dos.writeBytes("--" + boundary + "\r\n");
        dos.writeBytes("Content-Disposition: form-data; name=\"file\";filename=\"" + file + "\"" + "\r\n");
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
        dos.writeBytes("Content-Disposition: form-data; name=\"data\"" + "\r\n");
        dos.writeBytes("Content-Type: application/json;charset=UTF-8" + "\r\n");
        dos.writeBytes("\r\n");
        dos.write(outputjson.toString().getBytes("utf-8"));

        dos.writeBytes("\r\n");
        dos.writeBytes("--" + boundary + "--" + "\r\n");
        dos.flush();
        dos.close();
        // 마지막 바운더리 추가

        if (huc.getResponseCode() == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            System.out.println("정상적으로 불러옴");
            byte by[] = huc.getInputStream().readAllBytes();
            return new JSONObject(new String(by, "utf-8")); // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            byte by[] = huc.getErrorStream().readAllBytes();
            JSONObject jo = new JSONObject(new String(by, "utf-8"));
            String err = jo.getString("err"); // 모든 오류는 err 이라는 json을 가짐

            if (err.equals("type_err")) {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                System.out.println("타입 오류, 올바른 타입:" + jo.optJSONObject("type")); // optJSONObject 해당하는 객체가 또다른 객체를 가지고
                                                                                 // 있을때
                throw new Exception(err);
            } else {
                throw new Exception(err);
            }
        }
    }

    public static void main(String[] args) {
/*         try {
            JSONObject outputjson = new JSONObject();
            outputjson.put("user_name", "관리자1");
            outputjson.put("element1", 1);
            outputjson.put("element2", 2);
            outputjson.put("element3", 3);
            outputjson.put("element4", "null"); // null 추가할 시
            // json 데이터 만들기

            JSONObject jsonObject = new Request().reqpost("http://korseok.kro.kr/api/avatar/setuseravatar",
                    outputjson);
            System.out.println(jsonObject.get("results")); // 정상 결과의 경우 results 라는 json 을

        } catch (Exception e) {
            System.out.println(e.getMessage());
            // ER_DUP_ENTRY = 중복오류
        } */

/*         try {
            JSONObject jsonObject = new Request().reqget("http://korseok.kro.kr/api/getmark");
            System.out.println(jsonObject.get("results"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            // empty = 항목 없음
        } */

/*         try {
            JSONObject outputjson = new JSONObject();
            outputjson.put("user_name", "관리자3");

            new Request().fileupload("http://korseok.kro.kr/api/uploadprofile", "tsconfig.json", outputjson);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } */

    }
}
