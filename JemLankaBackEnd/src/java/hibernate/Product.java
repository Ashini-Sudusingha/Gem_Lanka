package hibernate;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

@Entity
@Table(name = "product")
public class Product implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price")
    private double price;

    @Column(name = "qty")
    private int qty;

    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date created_at;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color Color;

    @Column(name = "weight", nullable = false)
    private double weight;

    @Column(name = "hight", nullable = false)
    private double hight;

    @Column(name = "length", nullable = false)
    private double length;

    @Column(name = "width", nullable = false)
    private double width;
    
    @ManyToOne
    @JoinColumn(name = "category_id" )
    private Category cat;

    @ManyToOne
    @JoinColumn(name = "clarity_id")
    private Clarity clarity;
    
    @ManyToOne
    @JoinColumn(name = "treatment_id")
    private Treatment treatment;
    
    @ManyToOne
    @JoinColumn(name = "shape_id")
    private Shape shape;
    
    @ManyToOne
    @JoinColumn(name = "active_id")
    private ActiveState active;
    
    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;
    
    @Column(name = "cost")
    private double cost;
    
    @ManyToOne
    @JoinColumn(name = "status_id")
    private States status;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public Color getColor() {
        return Color;
    }

    public void setColor(Color color) {
        this.Color = color;
    }

 

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    /**
     * @return the weight
     */
    public double getWeight() {
        return weight;
    }

    /**
     * @param weight the weight to set
     */
    public void setWeight(double weight) {
        this.weight = weight;
    }

    /**
     * @return the hight
     */
    public double getHight() {
        return hight;
    }

    /**
     * @param hight the hight to set
     */
    public void setHight(double hight) {
        this.hight = hight;
    }

    /**
     * @return the length
     */
    public double getLength() {
        return length;
    }

    /**
     * @param length the length to set
     */
    public void setLength(double length) {
        this.length = length;
    }

    /**
     * @return the width
     */
    public double getWidth() {
        return width;
    }

    /**
     * @param width the width to set
     */
    public void setWidth(double width) {
        this.width = width;
    }

    /**
     * @return the cat
     */
    public Category getCat() {
        return cat;
    }

    /**
     * @param cat the cat to set
     */
    public void setCat(Category cat) {
        this.cat = cat;
    }

    /**
     * @return the clarity
     */
    public Clarity getClarity() {
        return clarity;
    }

    /**
     * @param clarity the clarity to set
     */
    public void setClarity(Clarity clarity) {
        this.clarity = clarity;
    }

    /**
     * @return the treatment
     */
    public Treatment getTreatment() {
        return treatment;
    }

    /**
     * @param treatment the treatment to set
     */
    public void setTreatment(Treatment treatment) {
        this.treatment = treatment;
    }

    /**
     * @return the shape
     */
    public Shape getShape() {
        return shape;
    }

    /**
     * @param shape the shape to set
     */
    public void setShape(Shape shape) {
        this.shape = shape;
    }

    /**
     * @return the active
     */
    public ActiveState getActive() {
        return active;
    }

    /**
     * @param active the active to set
     */
    public void setActive(ActiveState active) {
        this.active = active;
    }

    /**
     * @return the store
     */
    public Store getStore() {
        return store;
    }

    /**
     * @param store the store to set
     */
    public void setStore(Store store) {
        this.store = store;
    }

    /**
     * @return the cost
     */
    public double getCost() {
        return cost;
    }

    /**
     * @param cost the cost to set
     */
    public void setCost(double cost) {
        this.cost = cost;
    }

    /**
     * @return the status
     */
    public States getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(States status) {
        this.status = status;
    }

}
