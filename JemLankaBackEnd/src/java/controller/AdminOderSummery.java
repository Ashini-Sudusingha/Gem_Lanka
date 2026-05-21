/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.Orders;
import hibernate.Product;
import hibernate.Store;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "AdminOderSummery", urlPatterns = {"/AdminOderSummery"})
public class AdminOderSummery extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        User user = (User) request.getSession().getAttribute("user");

        Criteria c1 = s.createCriteria(Store.class);
        c1.add(Restrictions.eq("user", user));
        Store store = (Store) c1.uniqueResult();

        if (store != null) {
      

            Criteria c2 = s.createCriteria(Orders.class);
            c2.add(Restrictions.eq("user", user));
            List<Order> oderList = c2.list();

            List<OrderItems> orderProductList = new ArrayList<>();

            Criteria c3 = s.createCriteria(OrderItems.class);
            List<OrderItems> orderIteamList = c3.list();
         
            for (OrderItems items : orderIteamList) {

                if (Objects.equals(items.getOrders().getUser().getId(), user.getId())) {
                    items.getOrders().getUser().setEmail(null);
                    items.getOrders().getUser().setPassword(null);
                    items.getOrders().getUser().setMobile(null);
                    orderProductList.add(items);
                    System.out.println(items);
                }
            }

            responseObject.add("orderProductList", gson.toJsonTree(orderProductList));
            responseObject.addProperty("status", true);
            System.out.println(gson.toJson(responseObject));
        }
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

}
