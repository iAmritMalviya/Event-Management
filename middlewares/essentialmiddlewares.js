
const essentialmiddlwares = module.exports

essentialmiddlwares.checkRequired = function ( req, res, next) {
    const requiredFields = ['name', 'tagline', 'schedule', 'description', 'moderator', 'category', 'sub_category', 'rigor_rank', 'attendees']
    const missingFields = [];
    console.log("missing", missingFields, req.body)
  
    // Check if each required field is present in the request body
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        missingFields.push(field);
      }
    }
    // If any required field is missing, send an error response
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }
    // it will go to the route route handler
    next();
}