package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "VerifyEmail", urlPatterns = {"/VerifyEmail"})
public class VerifyEmail extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        //send response object
        JsonObject responceObject = new JsonObject();
        responceObject.addProperty("status", false);
        System.out.println("enava");

        HttpSession ses = request.getSession(false);
        //    System.out.println(ses.getAttribute("email"));
        if (ses == null) {
            // Session doesn't exist, handle this case
            System.out.println("Session is null");
            response.sendRedirect("login.jsp"); // example
            return;
        }

        if (ses.getAttribute("email") == null) {
            responceObject.addProperty("message", "Email not found");
        } else {
            String email = ses.getAttribute("email").toString();
            JsonObject verification = gson.fromJson(request.getReader(), JsonObject.class);

            String num1 = verification.get("num1").getAsString();
            String num2 = verification.get("num2").getAsString();
            String num3 = verification.get("num3").getAsString();
            String num4 = verification.get("num4").getAsString();
            String num5 = verification.get("num5").getAsString();
            String num6 = verification.get("num6").getAsString();
            String verificationCode = num1 + num2 + num3 + num4 + num5 + num6;
            System.out.println(verificationCode);
            //serach 
            SessionFactory sf = hibernate.HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria criteria = s.createCriteria(User.class);
            criteria.add(Restrictions.eq("email", email));
            criteria.add(Restrictions.eq("verification", verificationCode));

            if (criteria.list().isEmpty()) {
                responceObject.addProperty("message", "Invalid verification code");
            } else {
                System.out.println("ekak thiyanava");
                User user = (User) criteria.list().get(0);
                user.setVerification("Verified");

                s.update(user);
                s.beginTransaction().commit();
                s.close();

                //store user in the session
                ses.setAttribute("user", user);
                //store user in the session

                responceObject.addProperty("status", true);
                responceObject.addProperty("message", "Verification successfully!");

            }
        }
        String resopceText = gson.toJson(responceObject);
        response.setContentType("application/json");
        response.getWriter().write(resopceText);
    }

}
