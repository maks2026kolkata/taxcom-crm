import { collection, getDocs, limit, query } from "firebase/firestore";

const fetchCheck = async (colName) => {
  try {
     await getDocs(query(collection(null, colName), limit(1)));
  } catch (e) {
     console.error("Caught inside:", e.message);
  }
};

fetchCheck("clients").then(() => console.log("Done"));
