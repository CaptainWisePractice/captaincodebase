using APIPOS.App_Start;
using Common;
using DAL.UserOperation;
using DAO.UserOperation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace APIPOS.Controllers
{
    [NoCache]
    public class HomeController : Controller
    {
        public List<MainMenuOperation> ObjParrentMenus = null;
        public WrapperListOfMenus _objWrapperListOfMenus = new WrapperListOfMenus();
        [AuthorizeActionFilter]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UserLogin(LoginUser userLogin)
        {
            LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
            DataTable User = _ObjLoginUserDAL.UserLoginCheck(userLogin.UserName, userLogin.password);
            if (User.Rows.Count > 0)
            {
                UserSession.SetUserData(User);
                ViewBag.msg = "Home";
                Session["UserName"] = User.Rows[0]["UserName"].ToString();
                Session["BranchId"] = User.Rows[0]["BranchId"].ToString();
                Session["Password"] = User.Rows[0]["Password"].ToString();

                //HttpCookie cookie = new HttpCookie("usercookie");
                //cookie.Value = User.Rows[0]["UserName"].ToString();
                //cookie.Domain = Request.UserHostAddress;
                //cookie.Expires = DateTime.Now.AddDays(1);
                //Response.Cookies.Add(cookie);

                if (User.Rows[0]["UserName"].ToString().ToUpper() != "ADMIN")
                {
                    #region "Comment Line" 
                    //    DataTable dt = ObjUserManagementDAL.GetUserImage(User.Rows[0]["EMP_CODE"].ToString());
                    //    if (dt.Rows.Count > 0)
                    //    {

                    //        byte[] image = (byte[])dt.Rows[0]["Attachment"];
                    //        string fileName = System.Web.HttpContext.Current.Request.MapPath("~/Content/EmpImages/") + "emp" +
                    //                          User.Rows[0]["EMP_CODE"].ToString() + ".jpg";
                    //        Session["UserImage"] = "/Content/EmpImages/" + "emp" + User.Rows[0]["EMP_CODE"].ToString() + ".jpg";
                    //        Session["EmpName"] = dt.Rows[0]["EMP_ENAME"].ToString();
                    //        try
                    //        {
                    //            System.IO.File.WriteAllBytes(fileName, image);
                    //        }
                    //        catch (Exception)
                    //        {

                    //            //  throw;
                    //        }
                    //    }
                    #endregion
                }
                // return RedirectToAction("Index", "Home");
                return Json(User == null ? "false" : "true", JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json("false", JsonRequestBehavior.AllowGet);

            }
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Login","Login");
        }
        [ChildActionOnly]
        public ActionResult DynamicMenuLoad()
        {
           // string UserName = Request.Cookies["usercookie"].Value;//Convert.ToBase64String(MachineKey.Protect(Encoding.UTF8.GetBytes(HttpContext.Request.Cookies[0].Value)));
            try
            {
                LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
                List<MainMenuOperation> MenuOperationList = new List<MainMenuOperation>();
                var objListOfMenues = _ObjLoginUserDAL.getParentMenu(UserSession.getUserName()).DataTableToList<ListOfMenus>().ToList();
                if (objListOfMenues != null)
                { 
                    ObjParrentMenus = objListOfMenues.ToList().Where(x => x.ParantMenuId == 0).ToList().Select(p => new MainMenuOperation
                    {
                        MenuId = p.MenuId,
                        MenuName = p.MenuName,
                        ControllerName = p.ControllerName,
                        ViewName = p.ViewName,
                        IconClass = p.IconClass,
                        ChildMenuNameList = objListOfMenues.Where(m => m.ParantMenuId == p.MenuId).ToList()
                      .Select(m => new ChildMenuName
                      {
                          MenuIdChild = m.MenuId,
                          ManuName_Child = m.MenuName,
                          ControllerName = m.ControllerName,
                          ViewName = m.ViewName,
                          ChildIconClass = m.IconClass,
                      }).ToList(),
                    }).ToList();
                 }

            }
            catch (Exception ex)
            {
               // throw ex;
                Session.Clear();
                return RedirectToAction("Login", "Login");
            }
            return PartialView("~/Views/Shared/_LayoutDynamicManuLoad.cshtml", ObjParrentMenus);
        }
        public JsonResult loadFlatmenu()
        {
            string menu = "Home";
            LoginUserDAL _ObjLoginUserDAL = new LoginUserDAL();
            _objWrapperListOfMenus = new WrapperListOfMenus();
            _objWrapperListOfMenus = _ObjLoginUserDAL.loadFlatmenu(menu);
            return Json(_objWrapperListOfMenus, JsonRequestBehavior.AllowGet);
        }

    }
}
