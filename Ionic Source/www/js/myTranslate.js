angular.module('myTranslate',['pascalprecht.translate'])
.config(function($translateProvider){
	$translateProvider.translations('en',{
		latest :'LATEST',
		feature :'FEATURE',
		video :'VIDEO',
		photo :'PHOTO',
		dayago:'days ago',
		bookmark :'BookMark',
		textsize :'TextSize',
		pushnotification:'Push Notification',
		share :'Share',
		help :'Help',
		logout:'Log Out',
		login :'Log In',
		category:'Categories',
		search :'Search',
		for:'for',
		noresult :'No Result Availbles',
		news :'News',
		remove :'Remove',
		addcomment :'Add a comment',
		profile :'Profile',
		fullname :'Full Name',
		change :'change',
		forgot:'Forgot',
		sucess :'Sucessfully',
		removed :'Removed',
		signup :'Sign Up',
		signin :'Sign In',
		forgot :'forgot'
	});
	$translateProvider.useSanitizeValueStrategy('escapeParameters');
	$translateProvider.preferredLanguage("en");
	$translateProvider.fallbackLanguage("en");
});