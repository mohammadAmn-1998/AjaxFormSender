using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace Ajax_Api_Controller.WebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemoController : ControllerBase
    {
        // 1️⃣ Receive JSON data
        [HttpPost("json")]
        public IActionResult PostJson([FromBody] RegisterDto dto)
        {
            // Returns the received data along with method info
            return Ok(new
            {
                Method = "POST-JSON",
                Data = dto
            });
        }

        // 2️⃣ Receive FormData (with file)
        [HttpPost("form")]
        public IActionResult PostForm([FromForm] RegisterFormDto dto)
        {
            // Returns data, file name and file length if uploaded
            return Ok(new
            {
                Method = "POST-FormData",
                Data = dto,
                FileName = dto.FileValue?.FileName,
                FileLength = dto.FileValue?.Length
            });
        }

        // 3️⃣ Receive x-www-form-urlencoded
        [HttpPost("simple")]
        public IActionResult PostSimple([FromForm] RegisterDto dto)
        {
            // Classic form POST
            return Ok(new
            {
                Method = "POST-x-www-form-urlencoded",
                Data = dto
            });
        }

        // 4️⃣ Receive data via QueryString (GET)
        [HttpGet("query")]
        public IActionResult GetQuery([FromQuery(Name = "input_number")] int numberValue,
                                      [FromQuery(Name = "input_string")] string textValue)
        {
            // GET request using query parameters
            return Ok(new
            {
                Method = "GET-QueryString",
                NumberValue = numberValue,
                TextValue = textValue
            });
        }
    }

    // Base DTO (without file)
    public class RegisterDto
    {
        // The text input value (form name: input_string)
        [JsonPropertyName("input_string")]
        [FromForm(Name = "input_string")]
        public string TextValue { get; set; }

        // The numeric input value (form name: input_number)
        [JsonPropertyName("input_number")]
        [FromForm(Name = "input_number")]
        public int NumberValue { get; set; }

        // Gender selection (form name: gender)
        [JsonPropertyName("gender")]
        [FromForm(Name = "gender")]
        public string Gender { get; set; }
    }

    // DTO for forms with file
    public class RegisterFormDto : RegisterDto
    {
        // File input (form name: input_file)
        [FromForm(Name = "input_file")]
        public IFormFile FileValue { get; set; }
    }
}
