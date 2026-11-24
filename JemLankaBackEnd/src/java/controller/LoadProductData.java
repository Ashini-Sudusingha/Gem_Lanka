package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.Clarity;
import hibernate.Color;
import hibernate.Country;
import hibernate.HibernateUtil;
import hibernate.Shape;
import hibernate.States;
import hibernate.Treatment;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "LoadDataOfProduct", urlPatterns = {"/LoadProductData"})
public class LoadProductData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        Session s = null;
        try {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            s = sf.openSession();

            Criteria c1 = s.createCriteria(Category.class);
            List<Category> catList = c1.list();

            Criteria c2 = s.createCriteria(Clarity.class);
            List<Clarity> clarityList = c2.list();

            Criteria c3 = s.createCriteria(Color.class);
            List<Color> colorList = c3.list();

            Criteria c4 = s.createCriteria(Treatment.class);
            List<Treatment> treatmentList = c4.list();

            Criteria c5 = s.createCriteria(Shape.class);
            List<Shape> shapeList = c5.list();

            Criteria c6 = s.createCriteria(States.class);
            List<States> statesList = c6.list();

            Criteria c7 = s.createCriteria(Country.class);
            List<Country> countryList = c7.list();

            Gson gson = new Gson();
            responseObject.add("catList", gson.toJsonTree(catList));
            responseObject.add("clarityList", gson.toJsonTree(clarityList));
            responseObject.add("colorList", gson.toJsonTree(colorList));
            responseObject.add("treatmentList", gson.toJsonTree(treatmentList));
            responseObject.add("shapeList", gson.toJsonTree(shapeList));
            responseObject.add("statesList", gson.toJsonTree(statesList));
            responseObject.add("countryList", gson.toJsonTree(countryList));
            responseObject.addProperty("status", true);

            response.getWriter().write(gson.toJson(responseObject));
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to load product metadata");
            response.getWriter().write(new Gson().toJson(responseObject));
        } finally {
            if (s != null && s.isOpen()) {
                s.close();
            }
        }
    }
}
