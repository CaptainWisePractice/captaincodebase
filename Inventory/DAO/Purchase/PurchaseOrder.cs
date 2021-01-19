using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO.Purchase
{
   public class PurchaseOrder: PurchaseOrderDetails
    {
        public string POMasterId { get; set; }
        public string ManufacturerId { get; set; }
        public string ManufacturerName { get; set; }
        public string ImportOrLocal { get; set; }
        public string PONumber { get; set; }
        public string PINumber { get; set; }
        public string PODate { get; set; }
        public string Description { get; set; }
        public string PortOfLoading { get; set; }
        public string ProductionTime { get; set; }
        public string ProductionEndDate { get; set; }
        public string DateOfLoading { get; set; }
        public string OrderStatusId { get; set; }
        public string TotalAmount { get; set; }
        public string DepAmountUSD { get; set; }
        public string DepAmountAUD { get; set; }
        public string DepositDate { get; set; }
        public string DueDate { get; set; }
        public string ShipRateUSD { get; set; }
        public string ShipRateAUD { get; set; }
        public string TransitTimeETD { get; set; }
        public string TransitTimeETA { get; set; }
        public string FreeDays { get; set; }
        public string ContainerNumber { get; set; }
        public string PORecvStatus { get; set; }
        public string CurrencyId { get; set; }
        public string DocumentCompleted { get; set; }
        public string DocumentId { get; set; }
        public string CreatedBy { get; set; }

        public string ConversionRate { get; set; }
        public string TransitTime { get; set; }
        public string CFAgencyId { get; set; }
        public string CFAgencyRate { get; set; }

        public string ShipingAgentId { get; set; }
        public string BillofLading { get; set; }
        public string ETAWarehouse { get; set; }
        public string ProdPicId { get; set; }

        public string Box { get; set; }
        public string Notes { get; set; }
    }

    public class PurchaseOrderDetails
    {
        public string PODetailId { get; set; }
        public string IHeadId { get; set; }
        public string ItemHead { get; set; }
        public string Quantity { get; set; }
        public string UnitPrice { get; set; }
        public string TotalPrice { get; set; }
        public string Box { get; set; }
        public string CBM { get; set; }

    }

    public class WrapperPurchaseOrder
    {
        public List<PurchaseOrderDetails> listPurchaseOrderDets { get; set; }
        public List<PurchaseOrder> listPOMaster { get; set; }
        public List<ComboData> listComboData { get; set; }
        public List<List<PurchaseOrder>> listPO { get; set; }
        public string Error { get; set; }
        public string Save_error { get; set; }
        public string IsSessionOut { get; set; }
        public string _Result { get; set; }
        public string Id { get; set; }

    }
}
