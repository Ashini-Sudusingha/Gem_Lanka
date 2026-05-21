/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Store;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "AdminLoadProductList", urlPatterns = {"/AdminLoadProductList"})
public class AdminLoadProductList extends HttpServlet {
   
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        
         User user = (User) request.getSession().getAttribute("user");
    
        // System.out.println(user);
         
    
        Criteria c1 = s.createCriteria(Store.class);
        c1.add(Restrictions.eq("user", user));
       Store store = (Store) c1.uniqueResult();
      
        System.out.println(store);
 
        Criteria c2 = s.createCriteria(Product.class);
       c2.add(Restrictions.eq("store", store));
        List<Product> productList = c2.list();

     

        responseObject.add("productList", gson.toJsonTree(productList));
        responseObject.addProperty("status", true);
      //  System.out.println(gson.toJson(responseObject));

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }
        
  
}
