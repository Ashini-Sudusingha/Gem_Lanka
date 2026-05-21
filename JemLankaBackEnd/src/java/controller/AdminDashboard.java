package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.Orders;
import hibernate.Store;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
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

@WebServlet(name = "AdminDashboard", urlPatterns = {"/AdminDashboard"})
public class AdminDashboard extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        User user = (User) request.getSession().getAttribute("user");
        // User user = (User) s.get(User.class, 1);

        Criteria c1 = s.createCriteria(Store.class);
        c1.add(Restrictions.eq("user", user));
        Store store = (Store) c1.uniqueResult();

        if (store != null) {

            LocalDate today = LocalDate.now();

            int ordercount = 0;
            Criteria c2 = s.createCriteria(Orders.class);
            c2.add(Restrictions.eq("user", user));
            c2.add(Restrictions.eq("createdAt", java.sql.Date.valueOf(today)));
            List<Orders> oderList = c2.list();
            for (Orders o1 : oderList) {
                ordercount += 1;
                responseObject.addProperty("ordercount", String.valueOf(ordercount));
            }

            int allOrderCount = 0;
            int total = 0;
            int itemCount = 0;
            int totalCost = 0;
            Criteria c3 = s.createCriteria(OrderItems.class);
            List<OrderItems> orderIteamList = c3.list();

            for (OrderItems items : orderIteamList) {
                Orders order = items.getOrders();

               boolean sameUser = order.getUser().getId() == user.getId();
                boolean sameDate = order.getCreatedAt().equals(java.sql.Date.valueOf(today));

                if (sameUser && sameDate) {
                    itemCount += items.getQty();
                    total += items.getQty() * items.getProduct().getPrice();
                    totalCost += items.getQty() * items.getProduct().getCost();

                    System.out.println(items);
                }

            }
            //  System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            Criteria c4 = s.createCriteria(OrderItems.class);
            c3.add(Restrictions.eq("orderStatus", 1));
            List<OrderItems> haveToShippList = c4.list();

            int Totalrev = total - totalCost;
            responseObject.add("haveToShippList", gson.toJsonTree(haveToShippList));
            responseObject.addProperty("total", String.valueOf(total));
            responseObject.addProperty("itemCount", String.valueOf(itemCount));
            responseObject.addProperty("Totalrev", String.valueOf(Totalrev));
            responseObject.addProperty("TotalOrders", String.valueOf(allOrderCount));
            responseObject.addProperty("dayOrder", String.valueOf(ordercount));
            responseObject.addProperty("status", true);
            System.out.println(gson.toJson(responseObject));
        }
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }
}
