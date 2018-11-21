var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next) {
    // res.send('Respond with user details...');
    res.status(200);
	res.render('index',{title:'User\'s details will be rendered here..'});
});

module.exports = router;
