using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Common;
using DAO;
using DAO.Basic;
using DAO.Sale;

namespace DAL.Sale
{
    public class SalesReturnDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperSales _objWrapper = new WrapperSales();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private DataTable _dt = new DataTable();
        private SalesDAO _obj = new SalesDAO();
        string error = string.Empty;
        List<ComboData> lstComboData = new List<ComboData>();
     
        private WrapperSales setWrapper(DataTable _dt)
        {
            _objWrapper = new WrapperSales();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.SalesList = _dt.DataTableToList<SalesDAO>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public List<Invoice> GetReturnInvoice(string invNo)
        {
            List<Invoice> _objInvoice = new List<Invoice>();
            SalesDAO obj = new SalesDAO();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                obj.InvoiceNo = invNo;
                _dt = getDataByParameter("GetReturnInvoiceNo", obj);

                if (_dt.Rows.Count > 0)
                {
                    _objInvoice = _dt.DataTableToList<Invoice>();
                }

                // _objAddress.CustomerAddresses = _dt.DataTableToList<CustomerAddress>();
            }
            catch (Exception ex)
            {

                return _objInvoice;
            }
            return _objInvoice;
        }

        public wrappersalesReturnObj Save(SalesDAO obj, List<SalesDetails> lstOfChildData)
        {
            wrappersalesReturnObj _invoice = new wrappersalesReturnObj();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                var _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@SalesType", obj.SalesType),//
                    new SqlParameter("@PaymentTearmsId", obj.PaymentTearmsId),
                    new SqlParameter("@CustomerName",  obj.CustomerName),
                    new SqlParameter("@CustomerId",  obj.CustomerId),
                    new SqlParameter("@isTaxInclusive",  obj.isTaxInclusive),
                    new SqlParameter("@InvoiceNo",  obj.InvoiceNo),
                    new SqlParameter("@InvoiceDate", obj.InvoiceDate),
                    new SqlParameter("@SalesPersonId",  obj.SalesPersonId),
                    new SqlParameter("@Comments", string.IsNullOrEmpty(obj.Comments) ? SqlString.Null : obj.Comments),
                    new SqlParameter("@ShipVia",  obj.ShipVia),
                 //   new SqlParameter("@DueDate",  obj.DueDate),
                    new SqlParameter("@SubTotal", obj.SubTotal),
                    new SqlParameter("@Freight", obj.Freight.ToString() == "" ? SqlDecimal.Null : obj.Freight),
                    new SqlParameter("@Tax", obj.Tax.ToString() == "" ? SqlDecimal.Null : obj.Tax),
                    new SqlParameter("@TotalAmount",  obj.TotalAmount),
                    new SqlParameter("@TaxType",  string.IsNullOrEmpty(obj.TaxType) ? SqlString.Null : obj.TaxType),
                    new SqlParameter("@JournalMemo", string.IsNullOrEmpty(obj.JournalMemo) ? SqlString.Null : obj.JournalMemo),
                    new SqlParameter("@ReferralSource", string.IsNullOrEmpty(obj.ReferralSource) ? SqlString.Null : obj.ReferralSource),
                    new SqlParameter("@DeliveryStatus", obj.DeliveryStatus),
                    new SqlParameter("@PaidToday", obj.PaidToday.ToString() == "" ? SqlDecimal.Null : obj.PaidToday),//@discount
                    new SqlParameter("@PaymentMethod", obj.PaymentMethod ),//@discount                  
                    new SqlParameter("@Due", obj.Due),
                    new SqlParameter("@CreateBy", obj.CreatedBy),
                    new SqlParameter("@PaymentTermsText", obj.PaymentTermsText),
                    new SqlParameter("@ReferenceNo", string.IsNullOrEmpty(obj.ReferenceNo) ? SqlString.Null : obj.ReferenceNo),
                    new SqlParameter("@SaleOutletId", obj.SaleOutletId),
                    new SqlParameter("@Name", obj.Name),
                    new SqlParameter("@Address",  obj.Address),
                    new SqlParameter("@MobileNo", obj.MobileNo),
                    new SqlParameter("@City", obj.City),
                    new SqlParameter("@State", obj.State),
                    new SqlParameter("@PrepaidDueDate", string.IsNullOrEmpty(obj.PrepaidDueDate) ? SqlString.Null : obj.PrepaidDueDate)
                    //@PaymentTermsText
            };
                _dt = _accessManager.GetDataByDataTable("usp_InsertSalesReturnMaster", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
        
                string SalesId = _dt.Rows[0]["salesId"].ToString();
                //_sqlParameterList = new List<SqlParameter>()
                //{
                //    new SqlParameter("@SalesId", Convert.ToInt32(SalesId))
                //};
             
                //_accessManager.ExecuteNonQueryByStoreProcedure("DeleteSalesDetailsDataBySalesId", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);

                foreach (var item in lstOfChildData)
                {
                    error = string.Empty;
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = new List<SqlParameter>()
                {
                         //SalesId
                   new SqlParameter("@SalesId", SalesId),
                   new SqlParameter("@IHeadId", item.IHeadId == 0 ? SqlInt32.Null : item.IHeadId),
                   new SqlParameter("@LocId", item.LocId == 0 ? SqlInt32.Null : item.LocId),
                   new SqlParameter("@SaleQty", item.SaleQty == 0 ? SqlInt32.Null : item.SaleQty),
                   new SqlParameter("@SalePrice", item.SalePrice == 0 ? SqlDecimal.Null : item.SalePrice),
                   new SqlParameter("@discount", item.discount == 0 ? SqlDecimal.Null : item.discount),
                   new SqlParameter("@ItemDescription", item.ItemDescription == null ? SqlString.Null : item.ItemDescription),
                   new SqlParameter("@CreateBy", item.CreatedBy),
                };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_insertSalesReturnDetails", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _invoice.Error = error;
                        return _invoice;
                    }
                }
            }
            catch (Exception ex)
            {
                _invoice.Error = ex.Message;
            }
            _invoice.lstsalesReturnObj = _dt.DataTableToList<salesReturnObj>();
            return _invoice;
        }
        private DataTable getDataByParameter(string operationName, SalesDAO obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(obj.InvoiceNo) ? SqlString.Null : obj.InvoiceNo));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SalesReturn", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public SalesEdit loadSaleDataInvoiceWise(string inv)
        {
            SalesDAO obj = new SalesDAO();

            SalesEdit objSaleEditData = new SalesEdit();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.InvoiceNo = inv;
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetMasterBySaleInvoiceNo", obj);
                var salesDaoMasterEdit = _dt.DataTableToList<SalesDaoMasterEdit>().FirstOrDefault();

                _dt = new DataTable();
                obj = new SalesDAO();
                obj.InvoiceNo = inv;
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetChildDataBySaleInvoiceNo", obj);
                var salesDaoChildEdit = _dt.DataTableToList<SalesDaoChildEdit>().ToList();

                objSaleEditData.SalesDaoMasterEdit = salesDaoMasterEdit;
                objSaleEditData.SalesDaoChildEdit = salesDaoChildEdit;
            }
            catch (Exception ex)
            {

            }
            return objSaleEditData;
        }

    }

}
