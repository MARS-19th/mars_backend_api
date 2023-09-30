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
    fun fileupload(url: String?, outputjson: JSONObject, file: File): JSONObject {
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
        dos.writeBytes("Content-Disposition: form-data; name=\"file\"; filename=\"${file.name}\"\r\n")
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
        dos.writeBytes("Content-Disposition: form-data; name=\"data\"\r\n")
        dos.writeBytes("Content-Type: Application/json; charset=UTF-8\r\n")
        dos.writeBytes("\r\n")
        dos.write(outputjson.toString().toByteArray(charset("utf-8")))
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
            val json = BufferedReader(InputStreamReader(huc.errorStream, "utf-8")).readLine() //json 읽기
            val jo = JSONObject(json)
            val err = jo.getString("err") // 모든 오류는 err 이라는 json을 가짐

            if (err == "type_err") {
                // 데이터 보낼시 json 타입이 안맞아 발생하는 오류
                println("타입 오류, 올바른 타입:" + jo.getJSONObject("type"))
                throw UnknownServiceException(err)
            } else {
                throw UnknownServiceException(err)
            }
        }
    }

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
                // 파일 경로 얻기
                val data = it.data?.data
                val file = absolutelyPath(data!!, this)

                val json =  JSONObject()
                json.put("user_name", "관리자1")

                // 파일 보내기
                Request().fileupload("http://dmumars.kro.kr/api/uploadprofile", json, File(file))
            }.start()
        }
    }

    // 절대경로로 파일 반환 함수
    private fun absolutelyPath(path: Uri?, context : Context): String {
        val proj: Array<String> = arrayOf(MediaStore.Images.Media.DATA)
        val c = context.contentResolver.query(path!!, proj, null, null, null)
        val index = c?.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
        c?.moveToFirst()
        val result = c?.getString(index!!)
        c?.close()

        return result!!
    }
}