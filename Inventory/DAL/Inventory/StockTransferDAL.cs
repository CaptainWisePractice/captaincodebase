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
  public class StockTransferDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperAutoComplete _objWrapperauto = new WrapperAutoComplete();
        private WrapperStockTransfer _objWrapper = new WrapperStockTransfer();
        private WrapperDispatch _objWrapperDes = new WrapperDispatch();
        private DataTable _dt = new DataTable();
        private StockTransfer _obj = new StockTransfer();
        string error = string.Empty;
        List<ComboData> lstComboData = new List<ComboData>();

        public WrapperAutoComplete GetCustomerAutoComplete(StockTransfer obj)
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

        public WrapperAutoComplete GetInialAutoComplete(StockTransfer obj)
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

        public WrapperStockTransfer LoadDeliveryMethod()
        {
            _obj = new StockTransfer();
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

        public WrapperStockTransfer LoadUserPerson()
        {
            _obj = new StockTransfer();
            _obj.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadUserPerson", _obj);
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

        public WrapperStockTransfer LoadFromSite()
        {
            _obj = new StockTransfer();
            _obj.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadFromSite", _obj);
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
        public WrapperStockTransfer LoadToSite( int FromSiteId)
            {
                _obj = new StockTransfer();
                _obj.CreatedBy = UserSession.getUserName();
                _obj.FromSiteId = FromSiteId;
                try
                {
                    _dt = getDataByParameter("LoadToSite", _obj);
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

        public WrapperStockTransfer loadToSiteLocation(int SiteId)
        {
            _obj = new StockTransfer();
            _obj.CreatedBy = UserSession.getUserName();
            _obj.FromSiteId = SiteId;
            try
            {
                _dt = getDataByParameter("loadToSiteLocation", _obj);
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
        private DataTable getDataByParameter(string operationName, StockTransfer obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SearchText", string.IsNullOrEmpty(obj.SearchText) ? SqlString.Null : obj.SearchText));
            _sqlParameterList.Add(new SqlParameter("@FromSiteId", obj.FromSiteId == 0 ? SqlInt32.Null : obj.FromSiteId));
            _dt = _accessManager.GetDataByDataTable("usp_LoadStockTransfer", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperStockTransfer Save(StockTransfer obj, List<StockTransferDetails> lstOfChildData)
        {
            WrapperStockTransfer _objWrapper = new WrapperStockTransfer();
            _dt = new DataTable();
            try
            {
                obj.CreatedBy = UserSession.getUserName();
                var _sqlParameterList = new List<SqlParameter>()
                {
                    new SqlParameter("@StockTransferId", obj.StockTransferId),
                    new SqlParameter("@InvoiceNo",  string.IsNullOrEmpty(obj.InvoiceNo) ? "" : obj.InvoiceNo),
                    new SqlParameter("@InvoiceDate", obj.InvoiceDate),
                    new SqlParameter("@FromSiteId", obj.FromSiteId),
                    new SqlParameter("@ToSiteId", obj.ToSiteId),
                    new SqlParameter("@SpecilaConstruction", string.IsNullOrEmpty(obj.SpecialInstruction) ? SqlString.Null : obj.SpecialInstruction),
                    new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? SqlString.Null : obj.Notes),
                    new SqlParameter("@DespatchViaId",  obj.DespatchViaId),
                    new SqlParameter("@ReqSiteId",  obj.ReqSiteId),
                    new SqlParameter("@ReferenceNo", string.IsNullOrEmpty(obj.ReferenceNo) ? SqlString.Null : obj.ReferenceNo),
                    new SqlParameter("@LocNo",  obj.LocNo),
                    new SqlParameter("@PersonId", obj.PersonId),
                    new SqlParameter("@RequiredDate", obj.RequiredDate == null ? SqlString.Null : obj.RequiredDate),
                   // new SqlParameter("@DeliveryDate", obj.DeliveryDate == null ? SqlString.Null : obj.DeliveryDate),
                    new SqlParameter("@CreateBy", obj.CreatedBy)

                    //@PaymentTermsText
            };
                _dt = _accessManager.GetDataByDataTable("usp_InsertStockTransferMaster", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
                string StockTranId = _dt.Rows[0]["StockTranId"].ToString();

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
                    new SqlParameter("@StockTranId", StockTranId),
                    new SqlParameter("@STransferDetsId", item.STransferDetsId),
                    new SqlParameter("@IHeadId", item.IHeadId == null ? SqlInt32.Null : item.IHeadId),
                    new SqlParameter("@ItemCode", item.ItemCode),
                    new SqlParameter("@LocNo", obj.LocNo),
                    new SqlParameter("@InhandStock", item.InhandStock),
                    new SqlParameter("@SaleQty", item.SaleQty == 0 ? SqlInt32.Null : item.SaleQty),
                    new SqlParameter("@Box", item.Box == 0 ? SqlInt32.Null : item.Box),
                    new SqlParameter("@ItemDescription", item.IHeadDescription == null ? SqlString.Null : item.IHeadDescription),
                    new SqlParameter("@DeliveryCost", item.DeliveryCost == 0 ? SqlDecimal.Null : item.DeliveryCost),
                    new SqlParameter("@CreateBy", item.CreatedBy)
                };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_InsertStockTransferDetails", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
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
            _objWrapper.list = _dt.DataTableToList<StockTransferDetails>();
            return _objWrapper;
        }

        public WrapperDispatch GetStockTransferRegisterData(int IheadId, int FromSiteId, int ToSiteId, string fromDate, string toDate, string type)
        {
            _obj = new StockTransfer();
            _obj.CreatedBy = UserSession.getUserName();
            try
            {
                _sqlParameterList = new List<SqlParameter>();
                _sqlParameterList.Add(new SqlParameter("@IheadId", IheadId == 0 ? SqlInt32.Null : IheadId));
                _sqlParameterList.Add(new SqlParameter("@FromSiteId", FromSiteId == 0 ? SqlInt32.Null : FromSiteId));
                _sqlParameterList.Add(new SqlParameter("@ToSiteId", ToSiteId == 0 ? SqlInt32.Null : ToSiteId));
                _sqlParameterList.Add(new SqlParameter("@FromDate", string.IsNullOrEmpty(fromDate) ? SqlString.Null : fromDate));
                _sqlParameterList.Add(new SqlParameter("@ToDate", string.IsNullOrEmpty(toDate) ? SqlString.Null : toDate));
                _sqlParameterList.Add(new SqlParameter("@type", type));
                _dt = _accessManager.GetDataByDataTable("usp_StockTransferRegisterData", _sqlParameterList, DbName.Inventory, _obj.CreatedBy, out error);
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

        public List<ComboData> LoadTransferItem()
        {
            lstComboData = new List<ComboData>();
            _dt = _accessManager.GetDataByDataTable("usp_LoadTransferItem", DbName.Inventory, UserSession.getUserName(), out error);
            if (_dt.Rows.Count > 0)
            {
                lstComboData = _dt.DataTableToList<ComboData>();
            }
            return lstComboData;
        }

        public WrapperStockTransfer GetTranferDataByInvNo(string inv)
        {
            StockTransfer obj = new StockTransfer();
            StockTransfer _obj = new StockTransfer();
            _dt = new DataTable();
            DataTable _dt1 = new DataTable();
            try
            {
                obj.InvoiceNo = inv;
                obj.CreatedBy = UserSession.getUserName();
                _dt = getDataByParam("GetTransferMasterDataByInvoice", obj);
                _objWrapper.masterList = _dt.DataTableToList<StockTransfer>().ToList();
                _obj.InvoiceNo = inv;
                _obj.CreatedBy = UserSession.getUserName();
                _dt1 = getDataByParam("GetTransferDetailDataByInvoice", _obj);
                _objWrapper.list = _dt1.DataTableToList<StockTransferDetails>().ToList();
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperStockTransfer GetTranferDataByInvNoPrint(string inv)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@InvoiceNo", inv)
            };
           // _dt = _accessManager.GetDataByDataTable("usp_IncomingandProductionList", _sqlParameterList, DbName.Inventory);
             ds = _accessManager.GetDataByDataSet("usp_GetTranferPrintDataByInvNo", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }

            if (ds.Tables[0].Rows.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrapper.masterList = ds.Tables[0].DataTableToList<StockTransfer>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    _objWrapper.list = ds.Tables[1].DataTableToList<StockTransferDetails>();
                }

            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }

            return _objWrapper;
        }

        private DataTable getDataByParam(string operationName, StockTransfer obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@InvoiceNo", string.IsNullOrEmpty(obj.InvoiceNo) ? SqlString.Null : obj.InvoiceNo));
            _dt = _accessManager.GetDataByDataTable("usp_LoadStockTransferEditData", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }

        public WrapperStockTransfer DuplicateCheck(string orderNo)
        {
            _objWrapper = new WrapperStockTransfer();
            _dt = new DataTable();
            try
            {
                string user = UserSession.getUserName();
                _dt = new DataTable();
                _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@orderNo", orderNo)
            };
                _dt = _accessManager.GetDataByDataTable("usp_StockTransfer_DuplicateCheck", _sqlParameterList, DbName.Inventory, user, out error);
                _objWrapper.Save_error = _dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperStockTransfer DetailIdDelete(string DetsId)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperStockTransfer();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@DetailId", Convert.ToInt32(DetsId))
                // new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("DeleteDetailsByTransferId", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperStockTransfer DeletedById(string Id)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperStockTransfer();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@Id", Convert.ToInt32(Id)),
                 new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("DeletedByTransferId", _sqlParameterList, DbName.Inventory, user, out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            return _objWrapper;
        }
    }
}
