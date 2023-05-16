const eventController = {}
const db = require('../modules/mongodb');
const fs = require('fs')
const { ObjectId } = require('mongodb');
const collectionName = 'events'
// GET: getting all the events, query page, limit and sort are accepted 
eventController.get = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort === 'older' ? { createdAt: 1 } : { createdAt: -1 };
  const Id = req.query.Id || undefined;

  if (Id && !ObjectId.isValid(Id)) {
    return res.status(400).json({ message: "Invalid Id parameter passed" });
  }
  const keys = {
    type: 'event',
  }
  if (Id) {
    keys._id = new ObjectId(Id)
  }

  const collection = await db.collection(collectionName);
  const [totalCount, responses] = await Promise.all([
    collection.countDocuments(),
    collection
      .find(keys)
      .sort(sort)
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .toArray(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  return res.json({
    responses,
    totalCount,
    totalPages
  })
}
//  POST: for creating the event. using checkrequired if we don't find it give the error
eventController.create = async (req, res) => {
  const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const uid = parseInt(req.uid);
 
    const payload = {
      name: name || '',
      tagline: tagline || '',
      description: description || '',
      category: category || '',
      sub_category: sub_category || '',
      rigor_rank: rigor_rank || '',
      attendees: attendees || [],
      schedule: new Date(schedule).toISOString(),
      moderator: parseInt(moderator) || '',
      createdAt: new Date().toISOString(),
      uid,
      type: 'event'
    };

    const imageDocument = {
      name: Date.now() + '--' + req.file.originalname,
      contentType: req.file.mimetype,
      file: fs.readFileSync(req.file.path)
    };
    payload.image = imageDocument

    console.log("payload", payload)
    const collection = await db.collection(collectionName);
    const result = await collection.insertOne(payload);
    if (result.acknowledged)
      res.json({ message: 'Event created successfully', result });
    // db.close()
    else {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the event' });
   
  }

};

// UPDATING THE VALUES
eventController.edit = async (req, res) => {
  const id = req.params.Id;
  let { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const uid = req.uid;
  //  if object id, verifying the id, 
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Id passed' });
  }
  const payload = {};
  const keys = {
    type: 'event',
    _id: new ObjectId(id), // using mongodb client
    uid: uid
  };
  // if values are not undefined or null or empty
  for (let [key, value] of Object.entries(req.body)) {
    if (value !== undefined && value !== '' && value != null) {
      payload[key] = value;
    }
  }
  // if any change, length will be increased, and it will have a db call
  if (Object.keys(payload).length) {
    payload.updatedAt = new Date().toISOString();
    payload.updatedBy = uid;
    console.log(payload)
    try {
      const imageDocument = {
        name: Date.now() + '--' + req.file.originalname,
        contentType: req.file.mimetype,
        file: fs.readFileSync(req.file.path)
      };
      payload.image = imageDocument

      const collection = await db.collection(collectionName);
      const result = await collection.updateOne(keys, { $set: payload });
      res.status(200).json({ message: 'Event updated successfully', result: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the event' });
    }
  } else {
    res.status(400).json({ message: 'No changes detected' });
  }
};


eventController.delete = async (req, res) => {
  try {
    const id = req.params.Id;
    const uid = parseInt(req.uid);

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Id passed' });
    }

    const keys = {
      _id: new ObjectId(id),
      uid: uid,
      type: 'event',
    };
    console.log("keys", keys)
    const collection = await db.collection(collectionName);
    const result = await collection.deleteOne(keys);

    if (result.deletedCount === 1) {
      return res.json({ message: 'Event deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the event' });
  }
};

module.exports = eventController