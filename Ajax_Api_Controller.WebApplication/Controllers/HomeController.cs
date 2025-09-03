using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Ajax_Api_Controller.WebApplication.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }
        
    }
}
