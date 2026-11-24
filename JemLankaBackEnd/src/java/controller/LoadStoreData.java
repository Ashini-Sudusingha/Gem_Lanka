package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.BusinessCat;
import hibernate.City;
import hibernate.Country;
import hibernate.HibernateUtil;
import hibernate.Position;
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

@WebServlet(name = "LoadStoreData", urlPatterns = {"/LoadStoreData"})
public class LoadStoreData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();

        Session s = null;
        try {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            s = sf.openSession();

            Criteria c1 = s.createCriteria(BusinessCat.class);
            List<BusinessCat> bussinessList = c1.list();

            Criteria c2 = s.createCriteria(Position.class);
            List<Position> positionList = c2.list();

            Criteria c3 = s.createCriteria(City.class);
            List<City> cityList = c3.list();

            responseObject.add("bussinessList", gson.toJsonTree(bussinessList));
            responseObject.add("positionList", gson.toJsonTree(positionList));
            responseObject.add("cityList", gson.toJsonTree(cityList));
            responseObject.addProperty("status", true);

            response.getWriter().write(gson.toJson(responseObject));
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("message", "Failed to load store metadata");
            response.getWriter().write(gson.toJson(responseObject));
        } finally {
            if (s != null && s.isOpen()) {
                s.close();
            }
        }
    }
}
