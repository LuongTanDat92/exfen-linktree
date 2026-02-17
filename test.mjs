import { MongoClient } from "mongodb";
import "dotenv/config";

console.log("URI:", process.env.MONGO_URI);

const client = new MongoClient(process.env.MONGO_URI);

try {
  await client.connect();
  console.log("✅ Mongo connected");
  console.log("DB:", client.db().databaseName);
  await client.close();
  process.exit(0);
} catch (err) {
  console.error("❌ Mongo FAILED");
  console.error(err);
  process.exit(1);
}
