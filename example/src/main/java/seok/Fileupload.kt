package com.example.myapplication2

import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.io.FileNotFoundException
import java.io.DataOutputStream
import java.io.FileInputStream
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.UnknownServiceException
import java.util.UUID

class Fileupload {
    @Throws(IOException::class, FileNotFoundException::class, JSONException::class)
    fun fileupload(url: String?, outputjson: JSONObject): JSONObject {
        if (outputjson.isNull("user_name") || outputjson.isNull("file")) {
            //값이 빠지지는 않았는지 유효성 검사
            throw UnknownServiceException("less_data")
        }

        val file = outputjson.getString("file")
        val user_name = outputjson.getString("user_name")

        val link = URL(url)
        val huc = link.openConnection() as HttpURLConnection
        // http 연결 부분

        val boundary = UUID.randomUUID().toString() // 요청을 구분하기 위한 코드
        huc.requestMethod = "POST"
        huc.setRequestProperty("Connection", "Keep-Alive")
        huc.setRequestProperty("Content-Type", "multipart/form-data; boundary=$boundary")
        huc.doOutput = true
        // 파일 전송을 위한 해더 설정

        val dos = DataOutputStream(huc.outputStream) // 해더작성을 하기위한 객체
        dos.writeBytes("--$boundary\r\n")
        dos.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"$file\"\r\n")
        dos.writeBytes("\r\n")

        // 파일이 전송되는 부분
        val fis = FileInputStream(file)
        val buffer = ByteArray(1024) // 버퍼 크기설정
        var bytesRead: Int

        while (fis.read(buffer).also { bytesRead = it } != -1) {
            dos.write(buffer, 0, bytesRead)
        }
        fis.close()

        dos.writeBytes("\r\n")
        dos.writeBytes("--$boundary\r\n")
        dos.writeBytes("""Content-Disposition: form-data; name="user_name"""".trimIndent())
        dos.writeBytes("""Content-Type: Application/json; charset=UTF-8""".trimIndent())
        dos.writeBytes("\r\n")
        dos.write(user_name.toByteArray(charset("utf-8")))
        //json 데이터 전송을 위한 부분

        dos.writeBytes("\r\n")
        dos.writeBytes("--$boundary--\r\n")
        dos.flush()
        dos.close()
        // 마지막 바운더리 추가

        return if (huc.responseCode == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            println("정상적으로 업로드")
            val json = BufferedReader(InputStreamReader(huc.inputStream, "utf-8")).readLine()
            JSONObject(json) // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            val json =
                BufferedReader(InputStreamReader(huc.errorStream, "utf-8")).readLine() //json 읽기
            val jo = JSONObject(json)
            val err = jo.getString("err") // 모든 오류는 err 이라는 json을 가짐

            if (err == "type_err") {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                println("타입 오류, 올바른 타입:" + jo.optJSONObject("type")) // optJSONObject 해당하는 객체가 또다른 객체를 가지고 있을때
                throw UnknownServiceException(err)
            } else {
                throw UnknownServiceException(err)
            }
        }
    }

    fun main() {
        try {
            val outputjson = JSONObject()
            outputjson.put("user_name", "관리자1")
            outputjson.put("file", "test.png")
            fileupload("http://korseok.kro.kr/api/uploadprofile", outputjson)
            // 사실상 응답 데이터가 {results: true} 밖에 없서서 데이터를 따로 저장하진 않음
        } catch (e: UnknownServiceException) {
            // API 사용법에 나와있는 모든 오류응답은 여기서 처리
            val messge = e.message // 해당 주소에서 발생가능한 애러 메세지 (api 사용법 참고)
            if (messge == "less_data") {
                println("파일 업로드 중에 오류 발생")
            }
            println(messge)
        } catch (e: FileNotFoundException) {
            //선택한 파일이 없어진 경우
            println("파일없음")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}