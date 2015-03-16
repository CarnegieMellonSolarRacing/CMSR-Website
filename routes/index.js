var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/history', function (req, res) {
  res.render('history', { title : 'History' });
});

router.get('/donate', function (req, res) {
  res.render('donate', { title : 'Donate' });
});

router.get('/contact', function (req, res) {
  res.render('contact', { title : 'Contact' });
});

router.post('/contact/submit', function (req, res) {
	try {
		var name = req.body.name;
		var email = req.body.email;
		var msg = req.body.message;
		var real = req.body.real;

		// human check
		if (real == 7) 
		{
			var nodemailer = require('nodemailer');
			var transporter = nodemailer.createTransport();
			transporter.sendMail({
			    from: email,
			    to: 'cmsr.executive@gmail.com',
			    subject: 'Email from ' + name,
			    text: msg
			});

			res.render('contact', { title : 'Contact', success : true});
		} else {
			throw new Exception("human check failed");
		}
	} catch (e) {
		res.render('contact', { title : 'Contact', success : false});
	}
});

router.get('/sponsors', function (req, res) {
  	fs.readFile("sponsor-data/gold-sponsors.json", function (e1, gold) {
  		fs.readFile("sponsor-data/silver-sponsors.json", function (e2, silver) { 
  			fs.readFile("sponsor-data/bronze-sponsors.json", function (e3, bronze) {
  				var goldSponsors = JSON.parse(gold);
  				var silverSponsors = JSON.parse(silver);
  				var bronzeSponsors = JSON.parse(bronze);

  				res.render('sponsors', { title : 'Sponsors', gold : goldSponsors, 
  					silver : silverSponsors, bronze : bronzeSponsors});
  			});
  		});
  	});
});

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}
    

router.get('/gallery', function (req, res) {
	var dirs = getDirectories("public/images/gallery");

	var repName = "representative.jpg";

	var dirsWithReps = [];
	for (i in dirs) 
	{
		var dir = dirs[i];
		// check for flagged image (one with name "representative.jpg")
		if (fs.existsSync("public/images/gallery/" + dir + "/" + repName))
		{
			dirsWithReps.push({ folder : dir, representativePath : dir + "/" + repName});
		} 
		else 
		{
			// try to get first image if it exists
			var allFiles = fs.readdirSync("public/images/gallery/" + dir + "/");
			
			var imageNames = allFiles.filter(function (str) {
				return endsWith(str, ".jpg") || endsWith(str, ".png") || endsWith(str, ".jpeg");
			});

			if (imageNames.length > 0)
			{
				console.log("pushin'")
				dirsWithReps.push({ folder : dir, representativePath : dir + "/" + imageNames[0]});
			}
			
		}
	}

	console.log(dirsWithReps);

	res.render('gallery-list', { subfolders : dirsWithReps });
});

router.get('/gallery/*', function (req, res) {
	// suffix of URL 
	var folder = req.params['0'];

	var allFiles = fs.readdir('public/images/gallery/' + folder + "/", function(err, files) {
	  	var imageNames = files.filter(function (str) {
			return endsWith(str, ".jpg") || endsWith(str, ".png") || endsWith(str, ".jpeg")
			|| endsWith(str, ".JPG") || endsWith(str, ".PNG") || endsWith(str, ".JPEG");
		});

	  	var namesWithPath = imageNames.map(function (path) {
	  		return folder + "/" + path;
	  	});

		res.render('gallery-view', 
			{ title : 'Gallery', subfolder : folder, 
			images : namesWithPath});
	});
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'CMSR' });
});

module.exports = router;
