﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum PaymentMethod
    {
        [Display(Name = "Cash")]
        OnSite,
        [Display(Name = "Card")]
        Online
    }
}
