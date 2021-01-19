using Common;
using System.Collections.Generic;

namespace DAO.Basic
{
    public class Supplier : Person
    {
        public int SupplierID { get; set; }
        public string SupCode { get; set; }
        public string Website { get; set; }
        public string Extension { get; set; }
        public string HomeNo { get; set; }
        public string MailStop { get; set; }
        public string Notes { get; set; }
        public string ContPerName { get; set; }
        public string ContPerPhone { get; set; }
        public string ContPerFax { get; set; }
        public string ContPerMobile { get; set; }
        public string ContPerEmail { get; set; }
        public string ContPerExtension { get; set; }
    }
    public class WrapperSupplier
    {
        public List<Supplier> list { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public List<ComboData> listComboData { get; set; }
    }
}
