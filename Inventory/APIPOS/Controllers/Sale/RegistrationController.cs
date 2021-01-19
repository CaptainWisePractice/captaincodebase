using APIPOS.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers.Sale
{
    [NoCache]
    public class RegistrationController : Controller
    {
        // GET: Registration
        [AuthorizeActionFilter]
        public ActionResult Registration()
        {
            return View();
        }
    }
}