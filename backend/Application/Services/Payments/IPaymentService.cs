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
        Task CreatePaymentAsync(PaymentDTOCreate paymentDTO);
        Task<PaymentDTORead> GetPaymentById(string id);
        Task<IEnumerable<PaymentDTORead>> GetAllPayments();
        Task<Payment> UpdatePaymentAsync(PaymentDTOUpdate paymentDTOUpdate);
    }
}
