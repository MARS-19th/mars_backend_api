package seok;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

public class Request {

    public JSONObject reqpost(String url) throws Exception {
        URL link = new URL(url);
        HttpURLConnection huc = (HttpURLConnection) link.openConnection();
        // http 연결 부분

        JSONObject outjson = new JSONObject();
        outjson.put("id", "dada0713");
        outjson.put("passwd", "hyhy1503");
        // json 데이터 만들기

        huc.setRequestMethod("POST"); // 요청 메소드 (get/post)
        huc.setRequestProperty("Content-Type", "application/json"); // 전송 타입
        huc.setRequestProperty("Accept", " application/json"); // 받을 타입
        huc.setDoOutput(true); // 데이터를 보낼껀지 설정

        OutputStream is = huc.getOutputStream();
        is.write(outjson.toString().getBytes("utf-8")); // 데이터 보내기
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
                System.out.println("타입 오류, 올바른 타입:" + jo.optJSONObject("type"));   // optJSONObject 해당하는 객체가 또다른 객체를 가지고 있을때
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

    public static void main(String[] args) {
/*         try {
            JSONObject jsonObject = new Main().reqpost("http://korseok.kro.kr/api/setperson");
            System.out.println(jsonObject.get("results")); // 정상 결과의 경우 results 라는 json 을 가짐
        } catch (Exception e) {
            System.out.println(e.getMessage());
            // ER_DUP_ENTRY = 중복오류
        } */

        try {
            JSONObject jsonObject = new Request().reqget("http://korseok.kro.kr/api/getmark");
            System.out.println(jsonObject.get("results"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            //empty = 항목 없음
        }
    }
}
