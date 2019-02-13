using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace React_Onboarding_Project.Models
{
    public class SaleViewModel
    {
        public int Id { get; set; }
        public Nullable<int> ProductId { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public Nullable<int> StoreId { get; set; }
        public Nullable<System.DateTime> DataSold { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public string StoreName { get; set; }
    }
}