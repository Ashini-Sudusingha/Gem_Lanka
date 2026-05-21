/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
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
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author ASUS
 */
@WebServlet(name = "CartIteamsLoad", urlPatterns = {"/CartIteamsLoad"})
public class CartIteamsLoad extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("m1");
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria cmain = s.createCriteria(User.class);//mama user athin dila thiyenne 
        cmain.add(Restrictions.eq("id", 1));
        List<User> userList = cmain.list();
        User user =null;
        for(User users:userList){
           user  = users;
        }
        System.out.println(user);
//        User user = (User) request.getSession().getAttribute("user");
        if (user != null) { //DB Cart
System.out.println("enava");
            Criteria c1 = s.createCriteria(Cart.class);
            c1.add(Restrictions.eq("user", user));//menuvali dunna man
            List<Cart> cartList = c1.list();
            if (cartList.isEmpty()) {
                responseObject.addProperty("message", "Your cart is empty...");
            } else {
                System.out.println("enava cart product thiyanava");
                for (Cart cart : cartList) {
                    //   cart.getProduct().setS(null);
                    cart.setUser(null);
                }
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Cart items successfully loded");
                responseObject.add("cartItems", gson.toJsonTree(cartList));
            }
        } else {//sessionCart
            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");
            if (sessionCarts != null) {
                if (sessionCarts.isEmpty()) {
                    responseObject.addProperty("message", "Your cart is empty...");
                } else {
                    for (Cart sessionCart : sessionCarts) {
                        //     sessionCart.getProduct().setUser(null);
                        sessionCart.setUser(null);
                    }
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Cart items successfully loded");
                    responseObject.add("cartItems", gson.toJsonTree(sessionCarts));
                }
            } else {
                responseObject.addProperty("message", "Your cart is empty...");
            }
        }
        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }


}
