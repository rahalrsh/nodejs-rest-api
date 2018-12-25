module.exports = {
	list(req, res, next) {
      console.log('user list');
	    res.status(200).json({
	  		message: 'users'
	  	});
	  },
};


/*
  	return Classroom
  	.findAll({
    include: [{
      model: Student,
      as: 'students'
    }],
    order: [
      		['createdAt', 'DESC'],
      		[{ model: Student, as: 'students' }, 'createdAt', 'DESC'],
    	],
  	})
  	.then((classrooms) => res.status(200).send(classrooms))
  	.catch((error) => { res.status(400).send(error); });
*/