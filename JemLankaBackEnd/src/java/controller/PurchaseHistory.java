package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
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
@WebServlet(name = "PurchaseHistory", urlPatterns = {"/PurchaseHistory"})
public class PurchaseHistory extends HttpServlet {

    private static final int DELIVERD = 3;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        User user = (User) request.getSession().getAttribute("user");

        //oder
        Criteria c1 = s.createCriteria(Orders.class);
        c1.add(Restrictions.eq("user", user));
        List<Orders> orderList = c1.list();
            System.out.println(orderList);
 
 OrderStatus orderStatus = (OrderStatus) s.get(OrderStatus.class, DELIVERD);
        
        //order state

        Criteria c2 = s.createCriteria(OrderItems.class);
        c2.add(Restrictions.in("orders", orderList));
    c2.add(Restrictions.eq("orderStatus.id", orderStatus.getId()));
        List<OrderItems> productList = c2.list();
        
        System.out.println(productList);

        responseObject.add("productList", gson.toJsonTree(productList));
        responseObject.addProperty("status", true);
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

}
