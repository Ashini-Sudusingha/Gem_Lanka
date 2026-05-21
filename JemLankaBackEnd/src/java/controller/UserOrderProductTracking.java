package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(urlPatterns = {"/UserOrderProductTracking"})
public class UserOrderProductTracking extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject orderId = gson.fromJson(request.getReader(), JsonObject.class);

        int id = orderId.get("orderId").getAsInt();
        System.out.println(id);

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //   User user = (User) s.get(User.class, 1);
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {

            Orders order = (Orders) s.get(Orders.class, id);

            Criteria c1 = s.createCriteria(OrderItems.class);
            c1.add(Restrictions.eq("orders", order));
            List<OrderItems> itemList = c1.list();

            responseObject.add("oderList", gson.toJsonTree(itemList));
            responseObject.addProperty("status", true);
            System.out.println(gson.toJson(responseObject));
        }
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject orderId = gson.fromJson(request.getReader(), JsonObject.class);

        int id = orderId.get("orderId").getAsInt();
        System.out.println(id);

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        Transaction tr = s.beginTransaction();

        OrderStatus status = (OrderStatus) s.get(OrderStatus.class, 3);

        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {

            Orders order = (Orders) s.get(Orders.class, id);

            Criteria c1 = s.createCriteria(OrderItems.class);
            c1.add(Restrictions.eq("orders", order));
            List<OrderItems> itemList = c1.list();

            for (OrderItems items : itemList) {
                items.setOrderStatus(status);
                s.update(items);

            }
            tr.commit();

            responseObject.addProperty("status", true);
            System.out.println(gson.toJson(responseObject));
        }
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

}
