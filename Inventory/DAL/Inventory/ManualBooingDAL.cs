using Common;
using DAO.Inventory;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Inventory
{
  public class ManualBooingDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private WrapperManualBooing _objWrapper = new WrapperManualBooing();
        private WrapperDispatch _objWrapperDes = new WrapperDispatch();
        private DataTable _dt = new DataTable();
        private ManualBooing _obj = new ManualBooing();
        string error = string.Empty;
        List<ComboData> lstComboData = new List<ComboData>();

        public WrapperAutoComplete GetCustomerAutoComplete(ManualBooing obj)
        {
            WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetItemHeadAutoComplete", obj);
                _objWrapperauto = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }

        public WrapperAutoComplete GetInialAutoComplete(ManualBooing obj)
        {
            WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
            _dt = new DataTable();
            try
            {
                // obj = new SalesDAO();
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParameter("GetInialAutoComplete", obj);
                _objWrapperauto = setWrapper_auto(_dt);
            }
            catch (Exception ex)
            {
                _objWrapperauto.Error = ex.Message;
            }
            return _objWrapperauto;
        }
        private WrapperAutoComplete setWrapper_auto(DataTable _dt)
        {
            WrapperAutoComplete _objWrapper = new WrapperAutoComplete();
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.ListAutoCpomplete = _dt.DataTableToList<AutoComplete>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperManualBooing LoadDeliveryMethod()
        {
            _obj = new ManualBooing();
            _obj.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadDeliveryMethod", _obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listComboData = _dt.DataTableToList<ComboData>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;

        }

        private DataTable getDataByParameter(string operationName, ManualBooing obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SearchText", string.IsNullOrEmpty(obj.SearchText) ? SqlString.Null : obj.SearchText));
            _sqlParameterList.Add(new SqlParameter("@ReferenceNo", string.IsNullOrEmpty(obj.ReferenceNo) ? SqlString.Null : obj.ReferenceNo));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(obj.InvoiceNo) ? SqlString.Null : obj.InvoiceNo));
            _dt = _accessManager.GetDataByDataTable("usp_LoadManualBooing", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperManualBooing Save(ManualBooing obj, List<ManualBooingDetails> lstOfChildData)
        {
            WrapperManualBooing _objWrapper = new WrapperManualBooing();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                var _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@CustomerName",  obj.CustomerName),
                    new SqlParameter("@InvoiceNo",  string.IsNullOrEmpty(obj.InvoiceNo) ? "" : obj.InvoiceNo),
                    new SqlParameter("@InvoiceDate", obj.InvoiceDate),
                    new SqlParameter("@BookingType", obj.BookingType),
                    new SqlParameter("@SpecilaConstruction", string.IsNullOrEmpty(obj.SpecialInstruction) ? SqlString.Null : obj.SpecialInstruction),
                    new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes),
                    new SqlParameter("@DespatchViaId",  obj.DespatchViaId),
                    new SqlParameter("@DespatchMethodId",  obj.DespatchMethodId),
                    new SqlParameter("@ReferenceNo", string.IsNullOrEmpty(obj.ReferenceNo) ? SqlString.Null : obj.ReferenceNo),
                    new SqlParameter("@CustomerAddress",  obj.CustomerAddress),
                    new SqlParameter("@MobileNo", obj.MobileNo),
                    new SqlParameter("@City", obj.City),
                    new SqlParameter("@PostalCode", obj.PostalCode),
                    new SqlParameter("@CreateBy", obj.CreatedBy)

                    //@PaymentTermsText
            };
                _dt = _accessManager.GetDataByDataTable("usp_InsertManualBookingMaster", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                string MBookingId = _dt.Rows[0]["MBookingId"].ToString();

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
                    new SqlParameter("@MBookingId", MBookingId),
                    new SqlParameter("@IHeadId", item.IHeadId == null ? SqlInt32.Null : item.IHeadId),
                    new SqlParameter("@ItemCode", item.ItemCode),
                    new SqlParameter("@SaleQty", item.SaleQty == 0 ? SqlInt32.Null : item.SaleQty),
                    new SqlParameter("@Box", item.Box == 0 ? SqlInt32.Null : item.Box),
                    new SqlParameter("@ItemDescription", item.IHeadDescription == null ? SqlString.Null : item.IHeadDescription),
                    new SqlParameter("@TrakingNo", item.TrakingNo == null ? SqlString.Null : item.TrakingNo),
                    new SqlParameter("@RequiredDate", item.RequiredDate == null ? SqlString.Null : item.RequiredDate),
                    new SqlParameter("@DeliveryDate", item.DeliveryDate == null ? SqlString.Null : item.DeliveryDate),
                    new SqlParameter("@DeliveryCost", item.DeliveryCost == 0 ? SqlDecimal.Null : item.DeliveryCost),
                    new SqlParameter("@SalePoint", item.SalePoint == null ? SqlString.Null : item.SalePoint),
                    new SqlParameter("@CreateBy", item.CreatedBy)
                };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_InsertManualBookingDetails", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        _objWrapper.Error = error;
                        return _objWrapper;
                    }
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            _objWrapper.list = _dt.DataTableToList<ManualBooingDetails>();
            return _objWrapper;
        }

        public WrapperDispatch GetManualBookRegisterData()
        {
            _obj = new ManualBooing();
            _obj.CreatedBy = UserSession.getUserName();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(_obj.BookingDate) ? SqlString.Null : _obj.BookingDate));
                _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(_obj.InvoiceDate) ? SqlString.Null : _obj.InvoiceDate));
                _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(_obj.InvoiceNo) ? SqlString.Null : _obj.InvoiceNo));
                _dt = _accessManager.GetDataByDataTable("usp_ManualBookRegisterData", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapperDes.list = _dt.DataTableToList<ItemDispatch>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapperDes;

        }

        public WrapperManualBooing GetSalesDataByInvNo(string inv)
        {
            ManualBooing obj = new ManualBooing();
            ManualBooing _obj = new ManualBooing();
            _dt = new DataTable();
            DataTable _dt1 = new DataTable();
            try
            {
                obj.InvoiceNo = inv;
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParam("GetBookingMasterDataByInvoice", obj);
                _objWrapper.masterList = _dt.DataTableToList<ManualBooing>().ToList();
                _obj.InvoiceNo = inv;
                _obj.CreatedBy = UserSession.getUserName();
                _dt1 = getDataByParam("GetBookingDetailDataByInvoice", _obj);
                _objWrapper.list = _dt1.DataTableToList<ManualBooingDetails>().ToList();
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private DataTable getDataByParam(string operationName, ManualBooing obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(obj.InvoiceNo) ? SqlString.Null : obj.InvoiceNo));
            _dt = _accessManager.GetDataByDataTable("usp_LoadManualBooingEditData", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
    }
}
