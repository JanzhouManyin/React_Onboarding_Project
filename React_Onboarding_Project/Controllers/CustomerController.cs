using React_Onboarding_Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace React_Onboarding_Project.Controllers
{
    public class CustomerController : Controller
    {
        Onborading_dbEntities db = new Onborading_dbEntities();
        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetCustomerData()
        {
            List<CustomerViewModel> SaleList = db.Customer.Select(x => new CustomerViewModel
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address

            }).ToList();
            return Json(SaleList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertDataInDatabase(CustomerViewModel model)
        {
            var result = false;
            //check if the customer is already existing  
            Customer customer_isExisting = db.Customer.SingleOrDefault(x => x.Name == model.Name);
            if (customer_isExisting == null)
            {
                Customer cust = new Customer();
                cust.Name = model.Name;
                cust.Address = model.Address;

                db.Customer.Add(cust);
                db.SaveChanges();
                result = true;

                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }


        }

        public JsonResult UpdateDataInDatabase(CustomerViewModel model)
        {
            var result = false;

            //if id >0, update 

            Customer cust = db.Customer.SingleOrDefault(x => x.Id == model.Id);
            Customer customer_validate = db.Customer.SingleOrDefault(x => x.Name == model.Name && x.Id != model.Id);

            if (customer_validate == null)
            {
                cust.Name = model.Name;
                cust.Address = model.Address;

                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("no", JsonRequestBehavior.AllowGet);
            }


        }


        public JsonResult DeleteCustomerRecord(int CustomerId)
        {
            bool result = false;
            Customer cust = db.Customer.SingleOrDefault(x => x.Id == CustomerId);
            ProductSold productsold = db.ProductSold.FirstOrDefault(x => x.CustomerId == CustomerId);

            // check this customer data is existing and not be used in the productsold table  

            if (cust != null && productsold == null)
            {
                db.Customer.Remove(cust);
                db.SaveChanges();
                result = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if(productsold != null)
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