package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "MyProfile", urlPatterns = {"/MyProfile"})
public class MyProfile extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("profile ekata enava ");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();

        HttpSession ses = request.getSession(false);
        if (ses != null && ses.getAttribute("user") != null) {
            System.out.println("session eka thiyanava");
            User user = (User) ses.getAttribute("user");
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("status", true);
            responseObject.addProperty("firstName", user.getFirst_name());
            responseObject.addProperty("lastName", user.getLast_name());
            responseObject.addProperty("password", user.getPassword());
            responseObject.addProperty("email", user.getEmail());
            responseObject.addProperty("mobile", user.getMobile());

            String since = user.getCreated_at() != null 
                    ? new SimpleDateFormat("MMM yyyy").format(user.getCreated_at()) 
                    : "Member";
            responseObject.addProperty("since", since);

            Session s = null;
            try {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                s = sf.openSession();
                Criteria c = s.createCriteria(Address.class);
                c.add(Restrictions.eq("user", user));
                List<Address> addressList = c.list();
                if (addressList != null && !addressList.isEmpty()) {
                    System.out.println("address ekak thiyanava");
                    responseObject.add("addressList", gson.toJsonTree(addressList));
                } else {
                    System.out.println("address ne");
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (s != null && s.isOpen()) {
                    s.close();
                }
            }

            String toJson = gson.toJson(responseObject);
            response.getWriter().write(toJson);
        } else {
            System.out.println("session ne - unauthorized");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            JsonObject errorObject = new JsonObject();
            errorObject.addProperty("status", false);
            errorObject.addProperty("message", "User not logged in. Please sign in first.");
            response.getWriter().write(gson.toJson(errorObject));
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        try {
            JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);
            if (userData == null) {
                responseObject.addProperty("message", "Invalid request data!");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            String firstName = userData.has("firstName") && !userData.get("firstName").isJsonNull() ? userData.get("firstName").getAsString().trim() : "";
            String lastName = userData.has("lastName") && !userData.get("lastName").isJsonNull() ? userData.get("lastName").getAsString().trim() : "";
            String currentPassword = userData.has("currentPassword") && !userData.get("currentPassword").isJsonNull() ? userData.get("currentPassword").getAsString() : "";
            String newPassword = userData.has("newPassword") && !userData.get("newPassword").isJsonNull() ? userData.get("newPassword").getAsString() : "";
            String confirmPassword = userData.has("confirmPassword") && !userData.get("confirmPassword").isJsonNull() ? userData.get("confirmPassword").getAsString() : "";

            if (firstName.isEmpty()) {
                responseObject.addProperty("message", "First Name cannot be empty!");
            } else if (lastName.isEmpty()) {
                responseObject.addProperty("message", "Last Name cannot be empty!");
            } else {
                HttpSession ses = request.getSession(false);
                if (ses == null || ses.getAttribute("user") == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    responseObject.addProperty("message", "Session expired! Please sign in again.");
                    response.getWriter().write(gson.toJson(responseObject));
                    return;
                }

                User sessionUser = (User) ses.getAttribute("user");

                // Validate current password if password change is requested or required
                if (!currentPassword.isEmpty() && !currentPassword.equals(sessionUser.getPassword())) {
                    responseObject.addProperty("message", "Current password does not match!");
                    response.getWriter().write(gson.toJson(responseObject));
                    return;
                }

                if (!newPassword.isEmpty()) {
                    if (currentPassword.isEmpty()) {
                        responseObject.addProperty("message", "Please enter your current password to set a new password!");
                        response.getWriter().write(gson.toJson(responseObject));
                        return;
                    }
                    if (!Util.isPasswordValid(newPassword)) {
                        responseObject.addProperty("message", "The password must contain at least uppercase, lowercase, number, special character and be at least 8 characters long!");
                        response.getWriter().write(gson.toJson(responseObject));
                        return;
                    }
                    if (newPassword.equals(currentPassword)) {
                        responseObject.addProperty("message", "The new password cannot be the same as the current password!");
                        response.getWriter().write(gson.toJson(responseObject));
                        return;
                    }
                    if (confirmPassword.isEmpty()) {
                        responseObject.addProperty("message", "Please confirm your new password!");
                        response.getWriter().write(gson.toJson(responseObject));
                        return;
                    }
                    if (!confirmPassword.equals(newPassword)) {
                        responseObject.addProperty("message", "Confirmed password does not match the new password!");
                        response.getWriter().write(gson.toJson(responseObject));
                        return;
                    }
                }

                Session s = null;
                org.hibernate.Transaction tx = null;
                try {
                    SessionFactory sf = HibernateUtil.getSessionFactory();
                    s = sf.openSession();
                    tx = s.beginTransaction();

                    Criteria c = s.createCriteria(User.class);
                    c.add(Restrictions.eq("email", sessionUser.getEmail()));
                    List<User> list = c.list();
                    if (!list.isEmpty()) {
                        User dbUser = list.get(0);
                        dbUser.setFirst_name(firstName);
                        dbUser.setLast_name(lastName);
                        if (!newPassword.isEmpty()) {
                            dbUser.setPassword(newPassword);
                        }

                        s.update(dbUser);
                        tx.commit();

                        // Update session
                        ses.setAttribute("user", dbUser);

                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Profile details updated successfully!");
                    } else {
                        responseObject.addProperty("message", "User not found in database!");
                    }
                } catch (Exception e) {
                    if (tx != null) tx.rollback();
                    e.printStackTrace();
                    responseObject.addProperty("message", "Database error occurred while updating profile!");
                } finally {
                    if (s != null && s.isOpen()) {
                        s.close();
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            responseObject.addProperty("message", "An unexpected error occurred!");
        }

        response.getWriter().write(gson.toJson(responseObject));
    }

}
