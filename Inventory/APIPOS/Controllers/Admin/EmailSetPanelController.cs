using APIPOS.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Admin
{
    [NoCache]
    public class EmailSetPanelController : Controller
    {
        // GET: EmailSetPanel
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }
    }
}