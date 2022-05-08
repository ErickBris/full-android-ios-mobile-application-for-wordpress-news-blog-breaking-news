angular.module('starter.controllers', ['ngSanitize'])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout,$ionicPopup, $ionicSideMenuDelegate,$ionicHistory,$http,$localStorage,$state,$window,$cordovaCamera,$rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.$storage = $localStorage.$default({font:'fontnormal',search:[{id:'',name:''}],bookMark:[],bookImage:[],notification:[{title:'',id:'',body:'',date:''}]});
  $scope.loginData = {};
  $scope.data= [];
  $scope.font ={}
  $scope.imageProfile;
  // $scope.$storage.$reset();
  if(angular.isDefined($localStorage.font)) $scope.font.v = $localStorage.font;
  else $scope.font.v = $localStorage.font;
  // Create the login modal that we will use later
  // console.log($localStorage.notification);
  // template show
  // $scope.$storage.$reset();
 

 //----------log out--------------------

$scope.showLogOut = function(){
    var myLogout = $ionicPopup.confirm({
      template:'<p style="text-align:center !important;">Are you sure to logout?</p>'
    })
    myLogout.then(function(res){
      if(res){
        //do somethin
     delete $localStorage.login;
     $window.location.reload(true);
     $localStorage.checkSingn = false;
      }
      else{
        //do something
      }
    })
}
  //text-size
$rootScope.showTextSize = function(){
  var myPopup1 = $ionicPopup.show({
    templateUrl:'templates/option/textsize.html',
    title :'Text Size',
    scope :$scope,
    buttons:[{
      text :'Cancel',
      onTap :function(e){
      }
    },
    {
    text :'Ok',
    onTap :function(e){
     $localStorage.font = $scope.font.v;
     $localStorage.$apply();
     $rootScope.fontSize = $scope.font.v;
    }
    }
    ]
  })
}
$rootScope.showAlert = function(template) {
   var alertPopup = $ionicPopup.alert({
     template: template
   });
}
$scope.share = function(){
window.plugins.socialsharing.share(null, null,null,$scope.your_link);
}
$scope.goProfile = function(){
  if($localStorage.login == undefined){
    $state.go('app.signup');
  }
  else{
    $state.go('app.profile');
    }
  }
$rootScope.getInfoUser = function(){
    $http.post($scope.url+'/wp-json/mobiconnector/user/get_info?username='+$localStorage.login.user).then(function(res){
    $rootScope.dataUser = res.data;
    $rootScope.imageProfile = res.data.wp_user_avatar;
    $rootScope.emailUser = res.data.user_email;
    $rootScope.displayName = res.data.nickname;
  })
  }
  if(angular.isDefined($localStorage.login) && $localStorage.login.user){
    $rootScope.getInfoUser();
  }
  // Open the login modal
  // Perform the login action when the user submits the login form
  //-----------------------share---------------------------
 
$http.get($scope.url+'/wp-json/wp/v2/categories?orderby=id').then(function(res){
  $scope.dataCategory = res.data;
  $scope.length = res.data.length;
})
//sign
$scope.signIn = function(){
  if(!$localStorage.login){
  $state.go('app.signin',{},{reload :true});
  }
}
})
//  -------------Post Controller------------------------
.controller('postCtrl',function($scope,$http){
    $scope.data={};
    $scope.topNew =[];
    $scope.topFeature=[];
    $scope.page = 1;
    $scope.page1 = 1;
    $scope.loadMore = function(){
      $http.get($scope.hostName,{
        params:{'page':$scope.page,'per_page':$scope.per_page,'order':'desc'}
      }
      ).then(function(response){
      if(response.data.length==0){
        $scope.over = true;
      }
      angular.forEach(response.data,function(item){
      $scope.topNew.push(item);
      })
       $scope.$broadcast('scroll.infiniteScrollComplete');
       $scope.page = $scope.page+1;
    }) 
    }
    $scope.loadMore1 = function(){
      $http.get($scope.hostName,{
        params:{'page':$scope.page1,'per_page':$scope.page,'order':'desc',
        'filter[orderby]=':'post_views'
      }
      }).then(function(response){
        if(response.data.length==0){
          $scope.over1 = true;
        }
        angular.forEach(response.data,function(item){
          $scope.topFeature.push(item);
        })
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page1 = $scope.page1+1;
      })
    }
  })
//-----------------Video Controller---------------------------
.controller('videoCtrl',function($scope,$ionicModal,$ionicPopup,$timeout,$http,$rootScope,$localStorage){
  $scope.page = 1;
  $scope.topVideo=[];
  $scope.loadMore = function(){
    $http.get($scope.hostName,{
    params:{'page':$scope.page,'per_page':$scope.per_page,'filter[post_format]':'post-format-video'}
    }
    ).then(function(res){
    if(res.data.length==0){
    $scope.over = true;
  }
  angular.forEach(res.data,function(item){
    $scope.topVideo.push(item);
  })
  $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.page+=1;
})    
}

})
//--------------------------Photo-Ctrl----------------------------
.controller('photoCtrl',function($scope,$rootScope,$http,$localStorage){
  $scope.page = 1;
  $scope.topImage=[];
  $scope.loadMore = function(){
  $http.get($scope.hostName,
  {
    params:{'page':$scope.page,'per_page':$scope.per_page,'filter[post_format]':'post-format-image'}
  }
  ).then(function(res){
    console.log(res.data.length);
    if(res.data.length==0){
    $scope.over = true;
  }
  angular.forEach(res.data,function(item){
    $scope.topImage.push(item);
  })
  $scope.$broadcast('scroll.infiniteScrollComplete');
    $scope.page+=1;
  })    
  }
  $http.get($scope.hostName,{
  params:{'per_page':'1' ,'filter[post_format]':'post-format-gallery'}
  }).then(function(response){
    $scope.dataGallery = response.data;
    console.log(response.data);
    })
})

//---------------------------Details controller---------------------------

.controller('detailsCtrl',function($scope,$ionicPopup,$timeout,$ionicModal,$stateParams,$http,$sce,$localStorage,$state,$ionicHistory,$ionicScrollDelegate){
  var link = $scope.url
  var data={};
  $scope.data1 = [];
  $scope.test = function(){
    $scope.ch = true;
  }
  $scope.id = $stateParams.idPost;
  $scope.booked = false;
  $scope.font = {};
  $scope.font.v = $localStorage.font;
  $scope.$sce = $sce;
  //check-booked//
  for(var i=0;i<$localStorage.bookMark.length;i++){
    if($scope.id==$localStorage.bookMark[i]){
      $scope.booked = true;
    }
  }
  $scope.showLoad();
  $http.get($scope.url+'/wp-json/mobiconnector/post/counter_view?post_id='+$scope.id).then(function(res){
  });
  $http.get($scope.hostName+'/'+$scope.id).then(function(res){
    $scope.detailsData = res.data;
    $scope.dataIncategory = res.data.mobiconnector_posts_incategory;
    data = res.data;
    angular.forEach($scope.dataIncategory,function(item){
    $http.get($scope.hostName+'/'+item.ID).then(function(res){
      $scope.data1.push(res.data);
      })
    })
    $scope.hideLoad();

  })
  $scope.share = function(){
  window.plugins.socialsharing.share(null, null,null,data.link);
  }
    $scope.bookmark = function(){
    $scope.booked = !$scope.booked;
    $scope.booked1 = true;
    if($scope.booked==true){
    $scope.textBook='Bookmark Sucessfully';
    $localStorage.bookMark.push($scope.id);
  }
    else{$scope.textBook='Bookmark Removed';
    $localStorage.bookMark.pop();
  }
    $timeout(function(){$scope.booked1=false},5000);
  }

    $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
})
///------------------book-mark-------------------------
.controller('bookmarkCtrl',function($scope,$localStorage,$http,$state, $ionicTabsDelegate,$window){
  var str = $localStorage.bookMark.toString();
  var removeVideo = [];
  var removeImage = [];
  var i;
  $scope.y = false;
  $scope.checkY = function(){
    $scope.y = !$scope.y;
  }
  $scope.showcheckbox =false;
  $scope.share = function(link){
  window.plugins.socialsharing.share(null,null,null,link);
  }
  $scope.getBookmark= function(){
    $scope.showLoad();
    $http.get($scope.hostName+'?include='+str).then(function(res){
    $scope.bookNews = res.data;
    $scope.hideLoad();
  })
  }
  $scope.getBookmark();
  $scope.removeNews = function(name){
  var i = $localStorage.bookMark.indexOf(String(name));
  $localStorage.bookMark.splice(i,1);
  $state.reload();
  }
  $scope.removeVideo =function(name,id){
  if(name==true){
    removeVideo.push(id);
  }
  else{
    i = removeVideo.indexOf(id);
    removeVideo.splice(i,1);
  }
  if(removeVideo.length>0){
    $scope.showdelete=true;
  }
  else{
    $scope.showdelete=false;
  }
  }
  $scope.removeImage = function(name,id){
  if(name==true){
    removeImage.push(id);
    console.log(removeImage);
  }
  else{
  i = removeImage.indexOf(id);
  removeImage.splice(i,1);
  }
  if(removeImage.length>0){
    $scope.showdelete=true;
  }
  else{
    $scope.showdelete=false;
  }
}
function remove1(str,a){
  var x = [];
  for(var i = 0;i<a.length;i++){
    if(a[i]!=str){
      x.push(a[i]);
    }
  }
  return x;
}

$scope.deleteBook = function(){
  var t = $ionicTabsDelegate.$getByHandle('my-tab').selectedIndex();
  if(t==2){
  for(var i = 0;i<removeVideo.length;i++){
    $localStorage.bookMark=remove1(removeVideo[i],$localStorage.bookMark);
    }
  $state.reload();
  }
  removeVideo=[];
  if(t==1){
    for(var j=0;j<removeImage.length;j++){
     $localStorage.bookMark = remove1(removeImage[j],$localStorage.bookMark)
    }
  removeImage=[];
  $state.reload();
}
}

 $scope.showCheckBox = function(){
  $scope.showcheckbox = !$scope.showcheckbox;
 }
})
/*----------------------help--------------------------*/
.controller('helpCtrl',function($scope,$ionicPopup,$cordovaAppRate){
    $scope.rateApp = function(){
		if(ionic.Platform.isAndroid())
		cordova.InAppBrowser.open("market://details?id="+android_packageName, "_system");
		else cordova.InAppBrowser.open("itms-apps://itunes.apple.com/app/id"+apple_id+"?mt=8", "_system");
  };
})
//--------------------------Categories----------------------------///

.controller('categoriesCtrl',function($scope,$rootScope,$http,$ionicLoading,$stateParams){
  $scope.id = $stateParams.idCategory;
  $http.get($scope.url+'/wp-json/wp/v2/categories/'+$scope.id).then(function(data){
    $scope.data = data.data;
  })
  $scope.showLoad();
  $http.get($scope.url+'/wp-json/wp/v2/posts?categories='+$scope.id).then(function(response){
    $scope.data1 = response.data;
    $scope.hideLoad();

})

})
// -------------------Sign-in---------------------------
.controller('signinCtrl',function($scope,$http,$localStorage,$state,$window,$ionicPopup,$timeout,$ionicHistory,$rootScope){
$scope.user={};
var template = '<p style="color:red;text-align:center">Account does not exist, or the password provided is incorrect.<p>';
$scope.change = function(x){
if(x.length>0){
  $scope.show1 = false;
}
}
$scope.change1 = function(x){
if(x.length>0){
  $scope.show2 = false;
}
}
  $scope.show = false;
  $scope.signIn = function(){

    if($scope.user.name == undefined || $scope.user.name.length == 0){
      $scope.show1 = true;
    }
    if($scope.user.pass == undefined || $scope.user.pass.length == 0){
      $scope.show2 = true;
    }
    sign();
    }
  function sign(){
  if($scope.user.name!=undefined && $scope.user.pass!=undefined && $scope.user.name.length!=0 && $scope.user.pass.length!=0){
    $scope.showLoad();
    $http.post($scope.url+'/wp-json/jwt-auth/v1/token', {
    username: $scope.user.name,
    password: $scope.user.pass
    },
    {
     cache: false,
     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
     withCredentials: true,
     transformRequest: function(obj) {
     var str = [];
     for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
     return str.join("&");
   }
  }).then(function(response){
   $localStorage.login = response.data;
   $localStorage.login.user = $scope.user.name;
   $localStorage.login.pass = $scope.user.pass;
   console.log($localStorage.login);
   $scope.getInfoUser();
   if($ionicHistory.backView().stateName=='app.comment'){
    $ionicHistory.goBack();
    }
   else{
    $state.go('app.home');
    }
    $scope.hideLoad();
  }).catch(function(error){
    $scope.hideLoad();
    $scope.showPopup(template);
  });
}
 };
 
})
//--------------------------------------Sign-up--------------------------------//
.controller('signupCtrl',function($scope,$ionicSideMenuDelegate,$http,$ionicLoading,$state,$ionicPopup){
  $scope.signup={};
  var userSingnup = $scope.signup.name;
  var passSignUp = $scope.signup.pass;
  var emailSignup = $scope.signup.email;
  var template = '<p style="color:red;text-align:center">Error, Account Has Exists !<p>';
  var template1 = '<p style="text-align:center">Successful Register !<p>';
$scope.change = function(x){
if(x.length>0){
  $scope.show2 = false;
}
}
$scope.change1 = function(x){
if(x.length>0){
  $scope.show3 = false;
}
}
  $scope.signUp = function(){
    if($scope.signup.name == undefined || $scope.signup.name.length==0){
      $scope.show1 = true;
    }
    if($scope.signup.email == undefined || $scope.signup.email.length==0){
      $scope.show2 = true;
    }
    if($scope.signup.pass == undefined || $scope.signup.pass.length==0){
      $scope.show3 = true;
    }
      sign1($scope.signup.name.length);
      }
  function sign1(check){
    if(check>3 && $scope.signup.name!=undefined && $scope.signup.email!=undefined && $scope.signup.pass!=undefined
                &&  $scope.signup.name.length!=0 && $scope.signup.email.length!=0 && $scope.signup.pass.length!=0
      ){
 
  $scope.showLoad();
  $http.post($scope.url+'/wp-json/mobiconnector/user/register',
  {
    username : $scope.signup.email,
    password : $scope.signup.pass,
    email :$scope.signup.email,
    nickname : $scope.signup.name
  },
  {
     cache: false,
     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
     withCredentials: true,
     transformRequest: function(obj) {
     var str = [];
     for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
     return str.join("&");
   }
  }
  ).then(function(res){
  $scope.showPopup(template1);
  $scope.hideLoad();
  }).catch(function(error){
  $scope.showPopup(template);
  $scope.hideLoad();
});}

  }
})
.controller('changepassCtrl',function($scope,$ionicLoading,$timeout){
 })
/*------------------------Forgot-pass----------------------*/
.controller('forgotpassCtrl',function($scope,$ionicLoading,$timeout,$http){
  $scope.forgot={};
  var template ='<p style="text-align:center">Sucessfully, Please check your email</p>';
  var template1 ='<p style="text-align:center;color:red">Unsucessfully, Please check your email</p>';
  $scope.change = function(x){
  if(x.length>0){
  $scope.show = false;
}
}
  $scope.forgotPass = function(){
    if($scope.forgot.email == undefined || $scope.forgot.email.length == 0){
      $scope.show = true;
    }
   else if($scope.forgot.email!=undefined && $scope.forgot.email.length!=0){
    $scope.showLoad();
    $http.post($scope.url+'/wp-json/mobiconnector/user/forgot_password?username='+$scope.forgot.email).then(function(res){
      $scope.hideLoad();
      $scope.showPopup(template);
    }).catch(function(error){
      $scope.hideLoad();
      $scope.showPopup(template1);
    });
    
  }
}
})
///------------Search------------------
.controller('searchCtrl',function($scope,$http,$localStorage,$window){
  var tmp = {};
  $http.get($scope.hostName).then(function(res){
  $scope.data = res.data;
  })

$scope.addRecentSearch = function(name,id){
  $scope.check = false;
  for(var i=0;i<$localStorage.search.length;i++){
    if(name == $localStorage.search[i].name){
      $scope.check = true;
    }
  }
  if($scope.check != true){
    tmp.name = name;
    tmp.id = id;
    $localStorage.search.push(tmp);
    tmp = {};
  }
  }
  console.log($localStorage.search);
  $scope.deleteSearch = function(){
  delete $localStorage.search;
  $localStorage.search = [' '];
}
})
// ---------------------------Slide---Box----------------------
.controller('slideboxCtrl',function($scope,$ionicSlideBoxDelegate,$stateParams,$http,$localStorage){
  $scope.src = [];
  var imgObj = {};
  var bookImage={};
  var data_link="";
  $scope.show = false;
  $scope.idImage = $stateParams.idImage;
  $scope.share = function(){
  window.plugins.socialsharing.share(null,null,null,data_link);
}
 $http.get($scope.url+'/wp-json/mobiconnector/post/counter_view?post_id='+$scope.idImage).then(function(res){
  });
  $scope.showLoad();
  $http.get($scope.hostName+'/'+$scope.idImage).then(function(res){
  $scope.dataImage = res.data;
  data_link = res.data.link;
  var tmp = document.createElement('div');
  tmp.innerHTML = $scope.dataImage.content.rendered;
  var img = tmp.querySelectorAll('img');
  var caption = tmp.querySelectorAll('figcaption');
  for(var i=0;i<img.length;i++){
    imgObj.src =  img[i].getAttribute('src');
    if(img[i].getAttribute('title')!=undefined){
    imgObj.title = img[i].getAttribute('title');
    }  if(img[i].getAttribute('alt')!=undefined){
    imgObj.alt = img[i].getAttribute('alt');
    }
    if(caption[i] != undefined){
    imgObj.caption = caption[i].innerHTML;
    }
    $scope.src.push(imgObj);
    imgObj = {};
     $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
  }
  $scope.hideLoad();
},function(e){$scope.hideLoad()})
$scope.onSlideChange = function(index){
 $scope.index = index;
}
$scope.bookMarkImage = function(){
  $localStorage.bookMark.push($scope.idImage);
  $scope.show=!$scope.show;
}
})

//---------------------------Comment--------------------------
.controller('commentCtrl',function($scope,$http,$stateParams,$localStorage,$state,$ionicPopup,$ionicHistory){
  var template = '<p style="text-align:center;color:red">Unable to update. Please try again later.</p>';
  var template1 = '<p style="text-align:center">Please enter text</p>';
  var dataLength;
  $scope.idcomment = $stateParams.id1;
  $scope.getComment = function(){
  $scope.showLoad();
  $http.get($scope.url+'/wp-json/wp/v2/comments?post='+$scope.idcomment+'&order=desc').then(function(res){
  $scope.dataComment = res.data;
  console.log(res.data);
  $scope.lengthData = $scope.dataComment.length;
  $scope.titleComment = 'Comments '+'('+$scope.dataComment.length+')';
  $scope.hideLoad(); 
  })
  }
    $scope.getComment();
    $scope.sendComment = function(){
      if($localStorage.login == undefined){
      $state.go('app.signin');
      }
      
      else {
      if(($scope.dataSend==undefined || $scope.dataSend.length==0)){
          $scope.showAlert(template1);
      }
      else{
      $scope.showLoad();
      $http({
      method: 'POST',
      url: $scope.url+'/wp-json/wp/v2/comments',
      data: {'content':$scope.dataSend,'post':$scope.idcomment},
      cache: false,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+$localStorage.login.token},
      withCredentials: true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        console.log(str.join("&"));
        return str.join("&");
    }
     
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      $scope.getComment();
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      console.log(response.data);
      $scope.hideLoad();
      $scope.showAlert(template);
      });
    }
  }
}

})

//---------------------------------Profile-------------------------
.controller('profileCtrl',function($scope,$http,$localStorage,$state,$cordovaCamera,$window,$ionicPopup,$rootScope){
  $scope.y = {};
  $scope.x ={};
  $scope.check = $localStorage.checkSingn;
  $scope.y.fullname = $scope.displayName;
  var base64Image;
  var template1 = '<p style="text-align:center;color:red">Unable to update. Please try again later.</p>';
  var template = '<p style="text-align:center">Successful update</p>'
  $scope.change = function(x){
    if(x.length>0){
      $scope.show4 = false;
    }
  }
   $scope.change1 = function(x){
    if(x.length>0){
      $scope.show5 = false;
    }
  } 
  $scope.change2 = function(x){
    if(x.length>0){
      $scope.show = false;
    }
  }
   $scope.change3 = function(x){
    if(x.length>0){
      $scope.show1 = false;
    }
  } 
  $scope.change4 = function(x){
    if(x.length>0){
      $scope.show2 = false;
    }
  } 
  $scope.checkConfirm = function(){
    if($scope.x.newPass == $scope.x.confirmPass){
      $scope.checkpass = false;
    }
  }
 
//   if($localStorage.login!=undefined){
//   $http.get($scope.url+'/wp-json/wp/v2/users?username='+$localStorage.login.user).then(function(res){
//     $scope.data = res.data;
//     $scope.imageProfile = $scope.data.mobiconnector_local_avatar;
//     $scope.y.fullname = $localStorage.login.user_display_name;
//   })
// }
$scope.x={};
$scope.changeEmail = function(){
  if($scope.x.emailChange==undefined || $scope.x.emailChange.length==0 ){
    $scope.show = true;
  }
  if($scope.x.curretpass==undefined || $scope.x.curretpass!=$localStorage.login.pass){
    $scope.show4 = true;
  }
  else if($scope.x.emailChange!=undefined && $scope.x.curretpass!=undefined ){
   $scope.showLoad();
     $http({
      method: 'POST',
      url: $scope.url+'/wp-json/mobiconnector/user/update_profile',
      data: {'user_email':$scope.x.emailChange},
      cache: false,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+$localStorage.login.token},
      withCredentials: true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        console.log(str.join("&"));
        return str.join("&");
    }
     
    }).then(function successCallback(response) {
      $scope.hideLoad();
      $scope.getInfoUser();
      $scope.showPopup(template);
      // this callback will be called asynchronously
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      $scope.showPopup(template1)
      $scope.hideLoad();
      });
}
}
$scope.changePass = function(){
if($scope.x.passCurrent==undefined || $scope.x.passCurrent!=$localStorage.login.pass){
  $scope.show5 = true;
}
if($scope.x.newPass == undefined || $scope.x.newPass.length==0){
  $scope.show1 = true;
}
if($scope.x.confirmPass == undefined || $scope.x.confirmPass.length==0){
  $scope.show2 = true;
}
if($scope.x.newPass!=$scope.x.confirmPass){
  $scope.checkpass = true;
}
  changePass();
}
 function changePass(){
  if($scope.x.newPass==$scope.x.confirmPass && $scope.x.passCurrent!=undefined && $scope.x.newPass!=undefined && $scope.x.passCurrent==$localStorage.login.pass
  &&$scope.x.confirmPass.length!=0&&$scope.x.newPass.length!=0){
  $scope.showLoad();
     $http({
      method: 'POST',
      url: $scope.url+'/wp-json/mobiconnector/user/update_profile',
      data: {'user_pass':$scope.x.newPass},
      cache: false,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+$localStorage.login.token},
      withCredentials: true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        console.log(str.join("&"));
        return str.join("&");
    }
     
    }).then(function successCallback(response) {
      $localStorage.login.pass = $scope.x.newPass;
      $scope.hideLoad();
      $scope.showe2(template3);
      console.log(response);
      // this callback will be called asynchronously
      }, function errorCallback(response) {
      // called asynchronously if an error occurso
      console.log(response);
      $scope.showe(template1);
      $scope.hideLoad();
      });
}

}
document.addEventListener("deviceready", function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };
    $scope.getPicture = function(){$cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.imageProfile = "data:image/jpeg;base64,"+imageData;
    base64Image = "data:image/jpeg;base64,"+imageData;
    }, function(err) {
      // error
    });}
  }, false);

$scope.updateProfile = function(){
  if(base64Image!=undefined){
   $scope.showLoad();
     $http({
      method: 'POST',
      url: $scope.url+'/wp-json/mobiconnector/user/update_profile',
      data: {'user_profile_picture':base64Image},
      cache: false,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+$localStorage.login.token},
      withCredentials: true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        console.log(str.join("&"));
        return str.join("&");
    }
    }).then(function successCallback(response) {
      $rootScope.getInfoUser();
      $scope.hideLoad();
      // this callback will be called asynchronously
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      $scope.hideLoad();
      });
}
}
$scope.changeFullName = function(){
   $scope.showLoad();
     $http({
      method: 'POST',
      url: $scope.url+'/wp-json/mobiconnector/user/update_profile',
      data: {'nickname':$scope.y.fullname},
      cache: false,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+$localStorage.login.token},
      withCredentials: true,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        console.log(str.join("&"));
        return str.join("&");
    }
     
    }).then(function successCallback(response) {
      $scope.hideLoad();
      $scope.getInfoUser();
      $scope.showPopup(template);
      // this callback will be called asynchronously
      }, function errorCallback(response) {
      // called asynchronously if an error occurs
      $scope.hideLoad();
      $scope.showPopup(template1);
      });
}
})
/*---------------------Notification----------------------*/
.controller('notifiCtrl',function($scope,$localStorage,$rootScope,$ionicPopup,$state){
  $scope.data = $localStorage.notification;
  $scope.confirm = function(id){
    var confirm = $ionicPopup.confirm({
      template:'<p style="text-align:center !important;">Are You Sure Delete This Notification?</p>'
    })
    confirm.then(function(res){
      if(res){
        //do somethin
      deleteNotifi(id);
      $state.reload();
      }
      else{
        //do something
      }
    })
  }
 function deleteNotifi(id){
  for(var i = 0;i<$localStorage.notification.length;i++){
    if(id==$localStorage.notification[i].id){
      console.log($localStorage.notification[i].id)
      $localStorage.notification.splice(i,1);
    }
  }
}

})
.controller('detailsNotifiCtrl',function($scope,$stateParams,$localStorage,$ionicHistory,$ionicPopup,$state){
  if($localStorage.login !=undefined){
  $scope.user = 'Hi '+$localStorage.login.user_display_name;
  }
  else{
    $scope.user = '';
  }
  $scope.idNotifi = $stateParams.idNotifi;
  for(var i = 0;i<$localStorage.notification.length;i++){
    if($scope.idNotifi==$localStorage.notification[i].id){
      $scope.dataNotifi = $localStorage.notification[i];
    }
  }
  function deleteNotifi(id){

  for(var i = 0;i<$localStorage.notification.length;i++){

    if(id==$localStorage.notification[i].id){
      console.log($localStorage.notification[i].id)
      $localStorage.notification.splice(i,1);
    }
  }
}
  $scope.confirm = function(id){
    var confirm = $ionicPopup.confirm({
      template:'<p style="text-align:center !important;">Are You Sure Delete This Notification?</p>'
    })
    confirm.then(function(res){
      if(res){
        //do somethin
      deleteNotifi(id);
      $state.go('app.notification');
      }
      else{
        //do something
      }
    })
  }
})
.controller('homeCtrl',function($scope,$localStorage,$state){
  
  
});

