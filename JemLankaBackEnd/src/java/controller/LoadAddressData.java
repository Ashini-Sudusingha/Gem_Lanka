package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.Country;
import hibernate.HibernateUtil;
import hibernate.Province;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
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

@WebServlet(name = "LoadAddressData", urlPatterns = {"/LoadAddressData"})
public class LoadAddressData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Gson gson = new Gson();
        Session s = null;
        try {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            s = sf.openSession();

            //search-city
            Criteria c1 = s.createCriteria(City.class);
            List<City> cityList = c1.list();

            //get-country
            Criteria c2 = s.createCriteria(Country.class);
            List<Country> countryList = c2.list();

            //get-province
            Criteria c3 = s.createCriteria(Province.class);
            List<Province> provinceList = c3.list();

            responseObject.add("cityList", gson.toJsonTree(cityList));
            responseObject.add("countryList", gson.toJsonTree(countryList));
            responseObject.add("provinceList", gson.toJsonTree(provinceList));
            responseObject.addProperty("status", true);

            String toJson = gson.toJson(responseObject);
            response.getWriter().write(toJson);
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to load address metadata");
            response.getWriter().write(gson.toJson(responseObject));
        } finally {
            if (s != null && s.isOpen()) {
                s.close();
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { //insert address not update
        System.out.println("enava");
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);

        int cityId = userData.get("cityId").getAsInt();
        System.out.println(cityId);
        int provinceId = userData.get("provinceId").getAsInt();
        int countryId = userData.get("countryId").getAsInt();
        String postalCode = userData.get("postalCode").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String mobile = userData.get("mobile").getAsString();
        System.out.println(mobile);
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (countryId == 0) {
            responseObject.addProperty("message", "Select a country");
        } else if (provinceId == 0) {
            responseObject.addProperty("message", "Select a province");
        } else if (cityId == 0) {
            responseObject.addProperty("message", "Select a city");
        } else if (postalCode.isEmpty()) {
            responseObject.addProperty("message", "Enter your postal code");
        } else if (lineOne.isEmpty()) {
            responseObject.addProperty("message", "Enter address line one");
        } else if (lineTwo.isEmpty()) {
            responseObject.addProperty("message", "Enter address line two");
        } else if (postalCode.isEmpty()) {
            responseObject.addProperty("message", "Enter your postal code");
        } else if (mobile.isEmpty()) {
            responseObject.addProperty("message", "Enter your mobile number");//mobile eka verify karala ne karanna 
        } else {
            HttpSession ses = request.getSession(false);
            if (ses != null && ses.getAttribute("user") != null) {
                User u = (User) ses.getAttribute("user");

                Session s = null;
                org.hibernate.Transaction tx = null;
                try {
                    SessionFactory sf = HibernateUtil.getSessionFactory();
                    s = sf.openSession();

                    Criteria c = s.createCriteria(User.class);
                    c.add(Restrictions.eq("email", u.getEmail()));
                    if (!c.list().isEmpty()) {
                        User u1 = (User) c.list().get(0);
                        City city = (City) s.load(City.class, cityId);

                        tx = s.beginTransaction();

                        // Check if address already exists for user to update, or create new
                        Criteria addrCriteria = s.createCriteria(Address.class);
                        addrCriteria.add(Restrictions.eq("user", u1));
                        List<Address> existingAddresses = addrCriteria.list();

                        Address address;
                        if (existingAddresses != null && !existingAddresses.isEmpty()) {
                            address = existingAddresses.get(0);
                        } else {
                            address = new Address();
                            address.setUser(u1);
                        }

                        address.setLineOne(lineOne);
                        address.setLineTwo(lineTwo);
                        address.setPostalCode(postalCode);
                        address.setMobile(mobile);
                        address.setCity(city);

                        s.saveOrUpdate(address);
                        tx.commit();

                        ses.setAttribute("user", u1);
                        responseObject.addProperty("status", true);
                        responseObject.addProperty("message", "Shipping address saved successfully!");
                    } else {
                        responseObject.addProperty("message", "User not found in database!");
                    }
                } catch (Exception ex) {
                    if (tx != null) {
                        try { tx.rollback(); } catch (Exception ignored) {}
                    }
                    ex.printStackTrace();
                    responseObject.addProperty("message", "Database error: " + ex.getMessage());
                } finally {
                    if (s != null && s.isOpen()) {
                        s.close();
                    }
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                responseObject.addProperty("message", "Session expired! Please sign in again.");
            }
        }

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }
}
