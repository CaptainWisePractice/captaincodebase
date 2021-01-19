using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public abstract class CommonModel
    {
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
    public class ComboData
    {
        public string DisplayName { get; set; }
        public string label { get; set; }
        public Int32 Value { get; set; }
        public Int32 Value_New { get; set; }
        public Int32 Value_New2 { get; set; }
        public Int32 Value_New3 { get; set; }
        public string ValueStr { get; set; }
        public string ValueStr1 { get; set; }
        public string ValueStr2 { get; set; }
        public string ValueStr3 { get; set; }
        public string IsSelected { get; set; }
        public bool Sts { get; set; }

    }
    public class WrapperComboData
    {
        public List<ComboData> ldata { get; set; }
        public string Error { get; set; }
        public string IsSessionOut { get; set; }
    }
    public class AutoComplete
    {
        public int id { get; set; }
        public string label { get; set; }
        public string value { get; set; }
        public string Data { get; set; }
        public string value1 { get; set; }
        public string value2 { get; set; }
        public string value3 { get; set; }
    }
    public class WrapperAutoComplete
    {
        public List<AutoComplete> ListAutoCpomplete { get; set; }
        public string Error { get; set; }
        public string IsSessionOut { get; set; }
    }
    public class CommonParameter
    {
        public string operationName { get; set; }
        public int ReportParentId { get; set; }
        public string IHeadId { get; set; }
        public string SearchText { get; set; }
    }
    public class ListOfMenus
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string ControllerName { get; set; }
        public string ViewName { get; set; }
        public string PageURL { get; set; }
        public string IconClass { get; set; }
        public int ParantMenuId { get; set; }
        public bool IsActive { get; set; }
        public int Priority { get; set; }
    }
    public class HomePopupModal
    {
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public string InvoiceNo { get; set; }
        public string DespatchDate { get; set; }
        public string BalanceDue { get; set; }
        public string IHeadCode { get; set; }
        public int IHeadId { get; set; }
        public string Status { get; set; }
        public int SaleOutletId { get; set; }
        public string SaleOutlet { get; set; }
    }
    public class WrapperListOfMenus
    {
        public List<ListOfMenus> ListMenu { get; set; }
        public List<HomePopupModal> LstPreSale { get; set; }
        public List<HomePopupModal> LstLayby { get; set; }
        public string Error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
