const stockConditions = {
  "Out of Stock": "quantity=0",
  "Low Stock":
    "quantity > 0 and restock_required=1 and quantity <= coalesce(min_stock, 0)",
  "Normal Stock":
    "quantity > 0 and (coalesce(restock_required,0)!=1 or quantity > coalesce(min_stock,0))",
};
module.exports = stockConditions;
