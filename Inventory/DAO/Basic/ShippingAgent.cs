using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Basic
{
   public class ShippingAgent : CommonModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string CountryId { get; set; }
        public string ContactNo { get; set; }
        public string ContactPerson { get; set; }
        public string Notes { get; set; }
    }

    public class WrapperShippingAgent
    {
        public List<ShippingAgent> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
