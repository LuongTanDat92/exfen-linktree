import { ObjectId } from "mongodb";
import clientPromise from "@/libs/mongodb-client";

const models = {};

class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = definition;
    this.options = options;
  }

  index() {}
}

Schema.Types = {
  Mixed: Object,
  ObjectId,
};

function applyUpdate(doc, update) {
  if (!update || typeof update !== "object") return doc;

  if (update.$set) {
    Object.entries(update.$set).forEach(([key, value]) => {
      doc[key] = value;
    });
  }

  if (update.$pull) {
    Object.entries(update.$pull).forEach(([key, condition]) => {
      if (!Array.isArray(doc[key])) return;
      doc[key] = doc[key].filter((item) => {
        return !Object.entries(condition).every(([k, v]) => item?.[k] === v);
      });
    });
  }

  if (update.$push) {
    Object.entries(update.$push).forEach(([key, value]) => {
      if (!Array.isArray(doc[key])) doc[key] = [];
      doc[key].push(value);
    });
  }

  return doc;
}

function withIdFilter(filter = {}) {
  const q = { ...filter };
  if (q._id && typeof q._id === "string" && ObjectId.isValid(q._id)) {
    q._id = new ObjectId(q._id);
  }
  return q;
}

function createModel(name) {
  const collectionName = `${name.toLowerCase()}s`;

  class Model {
    static async _collection() {
      const client = await clientPromise;
      if (!client) throw new Error("Missing MONGO_URI");
      const db = client.db();
      return db.collection(collectionName);
    }

    static async create(data) {
      const collection = await this._collection();
      const now = new Date();
      const payload = Array.isArray(data)
        ? data.map((item) => ({ ...item, createdAt: now, updatedAt: now }))
        : { ...data, createdAt: now, updatedAt: now };

      if (Array.isArray(payload)) {
        await collection.insertMany(payload);
        return payload;
      }

      const result = await collection.insertOne(payload);
      return { ...payload, _id: result.insertedId };
    }

    static find(filter = {}) {
      const query = withIdFilter(filter);
      return {
        lean: async () => {
          const collection = await this._collection();
          return collection.find(query).toArray();
        },
      };
    }

    static findOne(filter = {}) {
      const query = withIdFilter(filter);
      return {
        lean: async () => {
          const collection = await this._collection();
          return collection.findOne(query);
        },
        then: async (resolve, reject) => {
          try {
            const collection = await this._collection();
            const doc = await collection.findOne(query);
            return resolve ? resolve(doc) : doc;
          } catch (error) {
            if (reject) return reject(error);
            throw error;
          }
        },
      };
    }

    static async updateOne(filter = {}, update = {}) {
      const collection = await this._collection();
      const query = withIdFilter(filter);

      const directPositional = Object.keys(update.$set || {}).some((k) =>
        k.includes("blocks.$."),
      );

      if (directPositional) {
        const doc = await collection.findOne(query);
        if (!doc) return { matchedCount: 0, modifiedCount: 0 };

        const blockId = query["blocks._id"];
        const idx = (doc.blocks || []).findIndex((b) => b?._id === blockId);
        if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };

        Object.entries(update.$set || {}).forEach(([key, value]) => {
          const m = key.match(/^blocks\.\$\.(.+)$/);
          if (m) doc.blocks[idx][m[1]] = value;
        });

        doc.updatedAt = new Date();
        await collection.replaceOne({ _id: doc._id }, doc);
        return { matchedCount: 1, modifiedCount: 1 };
      }

      const result = await collection.updateOne(query, update);
      return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
    }

    static async findOneAndUpdate(filter = {}, update = {}, options = {}) {
      const collection = await this._collection();
      const query = withIdFilter(filter);
      const doc = await collection.findOne(query);
      if (!doc) return null;
      const next = applyUpdate(doc, update);
      next.updatedAt = new Date();
      await collection.replaceOne({ _id: doc._id }, next);
      return options.new ? next : doc;
    }

    static async aggregate(pipeline = []) {
      const collection = await this._collection();
      return collection.aggregate(pipeline).toArray();
    }
  }

  return Model;
}

async function connect() {
  await clientPromise;
  return true;
}

const mongoose = {
  Schema,
  Types: { ObjectId },
  models,
  model(name, schema) {
    if (!models[name]) models[name] = createModel(name, schema);
    return models[name];
  },
  connect,
};

export default mongoose;
