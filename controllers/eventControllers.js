const eventController = {}
const db = require('../modules/mongodb');
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
  console.log(req.body)

  const fieldsLength = checkRequiredFields(req, res);

  const imageDocument = {
    name: Date.now() + '--' + req.file.originalname,
    contentType: req.file.mimetype
  };
  if (!(fieldsLength > 0)) {
    const payload = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category: category.trim(),
      sub_category: sub_category.trim(),
      rigor_rank: parseInt(rigor_rank),
      attendees: attendees.trim(),
      schedule: new Date(schedule).toISOString(),
      moderator: parseInt(moderator),
      image: imageDocument,
      createdAt: new Date().toISOString(),
      uid,
      type: 'event'
    };

    const collection = await db.collection(collectionName);
    const result = await collection.insertOne(payload);
    if (result.acknowledged)
      res.json({ message: 'Event created successfully', result });
    else {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while creating the event' });
    }
  }

};

function checkRequiredFields(req, res) {
  const requiredFields = ['name', 'tagline', 'schedule', 'description', 'moderator', 'category', 'sub_category', 'rigor_rank', 'attendees']

  const missingFields = requiredFields.filter(field => !(field in req.body));

  if (missingFields.length > 0) {
    const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
    res.status(400).json(errorMessage)

  }
  return missingFields.length

}

// UPDATING THE VALUES
eventController.edit = async (req, res) => {
  const id = req.params.Id;
  let { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const uid = req.uid || 336;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Id passed' });
  }

  const payload = {};
  const keys = {
    type: 'event',
    _id: new ObjectId(id),
    uid: uid
  };

  // Trim and check for changes in each field
  if (name && name.trim() !== '') {
    payload.name = name.trim();
  }
  if (tagline && tagline.trim() !== '') {
    payload.tagline = tagline.trim();
  }
  if (schedule && schedule.trim() !== '') {
    payload.schedule = schedule.trim();
  }
  if (description && description.trim() !== '') {
    payload.description = description.trim();
  }
  if (moderator && moderator.trim() !== '') {
    payload.moderator = moderator.trim();
  }
  if (category && category.trim() !== '') {
    payload.category = category.trim();
  }
  if (sub_category && sub_category.trim() !== '') {
    payload.sub_category = sub_category.trim();
  }
  if (rigor_rank && rigor_rank.trim() !== '') {
    payload.rigor_rank = parseInt(rigor_rank.trim());
  }
  if (attendees && attendees.trim() !== '') {
    payload.attendees = attendees.trim();
  }

  if (Object.keys(payload).length) {
    payload.updatedAt = new Date().toISOString();
    payload.updatedBy = uid;

    try {
      const collection = await db.collection(collectionName);
      const result = await collection.updateOne(keys, { $set: payload });
      res.json({ message: 'Event updated successfully', result: result });
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
    const uid = parseInt(req.uid) || 336;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Id passed' });
    }

    const keys = {
      _id: new ObjectId(id),
      uid: uid,
      type: 'event',
    };

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