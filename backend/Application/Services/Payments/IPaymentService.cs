using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Payments;
using Domain.Payments;

namespace Application.Services.Payments
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentAsync(PaymentDTOCreate paymentDTO);
        Task<PaymentDTORead> GetPaymentByIdAsync(string id);
        Task<List<PaymentDTORead>> GetAllPaymentsAsync();
        Task<string> UpdatePaymentAsync(string id,PaymentDTOUpdate paymentDTOUpdate);
        Task<string> DeletePaymentAsync(string id);
    }
}
