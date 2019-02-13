using React_Onboarding_Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding_Project.Controllers
{
    public class StoreController : Controller
    {
        Onborading_dbEntities db = new Onborading_dbEntities();
        // GET: Store
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetStoreData()
        {
            List<StoreViewModel> SaleList = db.Store.Select(x => new StoreViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address

            }).ToList();
            return Json(SaleList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult InsertDataInDatabase(StoreViewModel model)
        {
            var result = false;
            //check if the customer is already existing  
            Store store_isExisting = db.Store.SingleOrDefault(x => x.Name == model.Name);
            if (store_isExisting == null)
            {
                Store store = new Store();
                store.Name = model.Name;
                store.Address = model.Address;

                db.Store.Add(store);
                db.SaveChanges();
                result = true;

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateDataInDatabase(StoreViewModel model)
        {
            var result = false;

            //if id >0, update 

            Store store = db.Store.SingleOrDefault(x => x.Id == model.Id);
            Store store_validate = db.Store.SingleOrDefault(x => x.Name == model.Name && x.Id != model.Id);

            if (store_validate == null)
            {
                store.Name = model.Name;
                store.Address = model.Address;

                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }


        }

        public JsonResult DeleteStoreRecord(int StoreId)
        {
            bool result = false;
            Store store = db.Store.SingleOrDefault(x => x.Id == StoreId);
            ProductSold productsold = db.ProductSold.FirstOrDefault(x => x.StoreId == StoreId);

            // check this customer data is existing and not be used in the productsold table  
            if (store != null && productsold ==null)
            {
                db.Store.Remove(store);
                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (productsold != null)
            {
                return Json("use", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }


        }
    }
}