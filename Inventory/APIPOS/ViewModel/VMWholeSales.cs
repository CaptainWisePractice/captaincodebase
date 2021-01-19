using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIPOS.ViewModel
{
    public class VMWholeSales
    {
        public string Customer { get; set; }       
        public string Order_No { get; set; }
        public string Added_By { get; set; }
        public string Added_Date { get; set; }
        public string Receiver_Name { get; set; }
        public string Delivery_Address { get; set; }        
        public string City { get; set; }
        public string Post_Code { get; set; }
        public string State { get; set; }
        public string Phone { get; set; }
        public string Item_Code { get; set; }
        public string Item_Name { get; set; }
        public string Quantity { get; set; }
        public string Unit_Price { get; set; }
        public string GST { get; set; }
        public string Shipping_Cost { get; set; }
        public string Total { get; set; }
        public string Invoice_Status { get; set; }
        public string Invoice_Number { get; set; }
        public string Payment_Option { get; set; }
        public string Payment_Status { get; set; }
        public string Delivery_Method { get; set; }
        public string Booking_Status { get; set; }
        public string Tracking_Number { get; set; }
        public string Despatch_Status { get; set; }
        public string Despatch_Date { get; set; }
        public string Actual_Freight { get; set; }
        public string Notify_Buyer { get; set; }
        public string Note { get; set; }
        
    }
}