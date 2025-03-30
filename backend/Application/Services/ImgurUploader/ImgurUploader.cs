using Newtonsoft.Json;
using Domain.ImgurModel;
using System.Text.Json;

namespace Application.Services.ImgurUploaderService
{
    public static class ImageUploaderService
    {
        public static string UploadPicture(string imagePath)
        {
            const string imgurApiKey = "YOUR_API_KEY";
            var imageUrl = UploadToImgur(imagePath, imgurApiKey).Result;
            return imageUrl;
        }

        public static async Task<string> UploadToImgur(string imagePath, string apiKey)
        {
            using (var client = new HttpClient())
            {
                var authHeaderValue = $"Client-ID {"887dd5688d9f063"}";
                client.DefaultRequestHeaders.Add("Authorization", authHeaderValue);

                byte[] imageData;
                using (FileStream fileStream = File.OpenRead(imagePath))
                {
                    imageData = new byte[fileStream.Length];
                    await fileStream.ReadAsync(imageData, 0, imageData.Length);
                }

                var content = new MultipartFormDataContent();
                content.Add(new ByteArrayContent(imageData), "image", "image.jpg");

                var response = await client.PostAsync("https://api.imgur.com/3/image", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                // Ensure the response content is not null or empty
                if (string.IsNullOrEmpty(responseContent))
                {
                    throw new NullReferenceException("Imgur API response is empty.");
                }

                // Attempt to deserialize the response
                Root responseModel;
                try
                {
                    responseModel = JsonConvert.DeserializeObject<Root>(responseContent);
                }
                catch (Newtonsoft.Json.JsonException ex)
                {
                    throw new InvalidOperationException("Failed to deserialize Imgur API response.", ex);
                }

                // Ensure the responseModel and its properties are not null
                if (responseModel == null)
                {
                    throw new NullReferenceException("Deserialized responseModel is null.");
                }
                if (responseModel.data == null)
                {
                    throw new NullReferenceException("Deserialized responseModel.data is null.");
                }
                if (responseModel.data.link == null)
                {
                    throw new NullReferenceException("Deserialized responseModel.data.link is null.");
                }

                return responseModel.data.link;
            }
        }
    }
}
