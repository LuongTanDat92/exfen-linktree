import { ObjectId } from "mongodb";
import clientPromise from "@/libs/mongodb-client";

const COLLECTION = "events";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTION);
}

// ===== CREATE =====
export async function createEvent(data) {
  const col = await getCollection();

  const doc = {
    type: data.type, // "page_view" | "link_click" | "button_click"
    page: data.page ? new ObjectId(data.page) : null,
    uri: data.uri || null,
    target: data.target || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

// ===== READ =====
export async function findOne(filter) {
  const col = await getCollection();

  if (filter._id) {
    filter._id = new ObjectId(filter._id);
  }

  return col.findOne(filter);
}

export async function find(filter = {}, options = {}) {
  const col = await getCollection();

  if (filter.page) {
    filter.page = new ObjectId(filter.page);
  }

  const cursor = col.find(filter, options);
  return cursor.toArray();
}

// ===== UPDATE =====
export async function updateOne(filter, update) {
  const col = await getCollection();

  if (filter._id) {
    filter._id = new ObjectId(filter._id);
  }

  return col.updateOne(filter, {
    $set: {
      ...update,
      updatedAt: new Date(),
    },
  });
}

export async function findOneAndUpdate(filter, update) {
  const col = await getCollection();

  if (filter._id) {
    filter._id = new ObjectId(filter._id);
  }

  const result = await col.findOneAndUpdate(
    filter,
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return result.value;
}
