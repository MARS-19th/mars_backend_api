import org.json.JSONException
import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.UnknownServiceException

class Getrequest {
    @Throws(UnknownServiceException::class, IOException::class, JSONException::class)
    fun reqget(url: String?): JSONObject {
        val link = URL(url)
        val huc = link.openConnection() as HttpURLConnection
        // http 연결 부분

        return if (huc.responseCode == HttpURLConnection.HTTP_OK) { // 맞는 응답인지 확인
            // 정상응답
            println("정상적으로 동작함")
            val json = BufferedReader(InputStreamReader(huc.inputStream, "utf-8")).readLine() //json 읽기
            JSONObject(json) // 정상 응답일 경우 리턴
        } else {
            // 비정상 응답
            val json = BufferedReader(InputStreamReader(huc.errorStream, "utf-8")).readLine()
            val jo = JSONObject(json) //json 읽기
            val err = jo.getString("err") // 모든 오류는 err 이라는 json을 가짐
            throw UnknownServiceException(err)
        }
    }

    fun main() {
        try {
            val jsonObject = reqget("http://dmumars.kro.kr/api/getdetailmark/css/1") //get요청
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
}