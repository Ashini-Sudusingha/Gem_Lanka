
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.Clarity;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Shape;
import hibernate.States;
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
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Ahini
 */
@WebServlet(name = "SearchProductsHere", urlPatterns = {"/SearchProductsHere"})
public class SearchProductsHere extends HttpServlet {

    private static final int MAX_RESULT = 8;
    private static final int ACTIVE_ID = 1;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject resposeObject = new JsonObject();
        resposeObject.addProperty("status", false);

        JsonObject requestJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        Criteria c1 = s.createCriteria(Product.class); // get all products for the filtering

        if (requestJsonObject.has("catselected")) {
            int catid= requestJsonObject.get("catselected").getAsInt();

            // get brand details 
            Criteria c2 = s.createCriteria(Category.class);
            c2.add(Restrictions.eq("id", catid));
            List <Category> catList =  c2.list();

            c1.add(Restrictions.in("cat", catList));
        }

        if (requestJsonObject.has("clarityselected")) {
           int clarityid= requestJsonObject.get("clarityselected").getAsInt();

            // get qulity details
            Criteria c4 = s.createCriteria(Clarity.class);
            c4.add(Restrictions.eq("id", clarityid));
            Clarity calrity = (Clarity) c4.uniqueResult();

            // filter product by using quality
            c1.add(Restrictions.eq("clarity", calrity));
        }

        
        if (requestJsonObject.has("colorselected")) {
           int colorid= requestJsonObject.get("colorselected").getAsInt();

            // get qulity details
            Criteria c4 = s.createCriteria(Color.class);
            c4.add(Restrictions.eq("id", colorid));
            Color color = (Color) c4.uniqueResult();

            // filter product by using quality
            c1.add(Restrictions.eq("Color", color));
        }

        if (requestJsonObject.has("shapeselected")) {
           int shapeid= requestJsonObject.get("shapeselected").getAsInt();

            // get qulity details
            Criteria c4 = s.createCriteria(Shape.class);
            c4.add(Restrictions.eq("id", shapeid));
            Shape shape = (Shape) c4.uniqueResult();

            // filter product by using quality
            c1.add(Restrictions.eq("shape", shape));
        }

        if (requestJsonObject.has("price")) {
            double priceStart = 100;
            double priceEnd = requestJsonObject.get("price").getAsDouble();

            c1.add(Restrictions.ge("price", priceStart));
            c1.add(Restrictions.le("price", priceEnd));
        }
        
        if (requestJsonObject.has("weight")) {
            double priceStart = 0;
            double priceEnd = requestJsonObject.get("weight").getAsDouble();

            c1.add(Restrictions.ge("weight", priceStart));
            c1.add(Restrictions.le("weight", priceEnd));
        }

        if (requestJsonObject.has("sortValue")) {
            String sortValue = requestJsonObject.get("sortValue").getAsString();
            if (sortValue.equals("Sort by Latest")) {
                c1.addOrder(Order.desc("id"));
            } else if (sortValue.equals("Sort by Oldest")) {
                c1.addOrder(Order.asc("id"));
            } else if (sortValue.equals("Sort by Name")) {
                c1.addOrder(Order.asc("title"));
            } else if (sortValue.equals("Sort by Price")) {
                c1.addOrder(Order.asc("price"));
            }
        }

        States status = (States) s.get(States.class, SearchProductsHere.ACTIVE_ID); // get Active product [2 = Active]
        c1.add(Restrictions.eq("status", status));

        resposeObject.addProperty("allProductCount", c1.list().size());

        if (requestJsonObject.has("firstResult")) {
            int firstResult = requestJsonObject.get("firstResult").getAsInt();
            c1.setFirstResult(firstResult);
            c1.setMaxResults(SearchProductsHere.MAX_RESULT);
        }

        // get filtered product list
        List<Product> productList = c1.list();
        for (Product product : productList) {
            product.getStore().setUser(null);
        }
        // hibernate session close
        s.close();

        resposeObject.add("productList", gson.toJsonTree(productList));
        resposeObject.addProperty("status", true);
        response.setContentType("application/json");
        String toJson = gson.toJson(resposeObject);
        response.getWriter().write(toJson);
    }

}
