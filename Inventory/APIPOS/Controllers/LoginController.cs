using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace APIPOS.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        [ActionName("Login")]
        public ActionResult Login()
        {
            if (UserSession.IsSessionActive())
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                if (TempData["msg"] != null)
                {
                    ViewBag.msg = TempData["msg"].ToString();
                }
                return View();
            }
        }
    }
}