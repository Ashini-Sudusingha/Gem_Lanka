package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.ActiveState;
import hibernate.BusinessCat;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Position;
import hibernate.Store;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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

@WebServlet(name = "CreateStore", urlPatterns = {"/CreateStore"})
public class CreateStore extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String businessName = request.getParameter("bussName");
        String bussinessemail = request.getParameter("email");
        String mobile = request.getParameter("mobile");
        String categoryId = request.getParameter("categoryId");
        String positionId = request.getParameter("positionId");
        String password = request.getParameter("password");
        String comfirmPassword = request.getParameter("comfirmPassword");

        Part part1 = request.getPart("liseImage");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (request.getSession().getAttribute("user") == null) {
            responseObject.addProperty("message", "Please sign in!");
        } else if (businessName.isEmpty()) {
            responseObject.addProperty("message", "Product title can not be empty");

        } else if (!Util.isInteger(categoryId)) {
            responseObject.addProperty("message", "Invalid category!");
        } else if (Integer.parseInt(categoryId) == 0) {
            responseObject.addProperty("message", "Please select a category!");
        } else if (!Util.isInteger(positionId)) {
            responseObject.addProperty("message", "Invalid position!");
        } else if (Integer.parseInt(positionId) == 0) {
            responseObject.addProperty("message", "Please select a position!");
        } else if (bussinessemail.isEmpty()) {
            responseObject.addProperty("message", "Business email can not be empty");
        } else if (!Util.isEmailValid(bussinessemail)) {
            responseObject.addProperty("message", "Invalid email!");
        } else if (mobile.isEmpty()) {
            responseObject.addProperty("message", "Business mobile can not be empty");
        } else if (!Util.isMobileValid(mobile)) {
            responseObject.addProperty("message", "Invalid mobile!");
        } else if (!password.isEmpty() && !Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "The password must contains at least uppercase, lowecase,"
                    + " number, special character and to be minimum eight characters long!");
        } else if (!comfirmPassword.isEmpty() && !Util.isPasswordValid(comfirmPassword)) {
            responseObject.addProperty("message", "The password must contains at least uppercase, lowecase,"
                    + " number, special character and to be minimum eight characters long!");
        } else if (!password.equals(comfirmPassword)) {
            responseObject.addProperty("message", "Confirmed password does not matching entered new password!");
        } else if (part1.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image three is required");
        } else {

            BusinessCat busicat = (BusinessCat) s.get(BusinessCat.class, Integer.valueOf(categoryId));
            if (busicat == null) {
                responseObject.addProperty("message", "Please select a valid business category!");
            } else {
                Position posi = (Position) s.get(Position.class, Integer.parseInt(positionId));
                if (posi == null) {
                    responseObject.addProperty("message", "Please select a valid position!");
                } else {

                    User user = (User) request.getSession().getAttribute("user");

                    ActiveState as = new ActiveState();
                    as.setId(1);
                    as.setState("Active");

                    Store st = new Store();
                    st.setName(businessName);
                    st.setEmail(bussinessemail);
                    st.setMobile(mobile);
                    st.setLicense("Verified");
                    st.setBusinessCat(busicat);
                    st.setPosition(posi);
                    st.setUser(user);
                    st.setActiveState(as);
                    st.setCreated_at(new Date());

                    int id = (int) s.save(st);
                    s.beginTransaction().commit();
                    s.close();
                    
                    String basePath = "D:" + File.separator + "xampp03" + File.separator + "htdocs" + File.separator + "jemLanka" + File.separator + "license";
                    String storeId = String.valueOf(id);

                    File productFolder = new File(basePath, storeId  );
                    if (!productFolder.exists()) {
                        productFolder.mkdirs();
                    }

                    File file1 = new File(productFolder, "file1.png");
                    Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

              

                    responseObject.addProperty("status", true);
                }
            }

        }

        //send response
        Gson gson = new Gson();
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
        //send response

    }

}
