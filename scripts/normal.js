// 获取、设置cookie
var oncookie = {
	getCookie:function(){ 
		var cookie = {};
		var all = document.cookie;
		if(all === '') return cookie;
		var list = all.split('; ');
		for (var i = 0; i < list.length; i++){
			var item = list[i];
			var p = item.indexOf('=');
			var name = item.substring(0,p);
			name = decodeURIComponent(name);
			var value = item.substring(p + 1);
			value = decodeURIComponent(value);
			cookie[name] = value;
		}
		return cookie;
	},
	setCookie:function(name,value,expires,path,domain,secure){
		var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if (expires) {
			cookieText += "; expires=" + expires.toGMTString();
		}
		if (path) {
			cookieText += "; path" + path;
		}
		if (domain) {
			cookieText += "; domain=" + domain;
		}
		if (secure) {
			cookieText += "; secure=" + secure;
		}
		document.cookie = cookieText;
	}
}

//顶部通知条
function clickClose(){
	var top = document.getElementsByClassName("top")[0],
		tclear = document.getElementById("cleartop");
	function clearClick(){
		top.style.display = "none";	
		var date = new Date();
		date.setDate(date.getDate() + 1);
		oncookie.setCookie("close","close",date);
	}
	function close(elem){
		var cookies = oncookie.getCookie();
		if(cookies.close == "close"){
			elem.style.display = "none";
		}else{
			elem.style.display = "block";
		}
	}
	close(top);
	addEvent(tclear,"click",clearClick,false);
}
clickClose();


//点击关注、登陆表单
(function(){
	var fFollow = document.getElementById("f-follow"),
		followed = document.getElementById("followed"),
		loginMask = document.getElementsByClassName("login-mask")[0],
		lClose = document.getElementById("l-close"),
		lBtn = document.getElementById("l-btn"),
		cancel = document.querySelector("#followed span:last-child") ;
	// 登陆验证
	function verify(){
		var loginForm = document.forms.login,
			username = loginForm["username"].value,
			password = loginForm["password"].value;
		username = md5(username);
		password = md5(password);
		var data = {"userName":username,"password":password};
		url = "https://study.163.com/webDev/login.htm";
		get(url,data,login);
	}
	// 回调函数login，若成功设置loginSuc和followSuc两个cookie
	function login(nu){
		if (nu == 1) {
			var date = new Date();
			date.setDate(date.getDate() + 10);/*10天有效*/
			oncookie.setCookie("loginSuc","true",date);
			get("https://study.163.com/webDev/attention.htm","",function(a){
				if (a == 1) {
					var da = new Date();
					da.setDate(da.getDate() + 10);/*10天有效*/
					oncookie.setCookie("followSuc","true",da);
					fFollow.style.display = "none";
					followed.style.display = "inline-block";
				}
			});
			show();
		} else {
			alert("登录失败，请检查您的用户名或密码！");
		}
	}
	//关注按钮事件函数
	function show(){
		var cookies = oncookie.getCookie();
		if (cookies.loginSuc) {
			loginMask.style.display = "none";
			follow(cookies);
		} else {
			loginMask.style.display = "block";
		}
	}
	function follow(ck){
		if (ck.followSuc) {
			fFollow.style.display = "none";
			followed.style.display = "inline-block";
		} else {
			followed.style.display = "none";
			fFollow.style.display = "inline-block";
		}
	}
	var cookie = oncookie.getCookie();
	follow(cookie);//页面加载后判断是否关注
	// 取消关注
	function recover(){
		followed.style.display = "none";
		fFollow.style.display = "inline-block";
	}
	// 弹出登陆表单
	addEvent(fFollow,"click",show,false);
	// 关闭登陆表单
	addEvent(lClose,"click",function(event){
		loginMask.style.cssText = "display: none";
	},false);
	// 提交登陆表单
	addEvent(lBtn,"click",verify,false);
	// 取消关注
	addEvent(cancel,"click",recover,false);
})()


// banner轮播事件
function carousel(){
	var index = 0;
	var timer = null;
	var ban = document.getElementById("b-banner");
	var pic = document.querySelectorAll("#b-banner li");
	var num = document.querySelectorAll("#b-num li");
	// 封装函数changeOption
	function changeOption(curindex){
		for (var i = 0; i < pic.length; i++) {
			// removeClassName(pic[i],"show");
			removeClassName(num[i],"active");
			removeClassName(pic[i],"fade-in");
		}
		// addClassName(pic[curindex],"show");
		addClassName(pic[curindex],"fade-in");/*500ms淡入*/
		addClassName(num[curindex],"active");
	}
	//定义定时器
	timer = setInterval(run,5000);
	//封装函数run
	function run(){
		index += 1;
		if (index >= pic.length) {index = 0};
		changeOption(index);
	}
	//点击对应小圆点实现图片切换、闭包
	for (var j = 0; j < num.length; j++) {
		(function(a){
			addEvent(num[a],"click",changeNum);
			function changeNum(){
				for (var k = 0; k < pic.length; k++) {
				removeClassName(num[k],"active");
				removeClassName(pic[k],"fade-in");
				}
				addClassName(pic[a],"fade-in");
				addClassName(num[a],"active");
			}
		})(j)
	}
	//鼠标移入清除定时器
	addEvent(ban,"mouseover",function(event){
		clearInterval(timer);
	},false);
	//鼠标移出恢复定时器
	addEvent(ban,"mouseout",function(event){
		timer = setInterval(run,5000);
	},false);
}
carousel();


//弹出视频事件
function videoPlay(){
	var pVideo = document.getElementById("p-video");
	var vMask = document.getElementsByClassName("v-mask")[0];
	var vClose = document.getElementById("v-close");
	// 弹出视频
	addEvent(pVideo,"click",function(event){
		vMask.style.cssText = "display: visibility";
	},false);
	// 关闭视频
	addEvent(vClose,"click",function(event){
		vMask.style.cssText = "display: none";
		document.getElementById("onvideo").pause();	
	},false);
}
videoPlay();


// 课程部分
//tab标签增加事件
var tabLi = document.querySelectorAll(".bodydown .main .title li");
var proDesign = document.getElementById("pd");
var proLanguage = document.getElementById("pl");
var courseUl = document.querySelectorAll(".bodydown .course ul");
var pdCourse = document.getElementById("pd-course");
var plCourse = document.getElementById("pl-course");
var liBtn = document.querySelectorAll(".page-inner li");
addEvent(proDesign,"click",function(){
	for (var i = 0; i < tabLi.length; i++) {
		removeClassName(tabLi[i],"active");/*遍历去除tab选中样式*/
		removeClassName(courseUl[i],"active");/*遍历两种课程容器ul均为隐藏*/
	}
	for (var j = 0; j < liBtn.length; j++) {
		removeClassName(liBtn[j],"checked");/*遍历去除分页码选中样式*/
		addClassName(liBtn[1],"checked");/*更换tab后保持页码1默认选中*/
	}
	addClassName(proDesign,"active");
	addClassName(pdCourse,"active");
	pdCourse.innerHTML = "";
	get(setCourse.url,parameters(),setCourse.addElements);
},false)
addEvent(proLanguage,"click",function(){
	for (var i = 0; i < tabLi.length; i++) {
		removeClassName(tabLi[i],"active");
		removeClassName(courseUl[i],"active");
	}
	for (var j = 0; j < liBtn.length; j++) {
		removeClassName(liBtn[j],"checked");
		addClassName(liBtn[1],"checked");
	}
	addClassName(proLanguage,"active");
	addClassName(plCourse,"active");
	plCourse.innerHTML = "";
	get(setCourse.url,parameters(),setCourse.addElements);
},false)
//封装课程对象
var setCourse = {
	url: "https://study.163.com/webDev/couresByCategory.htm",
	addElements:function(getdata){
		//判断产品设计、编程语言哪个是block的
		function isBlock(){
			if (window.getComputedStyle(pdCourse).display == "block") {
				return document.getElementById("pd-course");
			} else {
				return document.getElementById("pl-course");
			}
		} 
		
		var user = JSON.parse(getdata),li,img,div,h3,p1,a,p2,p3;
		var ulParent = isBlock();
		for (var i = 0; i < user.pagination.pageSize; i++) {
			li = document.createElement("li");
			img = document.createElement("img");
			img.setAttribute("src",user.list[i].middlePhotoUrl);
			img.setAttribute("alt","课程名称");
			div = document.createElement("div");
			div.setAttribute("class","txt");
			h3 = document.createElement("h3");
			h3.setAttribute("class","name");
			h3.innerHTML = user.list[i].name;
			p1 = document.createElement("p");
			p1.setAttribute("class","provider");
			a = document.createElement("a");
			a.setAttribute("href",user.list[i].providerLink);
			a.setAttribute("target","_blank");
			a.innerHTML = user.list[i].provider;
			p2 = document.createElement("p");
			p2.setAttribute("class","learners");
			p2.innerHTML = user.list[i].learnerCount;
			p3 = document.createElement("p");
			p3.setAttribute("class","price");
			p3.innerHTML = "¥ " + user.list[i].price;
			p1.appendChild(a);
			div.appendChild(h3);
			div.appendChild(p1);
			div.appendChild(p2);
			div.appendChild(p3);
			li.appendChild(img);
			li.appendChild(div);
			ulParent.appendChild(li);
		}
	}
}
// 设置课程请求参数 
function parameters(){
	function type(){
		// var pc = document.getElementById("pd-course"),
			style = window.getComputedStyle(pdCourse).display;
		if(style == "block"){
			return 10;
		}else {
			return 20;
		}
	}
	function querySize(){
		var x = window.innerWidth;
		if(x<=1205){
			return 15;
		}else{
			return 20;
		}
	}
	var data = {'pageNo':1,'psize':querySize(),'type':type()}
	return data;
}
get(setCourse.url,parameters(),setCourse.addElements);
//分页器
function selectPage(){
	var liBtn = document.querySelectorAll(".page-inner li"),
		pdCourse = document.getElementById("pd-course"),
		plCourse = document.getElementById("pl-course"),
		elem,
		inum = 1;/*页码*/
	function whichUl(){
		var style = window.getComputedStyle(pdCourse).display;
		if(style == 'block'){
			return pdCourse;
		}else {
			return plCourse;
		}
	}
	for (var i = 0; i < liBtn.length; i++) {
		//闭包，所有页码绑定click事件
		(function(i){addEvent(liBtn[i],"click",function(){
			if (i != 0 && i != liBtn.length-1) {
				for (var j = 0; j < liBtn.length; j++) {
					removeClassName(liBtn[j],"checked");
				}
				inum = i;/*保存页码*/
				addClassName(liBtn[i],"checked");
				var ob = parameters();
				ob.pageNo = i;
				elem = whichUl();
				elem.innerHTML = "";
				get(setCourse.url,ob,setCourse.addElements);
			}
		},false)})(i)
	}
	// 前进、后退事件
	function clickFB(){
		var forwards = document.getElementById("forwards"),
			backwards = document.getElementById("backwards");
		addEvent(forwards,"click",fwClick,false);
		addEvent(backwards,"click",bwClick,false);
		function fwClick(){
			if (inum >= 2) {
				for (var i = 0; i < liBtn.length; i++) {
					removeClassName(liBtn[i],"checked");
				}
				addClassName(liBtn[inum-1],"checked");
				var ob1 = parameters();
				ob1.pageNo = inum-1;
				inum -= 1;
				elem1 = whichUl();
				elem1.innerHTML = "";
				get(setCourse.url,ob1,setCourse.addElements);
			}
		}
		function bwClick(){
			if (inum <= liBtn.length-3) {
				for (var j = 0; j < liBtn.length; j++) {
					removeClassName(liBtn[j],"checked");
				}
				addClassName(liBtn[inum+1],"checked");
				var ob2 = parameters();
				ob2.pageNo = inum+1;
				inum += 1;
				elem2 = whichUl();
				elem2.innerHTML = "";
				get(setCourse.url,ob2,setCourse.addElements);
			}
		}
	}
	clickFB();
}
selectPage();


// 热门排行
window.onload = function(){
	var hotList = {
		url: "https://study.163.com/webDev/hotcouresByCategory.htm",
		addElements: function(g_data){
			var user = JSON.parse(g_data),li,img,a,span;
			var ulHotList = document.getElementById("h-hotlist");
			for (var i = 0; i < user.length; i++) {
				li = document.createElement("li");
				img = document.createElement("img");
				a = document.createElement("a");
				span = document.createElement("span");
				img.setAttribute("src",user[i].smallPhotoUrl);
				a.innerHTML = user[i].name;
				span.innerHTML = user[i].learnerCount;
				li.appendChild(img);
				li.appendChild(a);
				li.appendChild(span);
				ulHotList.appendChild(li);
			}
		}
	}
	get(hotList.url,"",hotList.addElements);
	//向上滚动
	function listScroll(){
		var ul = document.getElementById("h-hotlist");
		var x = parseInt(window.getComputedStyle(ul).top);
		// var lTop = ""; 
		if (x >= -700) {
			x -= 70;
			// lTop = x + "px";
			ul.style.top = x + "px";
		} else {
			ul.style.top = 0 + "px";
		}
	}
	setInterval(listScroll,5000);
}
