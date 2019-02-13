using React_Onboarding_Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding_Project.Controllers
{
    public class SaleController : Controller
    {
        Onborading_dbEntities db = new Onborading_dbEntities();
        // GET: Sale
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetSaleData()
        {
            List<SaleViewModel> SaleList = db.ProductSold.Select(x => new SaleViewModel
            {
                Id = x.Id,
                ProductId = x.Product.Id,
                ProductName = x.Product.Name,
                CustomerId = x.Customer.Id,
                CustomerName = x.Customer.Name,
                StoreId = x.Store.Id,
                StoreName = x.Store.Name,
                DataSold = x.DataSold

            }).ToList();
            return Json(SaleList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductList()
        {
            List<ProductViewModel> lstProduct = db.Product.Select(x => new ProductViewModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
            return Json(lstProduct, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerList()
        {
            List<CustomerViewModel> lstCustomer = db.Customer.Select(x => new CustomerViewModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
            return Json(lstCustomer, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStoreList()
        {
            List<StoreViewModel> lstStore = db.Store.Select(x => new StoreViewModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
            return Json(lstStore, JsonRequestBehavior.AllowGet);
        }



        public JsonResult InsertDataInDatabase(SaleViewModel model)
        {
            var result = false;
            //check if the customer is already existing  


            ProductSold prosold = new ProductSold();

            prosold.ProductId = (int)model.ProductId;
            prosold.CustomerId = (int)model.CustomerId;
            prosold.StoreId = (int)model.StoreId;
            prosold.DataSold = (DateTime)model.DataSold;
            db.ProductSold.Add(prosold);
            db.SaveChanges();
            result = true;

            return Json(result, JsonRequestBehavior.AllowGet);



        }

        public JsonResult UpdateDataInDatabase(SaleViewModel model)
        {
            var result = false;

            //if id >0, update 

            ProductSold productsold = db.ProductSold.SingleOrDefault(x => x.Id == model.Id);


            productsold.ProductId = (int)model.ProductId;
            productsold.CustomerId = (int)model.CustomerId;
            productsold.StoreId = (int)model.StoreId;
            productsold.DataSold = (DateTime)model.DataSold;

            db.SaveChanges();
            result = true;
            return Json(result, JsonRequestBehavior.AllowGet);



        }

        public JsonResult DeleteSaleRecord(int SaleId)
        {
            bool result = false;
            ProductSold productsold = db.ProductSold.SingleOrDefault(x => x.Id == SaleId);

            // check this customer data is existing and not be used in the productsold table  
            if (productsold != null)
            {
                db.ProductSold.Remove(productsold);
                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            else
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }


        }
    }
}