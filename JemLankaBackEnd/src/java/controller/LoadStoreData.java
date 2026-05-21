
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.BusinessCat;
import hibernate.City;
import hibernate.Country;
import hibernate.HibernateUtil;
import hibernate.Position;
import hibernate.Province;
import java.io.IOException;
import java.io.PrintWriter;
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
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //search-city
        Criteria c1 = s.createCriteria(BusinessCat.class);
        List<BusinessCat> bussinessList = c1.list();

        //get-country
        Criteria c2 = s.createCriteria(Position.class);
        List<Position> positionList = c2.list();

        //get-province
        Criteria c3 = s.createCriteria(Province.class);
        List<Province> provinceList = c3.list();

        responseObject.add("bussinessList", gson.toJsonTree(bussinessList));
        responseObject.add("positionList", gson.toJsonTree(positionList));
        responseObject.addProperty("status", true);
      //  System.out.println(gson.toJson(responseObject));

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }
        

}
