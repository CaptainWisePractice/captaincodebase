using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Reflection;
using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using Common;
using APIPOS.ViewModel;

namespace APIPOS.Controllers
{
    public class DataAccessController : Controller
    {



        string dataBaseName = Common.DbName.Inventory;
        // GET: DataAccess
        public ActionResult GetEtaInfoByItemCode(string itemcode)
        {
            IDataReader dataReader;
            Database db = new Microsoft.Practices.
            EnterpriseLibrary.Data.Sql.SqlDatabase(Common.DbConnection.GetConnectionStringByDbName(dataBaseName));

            string storeProcedure = "GetEtaInfoByItemCode";

            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            sqlParameterlist.Add(new SqlParameter("@itemcode", itemcode));

            DbCommand dbCommand;

            dbCommand = db.GetStoredProcCommand(storeProcedure);
            dbCommand.CommandTimeout = 1200;
            dbCommand.Parameters.Clear();
            dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
            dataReader = db.ExecuteReader(dbCommand);
            //dbCommand.Parameters.Clear();

            var ETAdate = "";
            var Qty = "";

            string formatedstring = "";

            while (dataReader.Read())
            {
                ETAdate = dataReader["ETAWarehouse"].ToString();
                Qty = dataReader["Quantity"].ToString();
                var shortDate = "";
                if (ETAdate != "")
                {
                    shortDate = Convert.ToDateTime(ETAdate).ToShortDateString();
                }

                formatedstring = formatedstring + shortDate + " (" + Qty + ")<br><br>";
            }

            var result = new
            {
                dates = formatedstring
            };

            JsonResult json = Json(result, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }

        // Booking Status 

        public ActionResult GetBookingStatus()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetBookingStatus(string FromDate, string Todate, string type)
        {

            IDataReader dataReader;
            Database db = new Microsoft.Practices.
            EnterpriseLibrary.Data.Sql.SqlDatabase(Common.DbConnection.GetConnectionStringByDbName(dataBaseName));

            string storeProcedure = "usp_BookingStatus";

            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            sqlParameterlist.Add(new SqlParameter("@FromDate", FromDate));
            sqlParameterlist.Add(new SqlParameter("@ToDate", Todate));
            sqlParameterlist.Add(new SqlParameter("@type", type));

            DbCommand dbCommand;

            dbCommand = db.GetStoredProcCommand(storeProcedure);
            dbCommand.CommandTimeout = 1200;
            dbCommand.Parameters.Clear();
            dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
            dataReader = db.ExecuteReader(dbCommand);
            //dbCommand.Parameters.Clear();

            //var Added_By = "";
            //var Added_Date = "";
            //var Sales_Record = "";
            //var Buyer_Name = "";
            //var Suburb = "";
            //var Post_Code = "";
            //var Item_Code = "";
            //var Item_Name = "";
            //var SaleQty = "";
            //var BoxQty = "";
            //var Tracking_Number = "";
            //var Maniftest_Price = "";
            //var Despatch_Date = "";
            //var Despatch_By = "";
            //var Note = "";
            //var Comment = "";

            //string formatedstring = "";

            List<VMBookingStatus> dataList = new List<VMBookingStatus>();

            while (dataReader.Read())
            {
                VMBookingStatus VMobj = new VMBookingStatus();

                VMobj.Added_By = dataReader["Added_By"].ToString();
                VMobj.Added_Date = dataReader["Added_Date"].ToString();
                VMobj.Sales_Record = dataReader["Sales_Record"].ToString();
                VMobj.Buyer_Name = dataReader["Buyer_Name"].ToString();
                VMobj.Suburb = dataReader["Suburb"].ToString();
                VMobj.Post_Code = dataReader["Post_Code"].ToString();
                VMobj.Item_Code = dataReader["Item_Code"].ToString();
                VMobj.Item_Name = dataReader["Item_Name"].ToString();
                VMobj.SaleQty = dataReader["SaleQty"].ToString();
                VMobj.BoxQty = dataReader["BoxQty"].ToString();
                VMobj.Tracking_Number = dataReader["Tracking_Number"].ToString();
                VMobj.Maniftest_Price = dataReader["Maniftest_Price"].ToString();
                VMobj.Despatch_Date = dataReader["Despatch_Date"].ToString();
                VMobj.Despatch_By = dataReader["Despatch_By"].ToString();
                VMobj.Note = dataReader["Note"].ToString();
                VMobj.Comment = dataReader["Comment"].ToString();



                dataList.Add(VMobj);



                // formatedstring = formatedstring + Added_Date + Despatch_Date + " (" + SaleQty + ")<br><br>";
            }

            var result = new
            {
                data = dataList.ToList()
            };

            JsonResult json = Json(result, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }

        public ActionResult GetWholeSalesDetails()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetWholeSalesDetails(string FromDate, string Todate, string type)
        {

            IDataReader dataReader;
            Database db = new Microsoft.Practices.
            EnterpriseLibrary.Data.Sql.SqlDatabase(Common.DbConnection.GetConnectionStringByDbName(dataBaseName));

            string storeProcedure = "usp_wholesalesdetails";

            List<SqlParameter> sqlParameterlist = new List<SqlParameter>();
            sqlParameterlist.Add(new SqlParameter("@FromDate", FromDate));
            sqlParameterlist.Add(new SqlParameter("@ToDate", Todate));
            sqlParameterlist.Add(new SqlParameter("@type", type));

            DbCommand dbCommand;

            dbCommand = db.GetStoredProcCommand(storeProcedure);
            dbCommand.CommandTimeout = 1200;
            dbCommand.Parameters.Clear();
            dbCommand.Parameters.AddRange(sqlParameterlist.ToArray());
            dataReader = db.ExecuteReader(dbCommand);   

            List<VMWholeSales> dataList = new List<VMWholeSales>();

            while (dataReader.Read())
            {
                VMWholeSales VMobj = new VMWholeSales();

                VMobj.Customer = dataReader["Customer"].ToString();
                VMobj.Order_No = dataReader["Order_No"].ToString();
                VMobj.Added_By = dataReader["Added_By"].ToString();
                VMobj.Added_Date = dataReader["Added_Date"].ToString();
                VMobj.Receiver_Name = dataReader["Receiver_Name"].ToString();
                VMobj.Delivery_Address = dataReader["Delivery_Address"].ToString();
                VMobj.City = dataReader["City"].ToString();
                VMobj.Post_Code = dataReader["Post_Code"].ToString();
                VMobj.State = dataReader["State"].ToString();
                VMobj.Phone = dataReader["Phone"].ToString();
                VMobj.Item_Code = dataReader["Item_Code"].ToString();
                VMobj.Item_Name = dataReader["Item_Name"].ToString();
                VMobj.Quantity = dataReader["Quantity"].ToString();
                VMobj.Unit_Price = dataReader["Unit_Price"].ToString();
                VMobj.GST = dataReader["GST"].ToString();
                VMobj.Shipping_Cost = dataReader["Shipping_Cost"].ToString();
                VMobj.Total = dataReader["Total"].ToString();
                VMobj.Invoice_Status = dataReader["Invoice_Status"].ToString();
                VMobj.Invoice_Number = dataReader["Invoice_Number"].ToString();
                VMobj.Payment_Option = dataReader["Payment_Option"].ToString();
                VMobj.Payment_Status = dataReader["Payment_Status"].ToString();
                VMobj.Delivery_Method = dataReader["Delivery_Method"].ToString();
                VMobj.Booking_Status = dataReader["Booking_Status"].ToString();
                VMobj.Tracking_Number = dataReader["Tracking_Number"].ToString();
                VMobj.Despatch_Status = dataReader["Despatch_Status"].ToString();
                VMobj.Despatch_Date = dataReader["Despatch_Date"].ToString();
                VMobj.Actual_Freight = dataReader["Actual_Freight"].ToString();
                VMobj.Notify_Buyer = dataReader["Notify_Buyer"].ToString();
                VMobj.Note = dataReader["Note"].ToString();

                dataList.Add(VMobj);

            }

            var result = new
            {
                data = dataList.ToList()
            };

            JsonResult json = Json(result, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2147483644;
            return json;
        }
    }
}