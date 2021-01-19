using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;

namespace APIPOS.App_Start
{
    public class AuthorizeActionFilterAttribute : System.Web.Mvc.ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpSessionStateBase session = filterContext.HttpContext.Session;
            Controller controller = filterContext.Controller as Controller;

            if (controller != null)
            {
                if (session["UserName"] == null)
                {
                    filterContext.Result = new EmptyResult();
                    controller.HttpContext.Response.Redirect("../Login/Login");
                }
            }

            base.OnActionExecuting(filterContext);
        }
    }
}