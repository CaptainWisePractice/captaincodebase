using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Sale
{
    public class TakeCount: CommonModel
    {
        public DateTime ClosingDate { get; set; }
        public decimal ClosingEFTPOSAmt { get; set; }
        public decimal ClosingModEFTPOSAmt { get; set; }
        public decimal ClosingCashAmt { get; set; }
        public decimal ClosingModCashAmt { get; set; }
        public decimal ClosingChequeAmt { get; set; }
        public decimal ClosingModChequeAmt { get; set; }
        public decimal ClosingPaypalAmt { get; set; }
        public decimal ClosingModPaypalAmt { get; set; }
        public decimal ClosingTransferAmt { get; set; }
        public decimal ClosingModTransferAmt { get; set; }
        public decimal ClosingOtherAmt { get; set; }
        public decimal ClosingModOtherAmt { get; set; }
        public decimal ClosingAfterPayAmt { get; set; }
        public decimal ClosingModAfterPayAmt { get; set; }
        public decimal ClosingHummAmt { get; set; }
        public decimal ClosingModHummAmt { get; set; }
        public string Notes { get; set; }
        public int SaleOutletId { get; set; }
        public string Status { get; set; }
    }

    public class WrapperTakeCount
    {
        public List<TakeCount> SalesList { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<AutoComplete> ListAutoCompletes { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
    }
}
