package com.example.myapplication2

import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.UnknownServiceException

class Postrequest {
    @Throws(UnknownServiceException::class, IOException::class, JSONException::class)
    fun reqpost(url: String?, outputjson: JSONObject): JSONObject {
        val link = URL(url)
        val huc = link.openConnection() as HttpURLConnection
        // http 연결 부분

        huc.requestMethod = "POST" // 요청 메소드 (get/post)
        huc.setRequestProperty("Content-Type", "application/json") // 전송 타입
        huc.setRequestProperty("Accept", " application/json") // 받을 타입
        huc.doOutput = true // 데이터를 보낼껀지 설정

        val output = huc.outputStream
        output.write(outputjson.toString().toByteArray(charset("utf-8"))) // 데이터 보내기
        output.flush() // 바이트 초기화

        return if (huc.responseCode == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            println("정상적으로 동작함")
            val json = BufferedReader(InputStreamReader(huc.inputStream, "utf-8")).readLine() //json 파일 읽기
            JSONObject(json) // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            val json = BufferedReader(InputStreamReader(huc.errorStream, "utf-8")).readLine() //json 파일 읽기
            val jo = JSONObject(json)
            val err = jo.getString("err") // 모든 오류는 err 이라는 json을 가짐

            if (err == "type_err") {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                println("타입 오류, 올바른 타입:" + jo.getJSONObject("type")) // optJSONObject 해당하는 객체가 또다른 객체를 가지고 있을때
                throw UnknownServiceException(err)
            } else {
                throw UnknownServiceException(err)
            }
        }
    }

    fun main(args: Array<String>) {
        try {
            val outputjson = JSONObject() //json 생성
            outputjson.put("user_name", "관리자1")
            outputjson.put("look", 1) //int 데이터
            outputjson.put("color", 2)
            //  outputjson.put("color", "null"); 값의 null이 들어가능 경우 문자열 "null로"
            /*
            해당 구문을 통해 json 형태의 요청 텍스트를 만듬
            {id: "id", look: 1, color: 2} 이런식으로 만들어짐
             */

            val jsonObject = reqpost("http://dmumars.kro.kr/api/avatar/setuseravatar", outputjson)
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
}
