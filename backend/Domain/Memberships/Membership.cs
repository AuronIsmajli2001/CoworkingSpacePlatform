using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Memberships
{
   public class Membership
    {
        public int Id { get; set; }

        public string Title { get; set; }               // e.g., "Desk Plans"
        public string Price { get; set; }           // e.g., "€99-129 per month"
        public bool IncludesVAT { get; set; }           // true or false
        public string BillingType { get; set; }         // e.g., "Daily", "Monthly"

        public string Description { get; set; }         // Main services
        public string AdditionalServices { get; set; }  // Optional extras
    }

}