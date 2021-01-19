using APIPOS.App_Start;
using DAO.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace APIPOS.ReportThreads
{
    public class SaleReportHtml
    {
        ReportThreadContainerMail container = new ReportThreadContainerMail();
        public SaleReportHtml(ReportThreadContainerMail _container)
        {
            this.container = _container;
        }

        public void Run(String Url)
        {
            CustomBrowser1 browser = new CustomBrowser1();
            string resultHtmlP = browser.GetWebpage(Url);
            byte[] arrayP = Encoding.UTF8.GetBytes(resultHtmlP);
            container.SaleReport = arrayP;
        }
    }
}