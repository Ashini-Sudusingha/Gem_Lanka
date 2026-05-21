package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Orders;
import hibernate.User;
import java.io.IOException;
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
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UserOderTracking", urlPatterns = {"/UserOderTracking"})
public class UserOderTracking extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //User user = (User) s.get(User.class, 1);

          User user = (User) request.getSession().getAttribute("user");
        //  System.out.println(user.getEmail());
        if (user != null) {
         
            List <Orders> orderList =  new ArrayList <>();
            Criteria c1 = s.createCriteria(Orders.class);
            
           List<Orders> orderc1 = c1.list();
            
            for (Orders iteams:orderc1){
                
                if(iteams.getAddress().getUser().getId()==user.getId()){
                   orderList.add(iteams);
                }
            }
            System.out.println(orderList);
            responseObject.add("oderList", gson.toJsonTree(orderList));
            responseObject.addProperty("status", true);
            System.out.println(gson.toJson(responseObject));
        }

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }

}
