package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Mail;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SingUp", urlPatterns = {"/SingUp"})
public class SingUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject user = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = user.get("firstName").getAsString();
        String lastName = user.get("lastName").getAsString();
        final String email = user.get("email").getAsString();//inner class ekaka use vena nisa
        final String mobile = user.get("mobile").getAsString();//inner class ekaka use vena nisa
        String password = user.get("password").getAsString();
        String confirmpassword = user.get("confirmpassword").getAsString();
        //send response
        JsonObject responceObject = new JsonObject();
        responceObject.addProperty("status", false);

        //verification
        if (firstName.isEmpty()) {
            responceObject.addProperty("message", "First name can not be empty!");
        } else if (lastName.isEmpty()) {
            responceObject.addProperty("message", "Last name can not be empty!");
        } else if (email.isEmpty()) {
            responceObject.addProperty("message", "email can not be empty!");
        } else if (!Util.isEmailValid(email)) {
            responceObject.addProperty("message", "Invalid email!");
        } else if (mobile.isEmpty()) {
            responceObject.addProperty("message", "mobile can not be empty!");
//        } else if (!Util.isMobilevalid(mobile)) {
//            System.out.println(mobile);
//            responceObject.addProperty("message", "Invalid mobile!");
        } else if (password.isEmpty()) {
            responceObject.addProperty("message", "Empty password!");
        } else if (!Util.isPasswordValid(password)) {
            responceObject.addProperty("message", "Invalid Password! please add strong password!");
        } else if (confirmpassword.isEmpty()) {
            responceObject.addProperty("message", "Empty password!");
        } else if (!Util.isPasswordValid(confirmpassword)) {
            responceObject.addProperty("message", "Invalid Password! please add strong password!");
        } else if (!password.equals(confirmpassword)) {
            System.out.println("methana veradi password");
            responceObject.addProperty("message", "Invalid Password! passwords not match!");
        } else {
            //Hibernate save
            SessionFactory sf = hibernate.HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));
            criteria.add(Restrictions.eq("mobile", mobile));

            if (!criteria.list().isEmpty()) {
                responceObject.addProperty("message", "This user already exsist!");
            } else {              
                User u = new User();
                u.setFirst_name(firstName);
                u.setLast_name(lastName);
                u.setEmail(email);
                u.setMobile(mobile);
                u.setPassword(password);
                
                //genarate verification cade
                final String verificatiocode = Util.generateCode();
               
                u.setVerification("Unverified");
                u.setOtp(verificatiocode);
                //genarate verification cade
            
                u.setCreated_at(new Date());
            
                s.save(u);
                s.beginTransaction().commit();
                //hibernate save

                //send mail
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        Mail.sendMail(email, "SamrtThread - Verification", "<h1>" + verificatiocode + "</h1>");
                    }
                }).start();
                //send mail    

                //session management
                HttpSession ses = request.getSession();
                ses.setAttribute("email", email);
                //session management

                //change status true
                responceObject.addProperty("status", true);
                responceObject.addProperty("message", "Register success please check your email for the verification code");

            }
            s.close();
        }
        String responceTest = gson.toJson(responceObject);
        response.setContentType("application/json");
        response.getWriter().write(responceTest);
    }

}
