using React_Onboarding_Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding_Project.Controllers
{
    public class ProductController : Controller
    {
        Onborading_dbEntities db = new Onborading_dbEntities();
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetProductData()
        {
            List<ProductViewModel> SaleList = db.Product.Select(x => new ProductViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price

            }).ToList();
            return Json(SaleList, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult InsertDataInDatabase(ProductViewModel model)
        {
            var result = false;

            //check if the customer is already existing  
            Product product_isExisting = db.Product.SingleOrDefault(x => x.Name == model.Name);
            if (product_isExisting == null)
            {
                Product product = new Product();
                product.Name = model.Name;
                product.Price = (double)model.Price;

                db.Product.Add(product);
                db.SaveChanges();
                result = true;



                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }


        }

        public JsonResult UpdateDataInDatabase(ProductViewModel model)
        {
            var result = false;

            //if id >0, update 

            Product cust = db.Product.SingleOrDefault(x => x.Id == model.Id);
            Product product_validate = db.Product.SingleOrDefault(x => x.Name == model.Name && x.Id != model.Id);

            if (product_validate == null)
            {
                cust.Name = model.Name;
                cust.Price = (double)model.Price;

                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }


        }

        public JsonResult DeleteProductRecord(int ProductId)
        {
            bool result = false;
            Product product = db.Product.SingleOrDefault(x => x.Id == ProductId);
            ProductSold productsold = db.ProductSold.FirstOrDefault(x => x.ProductId == ProductId);

            // check this customer data is existing and not be used in the productsold table  
            if (product != null && productsold == null)
            {
                db.Product.Remove(product);
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