
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.ActiveState;
import hibernate.Category;
import hibernate.Clarity;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Shape;
import hibernate.States;
import hibernate.Store;
import hibernate.Treatment;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;



@WebServlet(name = "LoadProductUpdateModel", urlPatterns = {"/LoadProductUpdateModel"})
public class LoadProductUpdateModel extends HttpServlet {

     @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject orderId = gson.fromJson(request.getReader(), JsonObject.class);

        int id = orderId.get("productId").getAsInt();
        System.out.println(id);

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //   User user = (User) s.get(User.class, 1);
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {

            Product product = (Product) s.get(Product.class, id);

            responseObject.add("oderList", gson.toJsonTree(product));
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
        System.out.println("enava");
        String title = request.getParameter("productName");
        String categoryId = request.getParameter("categoryId");
        String shapeId = request.getParameter("shapeId");
        String colorId = request.getParameter("colorId");
        String calarityId = request.getParameter("calarityId");
        String treatmentId = request.getParameter("treatmentId");
        String description = request.getParameter("description");
        String weight = request.getParameter("weight");
        String length = request.getParameter("length");
        String Width = request.getParameter("Width");
        String hight = request.getParameter("hight");
        String qty = request.getParameter("stockquantity");
        String states = request.getParameter("states");
        String sellprice = request.getParameter("sellprice");
        String cost = request.getParameter("cost");
        System.out.println(states);

        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        

        //validation
//        if (request.getSession().getAttribute("user") == null) {
//            responseObject.addProperty("message", "Please sign in!");
//        } else if (request.getSession().getAttribute("store") == null) {
//            responseObject.addProperty("message", "Please sign in!");
        if (title.isEmpty()) {
            responseObject.addProperty("message", "Product title can not be empty");
        } else if (!Util.isInteger(categoryId)) {
            responseObject.addProperty("message", "Invalid brand!");
        } else if (Integer.parseInt(categoryId) == 0) {
            responseObject.addProperty("message", "Please select a brand!");
        } else if (!Util.isInteger(shapeId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(shapeId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (!Util.isInteger(calarityId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(calarityId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (!Util.isInteger(colorId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(colorId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (!Util.isInteger(treatmentId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(treatmentId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (!Util.isInteger(states)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(states) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Product description can not be empty");
        } else if (weight.isEmpty()) {
            responseObject.addProperty("message", "Please enter weight!");
        } else if (!Util.isDouble(weight)) {
            responseObject.addProperty("message", "Invalid price");
        } else if (length.isEmpty()) {
            responseObject.addProperty("message", "Please enter weight!");
        } else if (!Util.isDouble(length)) {
            responseObject.addProperty("message", "Invalid price");
        } else if (Width.isEmpty()) {
            responseObject.addProperty("message", "Please enter weight!");
        } else if (!Util.isDouble(Width)) {
            responseObject.addProperty("message", "Invalid price");
        } else if (hight.isEmpty()) {
            responseObject.addProperty("message", "Please enter weight!");
        } else if (!Util.isDouble(hight)) {
            responseObject.addProperty("message", "Invalid hight");
        } else if (!Util.isDouble(sellprice)) {
            responseObject.addProperty("message", "Invalid price");
        } else if (Double.parseDouble(sellprice) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0");
//        } else if (!Util.isInteger(qty)) {
//            responseObject.addProperty("message", "Invalid quantity");
        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Quantity must be greater than 0");
        } else if (part1.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image one is required");
        } else if (part2.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image two is required");
        } else if (part3.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image three is required");
        } else {

            Category category = (Category) s.get(Category.class, Integer.valueOf(categoryId));
            if (category == null) {
                responseObject.addProperty("message", "Please select a valid Brand Name!");
            } else {
                Shape shape = (Shape) s.get(Shape.class, Integer.valueOf(shapeId));
                if (shape == null) {
                    responseObject.addProperty("message", "Please select a valid Shape!");
                } else {
                    Clarity clarity = (Clarity) s.get(Clarity.class, Integer.valueOf(calarityId));
                    if (clarity == null) {
                        responseObject.addProperty("message", "Please select a valid clarity!");
                    } else {
                        Color color = (Color) s.get(Color.class, Integer.valueOf(colorId));
                        if (color == null) {
                            responseObject.addProperty("message", "Please select a valid Color!");
                        } else {
                            Treatment treatment = (Treatment) s.get(Treatment.class, Integer.valueOf(treatmentId));
                            if (treatment == null) {
                                responseObject.addProperty("message", "Please select a valid treatment!");
                            } else {
                                States status = (States) s.get(States.class, Integer.valueOf(states));
                                System.out.println(status.getId());
                                if (status == null) {
                                    responseObject.addProperty("message", "Please select a valid treatment!");
                                } else {

                                    ActiveState active = (ActiveState) s.get(ActiveState.class, 1);

                                    System.out.println();
                                    Product p = new Product();
                                    p.setCat(category);
                                    p.setTitle(title);
                                    p.setDescription(description);
                                    p.setPrice(Double.parseDouble(sellprice));
                                    p.setCost(Double.parseDouble(cost));
                                    p.setColor(color);
                                    p.setClarity(clarity);
                                    p.setTreatment(treatment);
                                    p.setShape(shape);
                                    p.setActive(active);
                                    p.setStatus(status);
                                    p.setWeight(Double.parseDouble(weight));
                                    p.setWidth(Double.parseDouble(Width));
                                    p.setHight(Double.parseDouble(hight));
                                    p.setLength(Double.parseDouble(length));

                                    p.setQty(Integer.parseInt(qty));

                                    //  User user = (User) request.getSession().getAttribute("user"); session eka verifiy karanna 
                                    //store eka verify karanna 
                                    Criteria c1 = s.createCriteria(User.class);
                                    c1.add(Restrictions.eq("email", "ashinisudusinghe@gmail.com"));
                                    User u1 = (User) c1.uniqueResult();

                                    Criteria c2 = s.createCriteria(Store.class);
                                    c2.add(Restrictions.eq("email", "luckgem@gmail.com"));
                                    Store st1 = (Store) c2.uniqueResult();

                                    User checkuser = st1.getUser();
                                    System.out.println(checkuser.getEmail());
                                    System.out.println(u1.getEmail());
                                    if (checkuser.getEmail().equals(u1.getEmail())) {
                                        p.setStore(st1);
                                        p.setCreated_at(new Date());

                                         s.update(p);
                                        s.beginTransaction().commit();
                                        s.close();
                                     
                                        responseObject.addProperty("status", true);

                                    } else {

                                        responseObject.addProperty("message", "User and Store anot match!");
                                    }

                                }
                            }
                        }
                    }
                }

            }
        }

        //send response
        Gson gson = new Gson();
        response.setContentType(
                "application/json");
        response.getWriter().write(gson.toJson(responseObject));
        //send response

    }

}



