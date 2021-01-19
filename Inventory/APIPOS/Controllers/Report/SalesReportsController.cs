using APIPOS.App_Start;
using APIPOS.ReportThreads;
using DAL;
using DAL.Report;
using DAO.Reports;
using DAO.Sale;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Report
{
    [NoCache]
    public class SalesReportsController : Controller
    {
        private WrapperSalesReports _objWrapper = new WrapperSalesReports();
        private WrapperSales _objWrapperSale = new WrapperSales();
        private CommonDAL _objCommonDAL = new CommonDAL();
        private ReportDAL _objDal = new ReportDAL();
        // GET: SalesReports
        [AuthorizeActionFilter]
        public ActionResult Index(string Invoice)
        {
            return View();
        }

        [AuthorizeActionFilter]
        public ActionResult SaleInvoiceStore(string Invoice)
        {
            return View();
        }

        [AuthorizeActionFilter]
        public ActionResult SaleFBInvoice(string Invoice)
        {
            return View();
        }
        public ActionResult MailhtmlReport(string Invoice)
        {
            WrapperSalesReports wrapper = new WrapperSalesReports();

            try
            {
                String file = "";  // local File= 017f1182-80c2-4702-8695-48431a50a71c.png
                // Server File =5c2118e8-e53e-4f81-bf6f-53cd82ea8226.png;"/Uploads/FreightDespatch/bbf7c1f2-aa47-4308-a32b-39a81f049a40.jpg";
                string imgName = "/Uploads/Employee/11cd386b-8032-4a9b-a476-e776b13bba0d.png";
                try
                {
                    Byte[] bytes =
                        System.IO.File.ReadAllBytes(System.Web.HttpContext.Current.Request.MapPath("~") + imgName);
                    file = Convert.ToBase64String(bytes);
                }
                catch (Exception ex)
                {
                    file = "";
                }
                wrapper.result = file;

                if (Invoice != "")
                {
                    List<List<SalesReports>> listdata = _objDal.GetSaleinvoiceNo(Invoice);
                    wrapper.listSalesReports = listdata;

                }
            }
            catch (Exception e)
            {

                wrapper.Error = e.Message;
            }

            return View(wrapper);
        }
        public ActionResult MailhtmlReport2(string Invoice)
        {
            WrapperSalesReports wrapper = new WrapperSalesReports();

            try
            {
                String file = "";  // local File= 017f1182-80c2-4702-8695-48431a50a71c.png
                // Server File =5c2118e8-e53e-4f81-bf6f-53cd82ea8226.png;
                string imgName = "/Uploads/Employee/5c2118e8-e53e-4f81-bf6f-53cd82ea8226.png";
                try
                {
                    Byte[] bytes =
                        System.IO.File.ReadAllBytes(System.Web.HttpContext.Current.Request.MapPath("~") + imgName);
                    file = Convert.ToBase64String(bytes);
                }
                catch (Exception ex)
                {
                    file = "";
                }
                wrapper.result = file;

                if (Invoice != "")
                {
                    List<List<SalesReports>> listdata = _objDal.GetSaleinvoiceNo(Invoice);
                    wrapper.listSalesReports = listdata;

                }
            }
            catch (Exception e)
            {

                wrapper.Error = e.Message;
            }

            return View(wrapper);
        }

        public JsonResult GetSaleinvoiceNo(string invoiceNo)
        {
            _objWrapper = new WrapperSalesReports();
            List<List<SalesReports>> listdata = _objDal.GetSaleinvoiceNo(invoiceNo);
            _objWrapper.listSalesReports = listdata;
            return Json(_objWrapper, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SendMail(string saleInvoice,string term, string email)
        {
            // Declare task array, as we have to wait until all tasks finished
            List<Task> lTask = new List<Task>();
            ReportThreadContainerMail container = new ReportThreadContainerMail();
            dynamic wrapper = new System.Dynamic.ExpandoObject();
            dynamic SearchTerm = new System.Dynamic.ExpandoObject();
            String QueryString = JsonConvert.SerializeObject(wrapper);
            String QueryString2 = JsonConvert.SerializeObject(SearchTerm);
            string url1 = "";
            if (term != "Prepaid") {

                url1 = HttpUtility.HtmlDecode(Url.Action("MailhtmlReport", "SalesReports", new { Invoice = saleInvoice }, this.Request.Url.Scheme));
            }
            else
            { url1 = HttpUtility.HtmlDecode(Url.Action("MailhtmlReport2", "SalesReports", new { Invoice = saleInvoice }, this.Request.Url.Scheme)); }
            Start_1(container, lTask, url1);
            Task.WaitAll(lTask.ToArray());
            MemoryStream ms1 = null;
            if (container.SaleReport != null)
            {
                ms1 = new MemoryStream(container.SaleReport);
                ms1.Position = 0;
            }
            MailMessage mail = new MailMessage();
            SmtpClient smtpServer = new SmtpClient("wincloud01.au.ds.network");
            mail.From = new MailAddress("no-reply@captainwise.com.au");
            mail.To.Add(email.ToString()); //rahat@melbourniansfurniture.com.au   //sayed108cse@gmail.com
            mail.Subject = "Sale Invoice";// Outline(Sample)
            mail.Body += "It's an system generated automatic mail.";
            mail.IsBodyHtml = true;

            if (ms1 != null)
            {
                mail.Attachments.Add(new Attachment(ms1, saleInvoice +".html", System.Net.Mime.MediaTypeNames.Text.Html));
            }

           // smtpServer.Host = "wincloud01.au.ds.network";//"smtp.gmail.com";
            smtpServer.Port = 25;
            smtpServer.Credentials = new System.Net.NetworkCredential("no-reply@captainwise.com.au", "@1234567");
            smtpServer.EnableSsl = true;
            try
            {
                 smtpServer.Send(mail);
                _objWrapperSale = new WrapperSales();
                _objWrapperSale = _objDal.MailStatusUpdate(saleInvoice);
               // return Json(_objWrapperSale, JsonRequestBehavior.AllowGet);
                return Json("Mail sent successfully..");
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }

        }

        public JsonResult SendMailFromDB(string saleInvoice, string term, string email,int outletId)
        {
            try
            {
                _objWrapperSale = new WrapperSales();
                _objWrapperSale = _objDal.SendMailFromDB(saleInvoice, term, email, outletId);
                if (string.IsNullOrEmpty(_objWrapperSale.Error))
                {
                    _objWrapperSale = _objDal.MailStatusUpdate(saleInvoice);
                    return Json("Mail sent successfully..");
                }
                else { return Json("Mail sent failed.."); }
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }

        }

        private void Start_1(ReportThreadContainerMail container, List<Task> lTask, string reportUrl)
        {
            //// Create Task 
            SaleReportHtml DataReport = new SaleReportHtml(container);
            Task t1 = new Task(() => DataReport.Run(reportUrl));
            lTask.Add(t1);
            t1.Start();
        }

    }
}