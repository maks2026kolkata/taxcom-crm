import { collection, getDocs, limit, query } from "firebase/firestore";
try {
  const q = query(collection(null, "clients"), limit(1));
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
