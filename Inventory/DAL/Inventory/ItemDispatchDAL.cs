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
    public class ItemDispatchDAL
    {
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        private List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private WrapperDispatch _objWrapper = new WrapperDispatch();
        List<ItemDispatch> _list = new List<ItemDispatch>();
        private DataTable _dt = new DataTable();
        private ItemDispatch _obj = new ItemDispatch();
        string error = string.Empty;

        public WrapperDispatch loadSaleInvoice(ItemDispatch _obj)
        {
            try
            {
                _dt = getDataByParameter("loadSaleInvoice", _obj);
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

        public WrapperDispatch LoadDeliveryMethod(ItemDispatch _obj)
        {
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

        private DataTable getDataByParameter(string operationName, ItemDispatch obj)
        {
            _dt = new DataTable();
            error = string.Empty;
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SaleId", string.IsNullOrEmpty(obj.SaleId) ? 0 : Convert.ToInt32(obj.SaleId)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? SqlString.Null : obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, obj.CreatedBy, out error);
            return _dt;
        }
        public List<List<ItemDispatch>> GetDataBySaleId(string saleId)
        {
            var _lstData = new List<List<ItemDispatch>>();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetDataBySaleId"),
                 new SqlParameter("@SaleId", Convert.ToInt32(saleId))
            };
            var ds = _accessManager.GetDataByDataSet("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            _list = ds.Tables[0].DataTableToList<ItemDispatch>();
            _lstData.Add(_list);
            _list = ds.Tables[1].DataTableToList<ItemDispatch>();
            _lstData.Add(_list);
            return _lstData;
        }
        public WrapperDispatch Save(List<ItemDispatch> objList, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    item.CreatedBy = user;
                    _sqlParameterList = getparam("SaleDispatch", item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
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
            return _objWrapper;
        }

        private List<SqlParameter> getparam(string operationName, ItemDispatch obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@SaleId", string.IsNullOrEmpty(obj.SaleId) ? 0 : Convert.ToInt32(obj.SaleId)));
            _sqlParameterList.Add(new SqlParameter("@customerId", string.IsNullOrEmpty(obj.CustomerId) ? 0 : Convert.ToInt32(obj.CustomerId)));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", string.IsNullOrEmpty(obj.IHeadId) ? 0 : Convert.ToInt32(obj.IHeadId)));
            _sqlParameterList.Add(new SqlParameter("@LocId", string.IsNullOrEmpty(obj.LocId) ? 0 : Convert.ToInt32(obj.LocId)));
            _sqlParameterList.Add(new SqlParameter("@SaleQty", string.IsNullOrEmpty(obj.SaleQty) ? 0 : Convert.ToDecimal(obj.SaleQty)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? "" : obj.CreatedBy));
            return _sqlParameterList;
        }

        #region "Despatch Center"

        #region "Change Method"
        //public WrapperDispatch SaveAwating(ItemDispatch obj, string user)
        //{
        //    _dt = new DataTable();
        //    try
        //    {
        //        error = string.Empty;
        //        _sqlParameterList = new List<SqlParameter>
        //        {
        //             new SqlParameter("@operationName", "AwatingDespatch"),
        //             new SqlParameter("@InvoiceNo", obj.InvoiceNo),
        //             new SqlParameter("@SaleId", obj.SaleId),
        //             new SqlParameter("@SaleDetId", obj.SaleDetId),
        //             new SqlParameter("@customerId", obj.CustomerId),
        //             new SqlParameter("@IHeadId", obj.IHeadId),
        //             new SqlParameter("@SaleQty", obj.SaleQty),
        //             new SqlParameter("@Box", obj.Box),
        //             new SqlParameter("@DeliveryMethod", obj.DeliveryMethod),
        //             new SqlParameter("@RequiedDate", obj.RequiedDate),
        //             new SqlParameter("@TrakingNumber", obj.TrakingNumber),
        //             new SqlParameter("@ShipVia", obj.ShipVia),
        //             new SqlParameter("@ManifestPrice", obj.ManifestPrice),
        //             new SqlParameter("@CreateBy", user)
        //         };
        //        _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, user, out error);
        //        if (!string.IsNullOrEmpty(error))
        //        {
        //            _objWrapper.Error = error;
        //            return _objWrapper;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _objWrapper.Error = ex.Message;
        //    }
        //    return _objWrapper;
        //}

        #endregion

        public WrapperDispatch SaveAwating(List<ItemDispatch> objList, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var obj in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                    {
                     new SqlParameter("@operationName", "AwatingDespatch"),
                     new SqlParameter("@InvoiceNo", obj.InvoiceNo),
                     new SqlParameter("@SaleId", obj.SaleId),
                     new SqlParameter("@SaleDetId", obj.SaleDetId),
                     new SqlParameter("@customerId", obj.CustomerId),
                     new SqlParameter("@IHeadId", obj.IHeadId),
                     new SqlParameter("@SaleQty", obj.SaleQty),
                     new SqlParameter("@Box", obj.Box),
                     new SqlParameter("@DeliveryMethod", obj.DeliveryMethod),
                     new SqlParameter("@RequiedDate", obj.RequiedDate),
                     new SqlParameter("@TrakingNumber", obj.TrakingNumber),
                     new SqlParameter("@ShipVia", obj.ShipVia),
                     new SqlParameter("@ManifestPrice", obj.ManifestPrice),
                     new SqlParameter("@SpecialInstruction", obj.SpecialInstruction),
                     new SqlParameter("@CreateBy", user)
                     };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, user, out error);
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
            return _objWrapper;
        }
        public WrapperDispatch GetDespatchData(string FromDate, string Todate)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetDespatchData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate)

            };
            // _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            ds = _accessManager.GetDataByDataSet("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }

            if (ds.Tables[0].Rows.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    _objWrapper.list = ds.Tables[0].DataTableToList<ItemDispatch>();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
                }

            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }

            //if (_dt.Rows.Count > 0)
            //{
            //    _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            //}
            //else
            //{
            //    _objWrapper.Error = "No data Available";
            //    return _objWrapper;
            //}
            return _objWrapper;
        }
        public WrapperDispatch GetFreightDespatchData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetFreightDespatchData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                new SqlParameter("@type", type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        public WrapperDispatch GetLocalDeliveryData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetLocalDeliveryData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@type", type)
            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        public WrapperDispatch GetCustomerPickUpData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetCustomerPickUpData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate) ,
                 new SqlParameter("@type", type)
            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperDispatch GetWarehousePickUpData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetWarehousePickup"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate) ,
                 new SqlParameter("@type", type)
            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        public WrapperDispatch GetWSPartyPickupData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetWSPartyPickupData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                new SqlParameter("@type", type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperDispatch GetSpecialDeliveryData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetSpecialDeliveryData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate) ,
                 new SqlParameter("@type", type)
            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        public WrapperDispatch GetLaybyData()
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetLaybyData"),
            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        public WrapperDispatch GettDespatchRegisterData(string FromDate, string Todate, string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GettDespatchRegisterData"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                new SqlParameter("@type", type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_SaleDispatch", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        #endregion

        #region "Local Delivery Run Sheet"
        public WrapperDispatch GetLocalDeliveryRunSheet(string FromDate, string Todate,string Type)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@Type", Type)

            };
             _dt = _accessManager.GetDataByDataTable("usp_LocalDeliveryRunSheet", _sqlParameterList, DbName.Inventory);
           // ds = _accessManager.GetDataByDataSet("usp_LocalDeliveryRunSheet", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            #region "for DataSet Convertion"
            //if (ds.Tables[0].Rows.Count > 0)
            //{
            //    if (ds.Tables[0].Rows.Count > 0)
            //    {
            //        _objWrapper.list = ds.Tables[0].DataTableToList<ItemDispatch>();
            //    }
            //    if (ds.Tables[1].Rows.Count > 0)
            //    {
            //        _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
            //    }

            //}
            //else
            //{
            //    _objWrapper.Error = "No data Available";
            //    return _objWrapper;
            //}
            #endregion

            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        #endregion

        #region" Save Fright & Local Delivery"
        public WrapperDispatch SaveAllDespatch(List<ItemDispatch> objList, Attachment _objAtth, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                {
                     new SqlParameter("@operationName", "SaveAllDespatch"),
                     new SqlParameter("@InvoiceNo", item.InvoiceNo),
                     new SqlParameter("@SaleId", item.SaleId),
                     new SqlParameter("@SaleDetId", item.SaleDetId),
                     new SqlParameter("@customerId", item.CustomerId),
                     new SqlParameter("@IHeadId", Convert.ToInt32(item.IHeadId)),
                     new SqlParameter("@SaleQty", item.SaleQty),
                     new SqlParameter("@FileLocation", _objAtth.FileLocation),
                     new SqlParameter("@FileNameSave", _objAtth.FileNameSave),
                     new SqlParameter("@FileNameUser", _objAtth.FileNameUser),
                     new SqlParameter("@CreateBy", user)
                 };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaveAllDespatch", _sqlParameterList, DbName.Inventory, user, out error);
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
            return _objWrapper;
        }
        #endregion

        #region "Save Customer and Warehouse Pickup"
        public WrapperDispatch SaveCustomerPickupDespatch(List<ItemDispatch> objList, Attachment _objAtth, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                {
                     new SqlParameter("@operationName", "SaveCustomerPickupDespatch"),
                     new SqlParameter("@InvoiceNo", item.InvoiceNo),
                     new SqlParameter("@SaleId", item.SaleId),
                     new SqlParameter("@SaleDetId", item.SaleDetId),
                     new SqlParameter("@customerId", item.CustomerId),
                     new SqlParameter("@IHeadId", Convert.ToInt32(item.IHeadId)),
                     new SqlParameter("@SaleQty", item.SaleQty),
                     new SqlParameter("@FileLocation", _objAtth.FileLocation),
                     new SqlParameter("@FileNameSave", _objAtth.FileNameSave),
                     new SqlParameter("@FileNameUser", _objAtth.FileNameUser),
                     new SqlParameter("@CreateBy", user)
                 };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaveCustomerPickupDespatch", _sqlParameterList, DbName.Inventory, user, out error);
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
            return _objWrapper;
        }

        #endregion

        #region "Awating Booking Cancel" 
        public WrapperDispatch AwatingBookedCancel(List<ItemDispatch> objList, string user)
        {
            _dt = new DataTable();
            try
            {
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>
                    {
                         new SqlParameter("@operationName", "AwatingBookedCancel"),
                         new SqlParameter("@InvoiceNo", item.InvoiceNo),
                         new SqlParameter("@SaleId", item.SaleId),
                         new SqlParameter("@SaleDetId", item.SaleDetId),
                         new SqlParameter("@CustomerId", item.CustomerId),
                         new SqlParameter("@IHeadId", Convert.ToInt32(item.IHeadId)),
                         new SqlParameter("@CreateBy", user)
                     };
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_SaleDispatch", _sqlParameterList, DbName.Inventory, user, out error);
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
            return _objWrapper;
        }

        #endregion

        #region "Booking Status Details"
        public WrapperDispatch GetBookingStatusDetails(string FromDate, string Todate, string Type)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@Type", Type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_BookingStatus_Details", _sqlParameterList, DbName.Inventory);
            // ds = _accessManager.GetDataByDataSet("usp_LocalDeliveryRunSheet", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            #region "for DataSet Convertion"
            //if (ds.Tables[0].Rows.Count > 0)
            //{
            //    if (ds.Tables[0].Rows.Count > 0)
            //    {
            //        _objWrapper.list = ds.Tables[0].DataTableToList<ItemDispatch>();
            //    }
            //    if (ds.Tables[1].Rows.Count > 0)
            //    {
            //        _objWrapper.listComboData = ds.Tables[1].DataTableToList<ComboData>();
            //    }

            //}
            //else
            //{
            //    _objWrapper.Error = "No data Available";
            //    return _objWrapper;
            //}
            #endregion

            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        #endregion

        #region "Whole Sales Order Status"
        public WrapperDispatch GetWholeSaleOrderStatus(string FromDate, string Todate, string Type)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@Type", Type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_WholeSalesOrderStatus", _sqlParameterList, DbName.Inventory);
            // ds = _accessManager.GetDataByDataSet("usp_LocalDeliveryRunSheet", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.list = _dt.DataTableToList<ItemDispatch>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        #endregion

    }
}
