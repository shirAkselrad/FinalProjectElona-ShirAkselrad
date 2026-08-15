import cloverBrooch from "../../assets/cloverBroochImg.png";
import brownBag from "../../assets/brownBagImg.png";
import creamHat from "../../assets/creamHatImg.png";

const products = [
  {
    id: 1,
    image: cloverBrooch,
    category: "BROOCHES",
    name: "Pearl Clover Brooch",
    description: "Vintage Gold Collection",
    price: 120,

    details:
      "An elegant clover brooch featuring pearl accents and vintage gold detailing. A timeless accessory designed to add a refined touch to any look.",

    materials: [
      "Gold-tone metal",
      "Faux pearl details",
      "Vintage-style finish",
      "Metal pin fastening",
    ],
  },

  {
    id: 2,
    image: brownBag,
    category: "HANDBAGS",
    name: "Brown Leather Crossbody",
    description: "Vintage Gold Collection",
    price: 295,

    details:
      "A structured crossbody bag in full-grain brown leather with polished gold hardware. Spacious enough for your essentials, refined enough for any occasion.",

    materials: [
      "Full-grain Italian leather",
      "Polished gold hardware",
      "Suede interior lining",
      "Adjustable leather strap",
    ],
  },

  {
    id: 3,
    image: creamHat,
    category: "ACCESSORIES",
    name: "Cream Fedora Hat",
    description: "Golden Leaf Collection",
    price: 120,

    details:
      "A timeless cream fedora with an elegant structured silhouette and delicate gold detailing. Designed to bring a sophisticated finish to any outfit.",

    materials: [
      "Premium wool felt",
      "Soft fabric band",
      "Gold-tone decorative brooch",
      "Structured wide brim",
    ],
  },
];

export default products;
