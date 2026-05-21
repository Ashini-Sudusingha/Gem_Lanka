
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.Clarity;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Shape;
import hibernate.States;
import hibernate.Treatment;
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

@WebServlet(name = "LoadDataOfProduct", urlPatterns = {"/LoadProductData"})
public class LoadProductData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
 
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //search-category
        Criteria c1 = s.createCriteria(Category.class);
        List<Category> catList = c1.list();

        //get-clarity
        Criteria c2 = s.createCriteria(Clarity.class);
        List<Clarity> clarityList = c2.list();
      
        //get-colors
        Criteria c3 = s.createCriteria(Color.class);
        List<Color> colorList = c3.list();

        //get-Treatmant
        Criteria c4 = s.createCriteria(Treatment.class);
        List<Treatment> treatmentList = c4.list();

        //get-Shape
        Criteria c5 = s.createCriteria(Shape.class);
        List<Shape> shapeList = c5.list();
        
         //get-Shape
        Criteria c6 = s.createCriteria(States.class);
        List<States> statesList = c6.list();
     

        Gson gson = new Gson();

        responseObject.add("catList", gson.toJsonTree(catList));
        responseObject.add("clarityList", gson.toJsonTree(clarityList));
        responseObject.add("colorList", gson.toJsonTree(colorList));
        responseObject.add("treatmentList", gson.toJsonTree(treatmentList));
        responseObject.add("shapeList", gson.toJsonTree(shapeList));
        responseObject.add("statesList", gson.toJsonTree(statesList));
        responseObject.addProperty("status", true);
        
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
        s.close();
    }
   

}
