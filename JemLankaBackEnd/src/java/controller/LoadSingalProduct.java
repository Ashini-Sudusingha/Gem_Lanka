package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.HibernateUtil;
import hibernate.Product;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadSingalProduct", urlPatterns = {"/LoadSingalProduct"})
public class LoadSingalProduct extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        //get Parametter
        String productId = request.getParameter("id");
      
        if (Util.isInteger(productId)) {
       
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            try {
                Product product = (Product) s.get(Product.class, Integer.valueOf(productId));
                    
                if (product.getActive().getState().equals("Active")) {
                    System.out.println("equal");
                    product.getStore().setEmail(null);
                    product.getStore().setPassword(null);
                    product.getStore().setLicense(null);
                    product.getStore().setId(-1);
                    product.getStore().setCreated_at(null);

                    // similer-product-data
                    Criteria c1 = s.createCriteria(Category.class);
                    c1.add(Restrictions.eq("type", product.getCat().getType()));
                    List<Category> categoryList = c1.list();

                    Criteria c2 = s.createCriteria(Product.class);
                    c2.add(Restrictions.in("cat", categoryList));
                    c2.add(Restrictions.ne("id", product.getId()));
                    c2.setMaxResults(6);
                    List<Product> productList = c2.list();

                    for (Product pr : productList) {
                        pr.getStore().setEmail(null);
                        pr.getStore().setPassword(null);
                        pr.getStore().setLicense(null);
                        pr.getStore().setId(-1);
                        pr.getStore().setCreated_at(null);
                    }

                    // similer-product-data-end
                    responseObject.add("product", gson.toJsonTree(product));
                    responseObject.add("productList", gson.toJsonTree(productList));
                    responseObject.addProperty("status", true);
                } else {
                    responseObject.addProperty("message", "Product Not Found 1!");
                }
            } catch (Exception e) {
               // responseObject.addProperty("message", "Product Not Found 2!");
               e.printStackTrace();
            }
        }

        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        System.out.println(toJson);
        response.getWriter().write(toJson);

    }
}
