using Common;
using DAO.Basic;
using DAO.Purchase;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Purchase
{
   public class PurchaseOrderDAL
    {
        List<ComboData> lstComboData = new List<ComboData>();
        List<SqlParameter> _sqlParameterList = new List<SqlParameter>();
        private DataTable _dt = new DataTable();
        private CommonParameter _obj = new CommonParameter();
        private readonly DbAccessManager _accessManager = new DbAccessManager();
        PurchaseOrder _objPurchaseOrder = new PurchaseOrder();
        WrapperPurchaseOrder _objWrapper = new WrapperPurchaseOrder();
        WrapperIHead wappIHead = new WrapperIHead();
        List<PurchaseOrder> _mlist = new List<PurchaseOrder>();
        string operationName = "", error = "";


        public WrapperPurchaseOrder loadItemHead( string ManufacturerId)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            _objPurchaseOrder.ManufacturerId = ManufacturerId;
            try
            {
                _dt = getDataByParameter("LoadItemHeadWithBoxCBM", _objPurchaseOrder);
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

        public WrapperPurchaseOrder loadPODocumentList()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("loadPODocumentList", _objPurchaseOrder);
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

        public WrapperPurchaseOrder loadProductionPic()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("loadProductionPic", _objPurchaseOrder);
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

        public WrapperPurchaseOrder loadPOStatus()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("loadPOStatus", _objPurchaseOrder);
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

        public WrapperPurchaseOrder LoadPortOfLoading()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadPortOfLoading", _objPurchaseOrder);
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

        public WrapperPurchaseOrder LoadCFAgency()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadCFAgency", _objPurchaseOrder);
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

        public WrapperPurchaseOrder LoadShipingAgency()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getDataByParameter("LoadShipingAgency", _objPurchaseOrder);
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

        public WrapperPurchaseOrder DuplicateCheck(string PINumber)
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            PurchaseOrder _obj = new PurchaseOrder();
            try
            {
                _obj.CreatedBy = UserSession.getUserName();
                _obj.PINumber = PINumber;
                _dt = getDataByParameter("DuplicateCheck", _obj);
                _objWrapper.Save_error = _dt.Rows.Count > 0 ? "True" : "False";
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }


        private DataTable getDataByParameter(string operationName, PurchaseOrder _obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@PINumber", string.IsNullOrEmpty(_obj.PINumber) ? SqlString.Null : _obj.PINumber));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(_obj.ManufacturerId) ? 0 : Convert.ToInt32(_obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", _obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_PurchaseOrder", _sqlParameterList, DbName.Inventory);
            return _dt;
        }

        public WrapperPurchaseOrder Save(PurchaseOrder obj, List<PurchaseOrderDetails> objList)
        {
            _dt = new DataTable();
            try
            {
                var _sqlParamList = new List<SqlParameter>()
                {
                    new SqlParameter("@operationName", "SaveDataMaster"),
                    new SqlParameter("@POMasterId", string.IsNullOrEmpty(obj.POMasterId) ? "0" : obj.POMasterId),
                    new SqlParameter("@ManufacturerId",Convert.ToInt32(obj.ManufacturerId)),
                    new SqlParameter("@PODate", obj.PODate),
                    new SqlParameter("@ImportOrLocal", obj.ImportOrLocal),
                    new SqlParameter("@PONumber", string.IsNullOrEmpty( obj.PONumber) ? "" : obj.PONumber),
                    new SqlParameter("@PINumber", string.IsNullOrEmpty(obj.PINumber) ? "" : obj.PINumber),
                    new SqlParameter("@Description", string.IsNullOrEmpty(obj.Description) ? "" : obj.Description),
                    new SqlParameter("@PortOfLoading", string.IsNullOrEmpty(obj.PortOfLoading) ? "" : obj.PortOfLoading),
                    new SqlParameter("@ProductionTime", string.IsNullOrEmpty(obj.ProductionTime) ? "" : obj.ProductionTime),
                    new SqlParameter("@ProductionEndDate", string.IsNullOrEmpty(obj.ProductionEndDate) ? "" : obj.ProductionEndDate),
                    new SqlParameter("@DateOfLoading", string.IsNullOrEmpty(obj.DateOfLoading) ? "" : obj.DateOfLoading),
                    new SqlParameter("@OrderStatusId", string.IsNullOrEmpty(obj.OrderStatusId) ? "" : obj.OrderStatusId),
                    new SqlParameter("@DepAmountAUD", string.IsNullOrEmpty( obj.DepAmountAUD) ? "0" : obj.DepAmountAUD),
                    new SqlParameter("@DepAmountUSD", string.IsNullOrEmpty(obj.DepAmountUSD) ? "0" : obj.DepAmountUSD),
                    new SqlParameter("@ShipRateAUD", string.IsNullOrEmpty(obj.ShipRateAUD) ? "0" : obj.ShipRateAUD),
                    new SqlParameter("@ShipRateUSD", string.IsNullOrEmpty(obj.ShipRateUSD) ? "0" : obj.ShipRateUSD),
                    new SqlParameter("@DepositDate", string.IsNullOrEmpty(obj.DepositDate) ? "" : obj.DepositDate),
                    new SqlParameter("@DueDate", string.IsNullOrEmpty(obj.DueDate) ? "" : obj.DueDate),
                    new SqlParameter("@TransitTimeETA", string.IsNullOrEmpty(obj.TransitTimeETA) ? "" : obj.TransitTimeETA),
                    new SqlParameter("@TransitTimeETD", string.IsNullOrEmpty(obj.TransitTimeETD) ? "" : obj.TransitTimeETD),
                    new SqlParameter("@FreeDays", string.IsNullOrEmpty(obj.FreeDays) ? "" : obj.FreeDays),
                    new SqlParameter("@ContainerNumber", string.IsNullOrEmpty(obj.ContainerNumber) ? "" : obj.ContainerNumber),
                    new SqlParameter("@DocumentId", string.IsNullOrEmpty(obj.DocumentId) ? "" : obj.DocumentId),
                    new SqlParameter("@CurrencyId", Convert.ToInt32(obj.CurrencyId)),
                    new SqlParameter("@CreateBy", obj.CreatedBy),
                    new SqlParameter("@ConversionRate", string.IsNullOrEmpty(obj.ConversionRate) ? 0: Convert.ToDecimal(obj.ConversionRate)),
                    new SqlParameter("@CFAgencyRate", string.IsNullOrEmpty(obj.CFAgencyRate) ? 0 : Convert.ToDecimal(obj.CFAgencyRate)),
                    new SqlParameter("@TransitTime", string.IsNullOrEmpty(obj.TransitTime) ? "" : obj.TransitTime),
                    new SqlParameter("@CFAgencyId", string.IsNullOrEmpty(obj.CFAgencyId) ? "0" : obj.CFAgencyId),
                    new SqlParameter("@BillofLading", string.IsNullOrEmpty(obj.BillofLading) ? "" : obj.BillofLading),
                    new SqlParameter("@ShipingAgentId", string.IsNullOrEmpty(obj.ShipingAgentId) ? "0" : obj.ShipingAgentId),
                    new SqlParameter("@ProdPicId", string.IsNullOrEmpty(obj.ProdPicId) ? "" : obj.ProdPicId),
                    new SqlParameter("@ETAWarehouse", string.IsNullOrEmpty(obj.ETAWarehouse) ? "" : obj.ETAWarehouse),
                    new SqlParameter("@Notes", string.IsNullOrEmpty(obj.Notes) ? "" : obj.Notes)
                };
                _dt = _accessManager.GetDataByDataTable("usp_PurchaseOrder", _sqlParamList, DbName.Inventory, UserSession.getUserName(), out error);

                string pOMasterId = _dt.Rows[0]["POMasterId"].ToString();
                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    _sqlParameterList = getparam("SaveDataDetail", pOMasterId, item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_PurchaseOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
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

        private List<SqlParameter> getparam(string operationName, string pOMasterId, PurchaseOrderDetails obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@POMasterId", string.IsNullOrEmpty(pOMasterId) ? "0" : pOMasterId));
            _sqlParameterList.Add(new SqlParameter("@PODetailId", string.IsNullOrEmpty(obj.PODetailId) ? "0" : obj.PODetailId));
            _sqlParameterList.Add(new SqlParameter("@IHeadId",Convert.ToInt32(obj.IHeadId)));
            _sqlParameterList.Add(new SqlParameter("@Quantity", Convert.ToDecimal(obj.Quantity)));
            _sqlParameterList.Add(new SqlParameter("@UnitPrice", Convert.ToDecimal(obj.UnitPrice)));
            _sqlParameterList.Add(new SqlParameter("@TotalPrice", Convert.ToDecimal(obj.TotalPrice)));
            _sqlParameterList.Add(new SqlParameter("@Box", Convert.ToInt32(obj.Box)));
            _sqlParameterList.Add(new SqlParameter("@CBM", Convert.ToDecimal(obj.CBM)));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", UserSession.getUserName()));
            return _sqlParameterList;
        }
        public WrapperPurchaseOrder GetPurchaseOrderEditData(string FromDate, string Todate,string type)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetPurchaseOrderEditData"),
                 new SqlParameter("@DepositDate", FromDate),
                 new SqlParameter("@DueDate", Todate),
                new SqlParameter("@FreeDays", type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_PurchaseOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public List<List<PurchaseOrder>> GetPoEditData(string POMasterId)
        {
            var _lstData = new List<List<PurchaseOrder>>();
            _sqlParameterList = new List<SqlParameter>
            {
                new SqlParameter("@operationName", "GetPoEditDataById"),
                new SqlParameter("@POMasterId", Convert.ToInt64(POMasterId))
            };
            var ds = _accessManager.GetDataByDataSet("usp_PurchaseOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            _mlist = ds.Tables[0].DataTableToList<PurchaseOrder>();
            _lstData.Add(_mlist);
            _mlist = ds.Tables[1].DataTableToList<PurchaseOrder>();
            _lstData.Add(_mlist);
            return _lstData;
        }

        public WrapperPurchaseOrder PODetailIdDelete(string PODetailId)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@PODetailId", PODetailId),
                 new SqlParameter("@CreateBy",user)
            };
            _accessManager.ExecuteNonQueryByStoreProcedure("usp_PurchaseOrderDetailsIdDelete", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperPurchaseOrder Delete(PurchaseOrder obj)
        {
            string user = UserSession.getUserName();
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@POMasterId", obj.POMasterId),
                 new SqlParameter("@CreateBy",user)
            };
           _dt = _accessManager.GetDataByDataTable("usp_PurchaseOrderDelete", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }


        #region" PO Consumsion"
        public WrapperIHead GetPOConstionByManufacturer(string ManufacturerId,string MasterId)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetPOConstionByManufacturer"),
                 new SqlParameter("@ManufacturerId", ManufacturerId),
                 new SqlParameter("@OrderStatusId",string.IsNullOrEmpty(MasterId) ? 0 : Convert.ToInt32(MasterId))
            };
            _dt = _accessManager.GetDataByDataTable("usp_PurchaseOrder", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                wappIHead.Error = error;
                return wappIHead;
            }
            if (_dt.Rows.Count > 0)
            {
                wappIHead.list = _dt.DataTableToList<ItemHead>();
            }
            else
            {
                wappIHead.Error = "No data Available";
                return wappIHead;
            }
            return wappIHead;
        }

        public WrapperIHead Save(ItemHead obj, List<ItemHead> objList)
        {
            _dt = new DataTable();
            try
            {
                var _sqlParamList = new List<SqlParameter>()
                {
                    new SqlParameter("@operationName", "OrderEstimateMaster"),
                    new SqlParameter("@ManufacturerId", obj.ManufacturerId),
                    new SqlParameter("@Manufacturer", obj.Manufacturer),
                    new SqlParameter("@OrderEstimateDate", obj.UpdatedBy),
                    new SqlParameter("@Description", obj.Description),
                    new SqlParameter("@Notes", obj.FileName),
                    new SqlParameter("@CreateBy", obj.CreatedBy)
                };
                _dt = _accessManager.GetDataByDataTable("usp_NewOrderEstimate", _sqlParamList, DbName.Inventory, obj.CreatedBy, out error);

                string id = _dt.Rows[0]["POEstimateId"].ToString();

                //var _sqlParameterList1 = new List<SqlParameter>();
                //_sqlParameterList1.Add(new SqlParameter("@POEstimateId", id));
                //_accessManager.ExecuteNonQueryByStoreProcedure("usp_DeleteNewOrderEstimate", _sqlParameterList1, DbName.Inventory, obj.CreatedBy, out error);

                foreach (var item in objList)
                {
                    error = string.Empty;
                    _sqlParameterList = new List<SqlParameter>();
                    item.CreatedBy = UserSession.getUserName();
                    _sqlParameterList = getparam("OrderEstimateDetails", id, item);
                    _accessManager.ExecuteNonQueryByStoreProcedure("usp_NewOrderEstimate", _sqlParameterList, DbName.Inventory, item.CreatedBy, out error);
                    if (!string.IsNullOrEmpty(error))
                    {
                        wappIHead.Error = error;
                        return wappIHead;
                    }
                }
            }
            catch (Exception ex)
            {
                wappIHead.Error = ex.Message;
            }
            return wappIHead;
        }
        private List<SqlParameter> getparam(string operationName, string id, ItemHead obj)
        {
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@POEstimateId", id));
            _sqlParameterList.Add(new SqlParameter("@IHeadId", obj.IHeadId));
            _sqlParameterList.Add(new SqlParameter("@WareStock", string.IsNullOrEmpty(obj.WareStock) ? "0" : obj.WareStock));
            _sqlParameterList.Add(new SqlParameter("@SaleStock", string.IsNullOrEmpty(obj.SaleStock) ? "0" : obj.SaleStock));
            _sqlParameterList.Add(new SqlParameter("@IncomQty", string.IsNullOrEmpty(obj.IncomQty) ? "0" : obj.IncomQty));
            _sqlParameterList.Add(new SqlParameter("@ProQty", string.IsNullOrEmpty(obj.ProQty) ? "0" : obj.ProQty));
            _sqlParameterList.Add(new SqlParameter("@OrderQty", string.IsNullOrEmpty(obj.OrderQty) ? "0" : obj.OrderQty));
            _sqlParameterList.Add(new SqlParameter("@CostingPrice", string.IsNullOrEmpty(obj.CostingPrice) ? "0" : obj.CostingPrice));
            _sqlParameterList.Add(new SqlParameter("@NewPrice", string.IsNullOrEmpty(obj.NewPrice) ? "0" : obj.NewPrice));
            _sqlParameterList.Add(new SqlParameter("@TotCBM", string.IsNullOrEmpty(obj.TotCBM) ? "0" : obj.TotCBM));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", string.IsNullOrEmpty(obj.CreatedBy) ? "" : obj.CreatedBy));
            return _sqlParameterList;
        }


        public WrapperIHead GetNewOrderEstimateData(string FromDate, string Todate)
        {
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "GetNewOrderEstimateData"),
                 new SqlParameter("@OrderEstimateDate", FromDate),
                 new SqlParameter("@CreateBy", Todate)
            };
            _dt = _accessManager.GetDataByDataTable("usp_NewOrderEstimate", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                wappIHead.Error = error;
                return wappIHead;
            }
            if (_dt.Rows.Count > 0)
            {
                wappIHead.list = _dt.DataTableToList<ItemHead>();
            }
            else
            {
                wappIHead.Error = "No data Available";
                return wappIHead;
            }
            return wappIHead;
        }


        public WrapperIHead DeleteNewOrderEstimate(ItemHead obj)
        {
            string user = UserSession.getUserName();
            wappIHead = new WrapperIHead();
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@operationName", "DeleteNewOrderEstimate"),
                 new SqlParameter("@ManufacturerId", obj.ManufacturerId),
                 new SqlParameter("@CreateBy",user)
            };
            _dt = _accessManager.GetDataByDataTable("usp_NewOrderEstimate", _sqlParameterList, DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                wappIHead.Error = error;
                return wappIHead;
            }
            if (_dt.Rows.Count > 0)
            {
                wappIHead.list = _dt.DataTableToList<ItemHead>();
            }
            else
            {
                wappIHead.Error = "No data Available";
                return wappIHead;
            }
            return wappIHead;
        }


        #endregion

        #region "Shipping Status"
        public WrapperPurchaseOrder GetShippingStatus()
        {
            //_sqlParameterList = new List<SqlParameter>
            //{
            //     new SqlParameter("@operationName", "GetPOConstionByManufacturer"),
            //};
            _dt = _accessManager.GetDataByDataTable("usp_POShippingStatus", DbName.Inventory, UserSession.getUserName(), out error);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }
            if (_dt.Rows.Count > 0)
            {
                _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
            }
            else
            {
                wappIHead.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }
        #endregion

        #region "Supplier Payment"

        public WrapperPurchaseOrder loadPOSupplier()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getSupplierDataByParameter("loadPOSupplier", _objPurchaseOrder);
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
        public WrapperPurchaseOrder loadPINumber()
        {
            _objWrapper = new WrapperPurchaseOrder();
            _dt = new DataTable();
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getSupplierDataByParameter("loadPINumber", _objPurchaseOrder);
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

        public WrapperPurchaseOrder GetManufactureandPiWiseData( string POMasterId)
        {
            _objPurchaseOrder = new PurchaseOrder();
            _objPurchaseOrder.POMasterId = POMasterId;
            _objPurchaseOrder.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getSupplierDataByParameter("ManufactureandPIWiseData", _objPurchaseOrder);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        public WrapperPurchaseOrder SupplierPaySave(PurchaseOrder obj)
        {
            obj.CreatedBy = UserSession.getUserName();
            try
            {
                _dt = getSupplierDataByParameter("SupplierPaySave", obj);
                if (_dt.Rows.Count > 0)
                {
                    _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
                }
            }
            catch (Exception ex)
            {
                _objWrapper.Error = ex.Message;
            }
            return _objWrapper;
        }

        private DataTable getSupplierDataByParameter(string operationName, PurchaseOrder _obj)
        {
            _dt = new DataTable();
            _sqlParameterList = new List<SqlParameter>();
            _sqlParameterList.Add(new SqlParameter("@operationName", operationName));
            _sqlParameterList.Add(new SqlParameter("@PODate", string.IsNullOrEmpty(_obj.PODate) ? SqlString.Null : _obj.PODate));
            _sqlParameterList.Add(new SqlParameter("@ManufacturerId", string.IsNullOrEmpty(_obj.ManufacturerId) ? 0 : Convert.ToInt32(_obj.ManufacturerId)));
            _sqlParameterList.Add(new SqlParameter("@POMasterId", string.IsNullOrEmpty(_obj.POMasterId) ? 0 : Convert.ToInt64(_obj.POMasterId)));
            _sqlParameterList.Add(new SqlParameter("@DepAmountUSD", string.IsNullOrEmpty(_obj.DepAmountUSD) ? 0 : Convert.ToDecimal(_obj.DepAmountUSD)));
            _sqlParameterList.Add(new SqlParameter("@DepAmountAUD", string.IsNullOrEmpty(_obj.DepAmountAUD) ? 0 : Convert.ToDecimal(_obj.DepAmountAUD)));
            _sqlParameterList.Add(new SqlParameter("@Description", string.IsNullOrEmpty(_obj.Description) ? SqlString.Null : _obj.Description));
            _sqlParameterList.Add(new SqlParameter("@CreateBy", _obj.CreatedBy));
            _dt = _accessManager.GetDataByDataTable("usp_SupplierPayment", _sqlParameterList, DbName.Inventory);
            return _dt;
        }
        #endregion


        #region "Incoming And Production List"
        public WrapperPurchaseOrder GetIncomingProductionList(string FromDate, string Todate, string Type)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@Operation", "IncomingandProductionList"),
                 new SqlParameter("@FromDate", FromDate),
                 new SqlParameter("@Todate", Todate),
                 new SqlParameter("@Type", Type)

            };
            _dt = _accessManager.GetDataByDataTable("usp_IncomingandProductionList", _sqlParameterList, DbName.Inventory);
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
                _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
            }
            else
            {
                _objWrapper.Error = "No data Available";
                return _objWrapper;
            }
            return _objWrapper;
        }

        public WrapperPurchaseOrder GetPackingListByPINumber(string PINumber)
        {
            DataSet ds = new DataSet();
            _sqlParameterList = new List<SqlParameter>
            {
                 new SqlParameter("@Operation", "PackingListByPINumber"),
                 new SqlParameter("@PINumber", PINumber)

            };
            _dt = _accessManager.GetDataByDataTable("usp_IncomingandProductionList", _sqlParameterList, DbName.Inventory);
            if (!string.IsNullOrEmpty(error))
            {
                _objWrapper.Error = error;
                return _objWrapper;
            }

            if (_dt.Rows.Count > 0)
            {
                _objWrapper.listPOMaster = _dt.DataTableToList<PurchaseOrder>();
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
