using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth
{
    public class ErrorResponseDTO
    {
        public string Message { get; set; }
        public ErrorResponseDTO(string message) => Message = message;
    }
}
