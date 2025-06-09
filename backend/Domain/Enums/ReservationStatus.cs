using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum ReservationStatus
    {
        [Display(Name = "Confirmed")]
        Confirmed,
        [Display(Name = "Pending")]
        Pending,
        [Display(Name = "Cancelled")]
        Cancelled
    }
}
