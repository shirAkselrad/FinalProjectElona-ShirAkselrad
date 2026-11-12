import SalesCharts from "../SalesChart/SalesChart";
import SalesByCategory from "../SalesByCategory/SalesByCategory";
import SectionTitle from "../../../Employee-Page/SectionTitle/SectionTitle";
import BestSellingProducts from "./BestSellingProducts/BestSellingProducts";
import OrderByStatus from "./OrdersByStatus/OrdersByStatus";
function Reports() {
  return (
    <div>
      <SectionTitle title="Reports & Analytics" />
      <SalesCharts />
      <SalesByCategory/>
      <BestSellingProducts/>
      <OrderByStatus/>
    </div>
  );
}
export default Reports;
