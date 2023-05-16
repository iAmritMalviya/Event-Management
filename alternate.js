eventController.edit = async (req, res) => {

    const id = req.params.Id;
    let { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
    const uid = req.uid;

    //  if object id, verifying the id, 
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Id passed' });
    }

    const keys = {
        type: 'event',
        _id: new ObjectId(id), // using mongodb client
        uid: uid
    };

    const collection = await db.collection(collectionName);
    const event = await collection.findOne(keys);

    if(!event)
    return res.status(404).json({message: 'No data found'})

    const payload = {
        name: name || event.name,
        tagline: tagline || event.tagline,
        description: description || event.description,
        category: category || event.category,
        sub_category:sub_category || event.sub_category,
        rigor_rank: rigor_rank || event.rigor_rank,
        attendees: attendees || event.attendees,
        schedule: schedule || event.schedule,
        moderator: parseInt(moderator) || event.moderator,        
        createdAt: new Date().toISOString(),
        uid,
        type: 'event',
        updatedAt : new Date().toISOString(),
        updatedBy :uid
    };
    
        try {
            const imageDocument = {
                name: Date.now() + '--' + req.file.originalname,
                contentType: req.file.mimetype
            };
            payload.image = imageDocument

            const collection = await db.collection(collectionName);
            const result = await collection.updateOne(keys, { $set: payload });
            res.status(200).json({ message: 'Event updated successfully', result: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while updating the event' });
        }
  
};


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
    // if any change, length will be increased, and it will have a db call
    if (Object.keys(payload).length) {
      payload.updatedAt = new Date().toISOString();
      payload.updatedBy = uid;
  
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
  