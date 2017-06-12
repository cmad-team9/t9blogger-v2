
function configureMenuBarOptions(screen){
	console.log("configureMenuBarOptions :"+screen);
	switch(screen){
		case "login":
			console.log("configureMenuBarOptions login");
			$("#newBlogBtn_loggedIn").hide();
			$("#newBlogBtn_loggedOut").hide();
			$("#updateProfileBtn").hide();
			$("#loginBtn").hide();
			$("#logoutBtn").hide();
			$("#myblogsFilter").hide();
			break;
		case "loggedIn":
			console.log("configureMenuBarOptions LOGGEDIN");
			$("#newBlogBtn_loggedIn").show();
			$("#newBlogBtn_loggedOut").hide();
			$("#updateProfileBtn").show();
			$("#loginBtn").hide();
			$("#logoutBtn").show();
			$("#myblogsFilter").show();
			break;
		case "loggedOut":
			console.log("configureMenuBarOptions LOGGEDOUT");
			$("#newBlogBtn_loggedIn").hide();
			$("#newBlogBtn_loggedOut").show();
			$("#updateProfileBtn").hide();
			$("#loginBtn").show();
			$("#logoutBtn").hide();
			$("#myblogsFilter").hide();
			break;
		default:
			break;
	}
}
	
function fetchAllBlogs(searchStr,userfilter){
	console.log("fetchAllBlogs searchStr:"+searchStr+" userfilter:"+userfilter);
	if(searchStr != undefined && searchStr != null && searchStr.trim != "")
	{
		console.log("fetchAllBlogs storing searchStr"+searchStr);
		$("#searchBtn").data("searchStr",searchStr);
	} else {
		console.log("fetchAllBlogs clearing searchStr");
		$("#searchBtn").removeData("searchStr");
	}
	
	
	$.ajax({
		url : 'rest/blogger/blogs',
		type : 'get',
		contentType: "application/json; charset=utf-8",
		dataType : 'json',
		data : {"offset": "0","pageSize": "3","searchStr":searchStr,"userFilter":userfilter},
		success : function(data,textStatus, jqXHR) { 
			console.log("fetchAllBlogs success callback :"+data);
			displayBlogs(data,textStatus, jqXHR);
			
			
		},
		error : function( jqXHR,textStatus, errorThrown ) {
			console.log("fetchAllBlogs error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
			showErrorScreen("No content available.\nPlease create one");
		},
		 complete : function( jqXHR, textStatus ) {
			console.log("fetchAllBlogs complete callback"); 
			$("#searchInput").val("");
			$("#newBlogTitle").val("");
		    $("#blogDescriptionIInput").val("");
		}
	});
} 

function hideAllScreens() {
	console.log("hideAllScreens"); 
	$("#homeScreenBody").hide();
	$("#loginScreen").hide();
	$("#signUpScreen").hide();
	$("#profileUpdateScreen").hide();
	$("#newBlogScreen").hide();
	$("#selectedPost").hide();
	$("#loginToComment").hide();
	$("#addCommentOption").hide();
	$("#commentDetails").hide();
	$("#errorScreen").hide();
}

function showErrorScreen(errorMsg){
	console.log("showErrorScreen :"+errorMsg); 
	hideAllScreens();
	$("#errorMsg").text(errorMsg);
	$("#errorScreen").show();
	
}

function displayBlogs(data,textStatus, jqXHR) {
	console.log("displayBlogs"); 
	hideAllScreens();
	for(i = 0;i < 3;i++){ 
		if(i < data.length) {
			console.log("Blog loop idx :"+i);
			$("#post"+i+"Heading").text(data[i].title);
			console.log("Blog Title:"+data[i].title);
			$("#post"+i+"Content").text(data[i].description);
			console.log("Blog Content:"+data[i].description);
			console.log("**Blog id  :"+data[i].blogId);
			
			$("#commentOptionspost"+i).data("blogData",data[i]);
			console.log("Comment data :"+($("#commentOptionspost"+i).data("blogData")));
			console.log("Blog user:"+data[i].userId);
			console.log("Blog created time:"+data[i].postedDate);
			console.log("Blog created time:"+($.format.prettyDate(data[i].postedDate)));
			$("#commentOptionspost"+i).text("COMMENTS");
			$("#post"+i+"author").text("Posted by "+data[i].userId);
			$("#post"+i+"time").text($.format.prettyDate(data[i].postedDate));
		}else {
			console.log("Clearing stale data");
			$("#commentOptionspost"+i).text("");
			$("#post"+i+"Heading").text("");
			$("#post"+i+"Content").text("");
			$("#commentOptionspost"+i).removeData("blogData");
			$("#post"+i+"author").text("");
			$("#post"+i+"time").text("");
		}		
	}
	$("#homeScreenBody").show();
	configurePagingOptions(jqXHR.getResponseHeader("LINK"));
	console.log("LinkHeader at client :"+jqXHR.getResponseHeader("LINK"));
}

function configureCommentPagingOptions(linkheader) {
	console.log(" configureCommentPagingOptions linkheader.length:"+linkheader.length);
	$("#loadMoreComments").hide();
	$("#loadMoreComments").removeData("targetUrl");
	if(linkheader.length != 0) {
		var parsedLinks = parse_link_header(linkheader); 
		console.log("Parsing linkheader :"+parsedLinks);
		for (var key in parsedLinks) {
			var keyToMatch = key.toLowerCase();
			console.log("keyToMatch:"+keyToMatch);
			
			if(keyToMatch === "next") {
				console.log("Showing load more comments");
				$("#loadMoreComments").show();
				$("#loadMoreComments").data("targetUrl",parsedLinks[key]);
			}
		}
	} else {
		$("#loadMoreComments").hide();
		$("#loadMoreComments").removeData("targetUrl");
	}
}

function clearExtraCommentDivs() {
	console.log("clearExtraCommentDivs");
	var totalCommentDivs = $("#loadMoreComments").data("loadedCommentCount");
	console.log("totalCommentDivs :"+totalCommentDivs);
	$(".extradivs").remove();
	console.log("Total divs after removing extra :"+$("#commentPosts > div").length);
	$("#loadMoreComments").data("loadedCommentCount",0);
}

function configurePagingOptions(linkheader) {
	console.log("configurePagingOptions linkheader.length:"+linkheader.length);
	$("#next").hide();
	$("#next").removeData("targetUrl");
	$("#prev").hide();
	$("#prev").removeData("targetUrl");
	$("#first").hide();
	$("#first").removeData("targetUrl");
	$("#last").hide();
	$("#last").removeData("targetUrl");
	if(linkheader.length != 0) {
		var parsedLinks = parse_link_header(linkheader); 
		console.log("--Parsing linkheader-- :"+parsedLinks);
		
		for (var key in parsedLinks) {
			var keyToMatch = key.toLowerCase();
			console.log("keyToMatch:"+keyToMatch);
			if(keyToMatch === "next") {
				console.log("Showing next");
				$("#next").show();
				$("#next").data("targetUrl",parsedLinks[key]);
			}
			if(keyToMatch === "prev") {
				console.log("Showing prev");
				$("#prev").show();
				$("#prev").data("targetUrl",parsedLinks[key]);
			}
			if(keyToMatch === "first") {
				console.log("Showing first");
				$("#first").show();
				$("#first").data("targetUrl",parsedLinks[key]);
			}
			if(keyToMatch === "last"){
				console.log("Showing last");
				$("#last").show();
				$("#last").data("targetUrl",parsedLinks[key]);
			}
			console.log("parsedLink:"+parsedLinks[key]);
		}
	}
}

function fetchBlogComments(blogId,sortorder){
	console.log("fetchBlogComments"); 
	//remove dynamically created contents
	clearExtraCommentDivs();
	// to avoid flicker
	$("#loadMoreComments").hide();
	$.ajax({
		url : 'rest/blogger/blogs/'+blogId+'/comments',
		type : 'get',
		contentType: "application/json; charset=utf-8",
		dataType : 'json', 
		data : {"offset": "0","pageSize": "3","sortOrder":sortorder},
		success : function(data,textStatus, jqXHR) { 
			console.log("fetchBlogComments success callback:"+data);
			for(i = 0;i < data.length;i++){ 
				var newcommentIdx = i;
				console.log("new comment Id:"+newcommentIdx);
				var commentData = data[i].comment;
				var commentAuthor = data[i].commentorId;
				var commentTime = $.format.prettyDate(data[i].postedDate);
				comment = $("<div id ='comment'+newcommentIdx class='extradivs'>").append("<p id='comment'+newcommentIdx>"+commentData+"</p>")
						       .append($("<div id ='comment'+newcommentIdx+'meta' class='commentmeta' style='margin-left: 40%;font-size: 12px;font-style: italic;'>Posted by </div>")
							   .append("<span id = 'comment'+newcommentIdx+'author'>"+commentAuthor+" "+"</span>")
						       .append("<time id = 'comment'+newcommentIdx+'time'>"+commentTime+"</time>"))
							   .append('<hr/>');

				$("#commentPosts").append(comment);
				console.log("Total divs after adding :"+$("#commentPosts > div").length);
				console.log("Comment:"+data[i].comment);
				console.log("commentor:"+data[i].commentorId);
				console.log("Blog id:"+data[i].blogId);
				console.log("Comment created time:"+data[i].postedDate);
				console.log("Comment created time:"+($.format.prettyDate(data[i].postedDate)));
			}
			$("#loadMoreComments").data("loadedCommentCount",data.length);
			configureCommentPagingOptions(jqXHR.getResponseHeader("LINK"));
			
			
		},
		error : function( jqXHR,textStatus, errorThrown ) {
			console.log("fetchBlogComments error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
			// Need to show in a miniscreen.Let's leave it for now.
			//showErrorScreen("No content Found");
		},
		 complete : function( jqXHR, textStatus ) {
			console.log("fetchBlogComments complete callback"); 
			$("#commentInput").val("");
		}
	});
} 

function parse_link_header(header) {
	console.log("parse_link_header");
	if (header.length == 0) {
		throw new Error("input must not be of zero length");
	}
	// Split parts by comma
	var parts = header.split(',');
	var links = {};
	// Parse each part into a named link
	for(i=0;i<parts.length;i++)
	{
		var section = parts[i].split(';');
		if (section.length != 2) {
			throw new Error("section could not be split on ';'");
		}
		var url = section[0].replace(/<(.*)>/, '$1').trim();
		var name = section[1].replace(/rel="(.*)"/, '$1').trim();
		links[name] = url;
	}
	return links;
}

function showNewBlogScreen(){
	console.log("showNewBlogScreen");
	hideAllScreens();
	$("#newBlogScreen").show();
}

function showBlogAndCommentsScreen() {
	console.log("showBlogAndCommentsScreen");
	hideAllScreens();
	//reset
	$("#commentSortingOrder").val("oldest");
	$("#loadMoreComments").removeData("sortorder");
	
	var blogData = $("#selectedPost").data("blogData");
	console.log("blogData.title :"+blogData.title);
	console.log("blogData.description :"+blogData.description);
	$("#selectedHeading").text(blogData.title);
	$("#selectedContent").text(blogData.description);
	console.log("Token:"+window.sessionStorage.getItem('accessToken'));
	fetchBlogComments(blogData.blogId);
	$("#addCommentOption").data("blogId",blogData.blogId);
	$("#selectedPost").show();
	$("#commentDetails").show();
	if(window.sessionStorage.getItem('accessToken') != null){
		$("#addCommentOption").show();
	}
	else{
		console.log("showing logged out blog and comments screen");
		$("#loginToComment").show();
	}
}

$(document).ready(function() {
	console.log("**Document Ready**");
	configureMenuBarOptions("loggedOut");
	fetchAllBlogs();
	$("#homeScreenBody").show();
	$("#next").hide();	
	$("#prev").hide();
	$("#first").hide();	
	$("#last").hide();

	$("#commentOptionspost0,#commentOptionspost1,#commentOptionspost2").click(function(e) {
		var blogData = $(this).data("blogData");
		console.log("Inside click attr blogData:"+blogData);
		console.log("Inside click attr blogData.title:"+blogData.title);
		$("#selectedPost").data("blogData",blogData);
		showBlogAndCommentsScreen();
	});
		
	$("#loginBtn").click(function(e) {
		hideAllScreens();
		configureMenuBarOptions("login");
		console.log("triggering reset");
		$('#loginForm').trigger("reset");
		$("#loginScreen").show();
	});
	
	$("#signUp").click(function(e) {
		hideAllScreens();
		$("#userid").val("");
		$("#signuppassword").val("");
		$("#firstname").val("");
		$("#lastname").val("");
		$("#nickname").val("");
		$("#signUpScreen").show();
	});
	
	$("#updateProfileBtn").click(function(e) {
		var userId = $("#updateProfileBtn").data("userData");
		console.log("updateProfileBtn profile userid :"+userId);
		$.ajax({
			url : 'rest/blogger/user/'+userId,
			type : 'get',
			contentType: "application/json; charset=utf-8",
			headers: {"AUTHORIZATION": window.sessionStorage.getItem('accessToken')},
			dataType : 'json', 
			success : function(data,textStatus, jqXHR) { 
				console.log("updateProfile success callback");
				console.log("data.firstName :"+data.firstName);
				console.log("data.lastName :"+data.lastName);
				console.log("data.nickName :"+data.nickName);
				$("#updatedpassword").attr("placeholder","");
				$("#updatedfirstname").attr("placeholder",data.firstName);
				$("#updatedlastname").attr("placeholder",data.lastName);
				$("#updatednickname").attr("placeholder",data.nickName);
				hideAllScreens();
				$("#profileUpdateScreen").show();	
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("updateProfile error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				//showErrorScreen("Unexpected Error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("updateProfile complete callback"); 
			}
		});
	});
	
	$("#saveSignUpDetailsBtn").click(function() {
		var userId = $("#userid").val();
		console.log("userId:"+userId);
		var passwordStr = $("#signuppassword").val();
		console.log("passwordStr:"+passwordStr);
		var firstName = $("#firstname").val();
		console.log("firstName:"+firstName);
		var lastName = $("#lastname").val();
		console.log("lastName:"+lastName);
		var nickName = $("#nickname").val();
		console.log("nickName:"+nickName);
		
		var user = {
			"userId" : userId,
			"password" : passwordStr,
			"firstName" : firstName,
			"lastName" : lastName,
			"nickName" : nickName
		};
		$.ajax({
			url : 'rest/blogger/user',
			type : 'post',
			contentType: "application/json; charset=utf-8",
			success : function(data,textStatus, jqXHR) { 
				console.log("saveSignUpDetailsBtn success callback");
				console.log("Token:"+jqXHR.getResponseHeader("AUTHORIZATION"));
				window.sessionStorage.accessToken = jqXHR.getResponseHeader("AUTHORIZATION");
				console.log("signUpuserName callback:"+userId);
				$("#updateProfileBtn").data("userData",userId);
				$("#myblogsFilter").data("userData",userId);
				if(window.sessionStorage.getItem("prevAction") == "newBlog"){
					console.log("removing PrevAction and showing new blog screen");
					window.sessionStorage.removeItem("prevAction");
					showNewBlogScreen();
				} else if(window.sessionStorage.getItem("prevAction") == "addComment") {
					console.log("removing PrevAction and showing add comment screen");
					window.sessionStorage.removeItem("prevAction");
					showBlogAndCommentsScreen();
				}
				else{
					console.log("showing logged in options");
					configureMenuBarOptions("loggedIn");
					$("#myblogsFilter").val("My Blogs");
					fetchAllBlogs(null,userId);
				}
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("saveSignUpDetailsBtn error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("saveSignUpDetailsBtn complete callback"); 
				
			},
			data : JSON.stringify(user)
		});
	});
	
	$("#loginForm").submit(function(e) {
		console.log("loginForm form submitted **");
		console.log("form data array:"+$(this).serializeArray());
		console.log("form data 1:"+$(this).serialize());
		var signInUsername = $('#loginForm').find('input[name="userId"]').val();
		console.log("signInuserName :"+signInUsername);
		$("#submitButton").attr("disabled", true);
		$.ajax({
			   type: 'post',
			   url: 'rest/blogger/login',
			   contentType: "application/x-www-form-urlencoded; charset=utf-8",
			   data: $("#loginForm").serialize(), // serializes the form's elements.
			   success : function(data,textStatus, jqXHR) { 
					console.log("loginForm success callback");
					console.log(jqXHR.getResponseHeader("AUTHORIZATION"));
					window.sessionStorage.accessToken = jqXHR.getResponseHeader("AUTHORIZATION");
					console.log("stored prevAction:"+window.sessionStorage.getItem("prevAction"));
					$("#updateProfileBtn").data("userData",signInUsername);
					$("#myblogsFilter").data("userData",signInUsername);
					if(window.sessionStorage.getItem("prevAction") == "newBlog"){
						console.log("loginForm removing PrevAction and showing new blog screen");
						window.sessionStorage.removeItem("prevAction");
						showNewBlogScreen();
					} else if(window.sessionStorage.getItem("prevAction") == "addComment") {
						console.log("loginForm removing PrevAction and showing add comment screen");
						window.sessionStorage.removeItem("prevAction");
						showBlogAndCommentsScreen();
					}
					else{
						console.log("loginForm showing logged in options");
						$("#myblogsFilter").val("My Blogs");
						fetchAllBlogs(null,signInUsername);
						configureMenuBarOptions("loggedIn");
					}
					
			   },
			   error : function( jqXHR,textStatus, errorThrown ) {
					console.log("loginForm error callback :"+jqXHR+" textStatus :"+textStatus+" errorThrown:"+errorThrown);
					//showErrorScreen("Unexpected error");
			   },
			   complete : function( jqXHR, textStatus ) {
					console.log("loginForm complete callback");
					$("#submitButton").attr("disabled", false);					
			   },
			   
			   statusCode: {
					401: function() {
					  alert('Invalid username/password');
					  $('#loginForm').trigger("reset");
					}
				}
			   
			 });

		e.preventDefault(); // avoid to execute the actual submit of the form.
	});
	
	$("#logoutBtn").click(function(e) {
		console.log("Logging out in progress")
		window.sessionStorage.clear();
		configureMenuBarOptions("loggedOut");
		//reset
		$("#myblogsFilter").val("My Blogs");
		$("#commentSortingOrder").val("oldest");
		//hide immediately
		hideAllScreens();
		fetchAllBlogs();
	});
	
	$("#saveProfileBtn").click(function() {
		console.log("saveProfileBtn");
		var passwordStr = $("#updatedpassword").val();
		console.log("updated passwordStr:"+passwordStr);
		var firstName = $("#updatedfirstname").val();
		console.log("updated firstName:"+firstName);
		var lastName = $("#updatedlastname").val();
		console.log("updated lastName:"+lastName);
		var nickName = $("#updatednickname").val();
		console.log("updated nickName:"+nickName);
		
		var userId = $("#myblogsFilter").data("userData");
		console.log("saveProfileBtn Logged in user :"+userId);
		
		var user = {
			"password" : passwordStr,
			"firstName" : firstName,
			"lastName" : lastName,
			"nickName" : nickName
		};
		$.ajax({
			url : 'rest/blogger/user',
			type : 'put',
			contentType: "application/json; charset=utf-8",
			headers: {"AUTHORIZATION": window.sessionStorage.getItem('accessToken')},
			success : function(data,textStatus, jqXHR) { 
				console.log("saveProfileBtn success callback");
				configureMenuBarOptions("loggedIn");
				$("#myblogsFilter").val("My Blogs");
				fetchAllBlogs(null,userId);	
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("saveProfileBtn error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("saveProfileBtn complete callback"); 
			},
			data : JSON.stringify(user)
		});
	});
	
	
	$("#loginToComment").click(function(e) {
		console.log("login to comment- showing login page");
		hideAllScreens();
		window.sessionStorage.setItem("prevAction","addComment");
		configureMenuBarOptions("login");
		$('#loginForm').trigger("reset");
		$("#loginScreen").show();
	});
	
	$("#newBlogBtn_loggedOut").click(function(e) {
		console.log("newBlogBtn_loggedOut");
		hideAllScreens();
		window.sessionStorage.setItem("prevAction","newBlog");
		configureMenuBarOptions("login");
		$('#loginForm').trigger("reset");
		$("#loginScreen").show();
	});
	
	$("#newBlogBtn_loggedIn").click(function(e) {
		console.log("newBlogBtn_loggedIn");
		showNewBlogScreen();
	});
	
	$("#submitNewBlogbtn").click(function() {
		console.log("submitNewBlogbtn");
		var blogTitle = $("#newBlogTitle").val();
		console.log("new BlogTitle:"+blogTitle);
		var blogDescription = $("#blogDescriptionIInput").val();
		console.log("new blogDescription:"+blogDescription);
		var userId = $("#myblogsFilter").data("userData"); 
		console.log("Logged in user :"+userId);
		var blog = {
			"title" : blogTitle,
			"description" : blogDescription
			
		};
		$.ajax({
			url : 'rest/blogger/blogs',
			type : 'post',
			contentType: "application/json; charset=utf-8",
			headers: {"AUTHORIZATION": window.sessionStorage.getItem('accessToken')},
			success : function(data,textStatus, jqXHR) { 
				console.log("submitNewBlogbtn success callback");
				configureMenuBarOptions("loggedIn");
				$("#myblogsFilter").val("My Blogs");
				fetchAllBlogs(null,userId);	
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("submitNewBlogbtn error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				//showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("submitNewBlogbtn complete callback"); 
			},
			data : JSON.stringify(blog),
			statusCode: {
					400: function() {
					  alert('Incorrect data entered.Kindly recheck');
					}
			}
		});
	});
	
	$("#submitCommentbtn").click(function() {
		console.log("submitCommentbtn");
		var blogId = $("#addCommentOption").data("blogId");
		console.log("commentInput blogId:"+blogId);
		var commentDescription = $("#commentInput").val();
		console.log("commentInput commentDescription:"+commentDescription);
		var sortOrder = $("#loadMoreComments").data("sortorder");
		var comment = {
			"comment" : commentDescription
			
		};
		$.ajax({
			url : 'rest/blogger/blogs/'+blogId+'/comments',
			type : 'post',
			contentType: "application/json; charset=utf-8",
			headers: {"AUTHORIZATION": window.sessionStorage.getItem('accessToken')},
			success : function(data,textStatus, jqXHR) { 
				console.log("submitCommentbtn success callback");
				$("#commentInput").val(""); 
				
				if(sortOrder === "newest") {
					console.log("submitCommentbtn sorting order newest first");
					fetchBlogComments(blogId,sortOrder);
				} else {
					console.log("submitCommentbtn sorting order oldest first");
					fetchBlogComments(blogId);
				}
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("submitCommentbtn error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				//showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("submitCommentbtn complete callback"); 
			},
			data : JSON.stringify(comment),
			statusCode: {
					400: function() {
					  alert('Incorrect data entered.Kindly recheck');
					}
			}
		});
	});
	
	
	$("#next,#prev,#first,#last").click(function() {
		console.log("blog pagination options");
		var targetUrl = $(this).data("targetUrl");
		console.log("targetUrl in pagingOptions click :"+targetUrl);
		var userfilter;
		userPref = $('#myblogsFilter').val();
		console.log("userpref :"+userPref);
		if(window.sessionStorage.getItem('accessToken') != null && userPref === "My Blogs"){
			console.log("applying user filter");
			userfilter = $("#myblogsFilter").data("userData");
		}
		var searchStr = $("#searchBtn").data("searchStr");
		console.log("search String in next:"+searchStr);
		$.ajax({
			url : targetUrl,
			type : 'get',
			contentType: "application/json; charset=utf-8",
			data : {"searchStr":searchStr,"userFilter":userfilter},
			dataType : 'json', 
			success : function(data,textStatus, jqXHR) { 
				console.log("blog pagination options success callback");
			    displayBlogs(data,textStatus, jqXHR);
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("blog pagination options error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown:"+errorThrown);
				showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("blog pagination options complete callback"); 
			}
		});
	});
	
	$("#searchBtn").click(function(e) {
		var searchStr = $("#searchInput").val();
		console.log("searchBtn clicked -Searched for :"+searchStr);
		fetchAllBlogs(searchStr);
	
	});

	
	$(".navbar-brand").click(function(e) {
		console.log("home button pressed");
		var userId = $("#myblogsFilter").data("userData");
		console.log("Logged in user :"+userId);
		window.sessionStorage.removeItem("prevAction");
		if(window.sessionStorage.getItem('accessToken') != null){
			console.log("showing logged in home screen");
			configureMenuBarOptions("loggedIn");
			$("#myblogsFilter").val("My Blogs");
			fetchAllBlogs(null,userId);
		}
		else{
			console.log("showing logged out home screen");
			configureMenuBarOptions("loggedOut");
			fetchAllBlogs();
		}
	
	});
	
	$('#myblogsFilter').change(function(){ 
		var selectedOption = $(this).val();
		console.log("myblogsFilter selectedOption:"+selectedOption);
		var userId = $("#myblogsFilter").data("userData");
		console.log("myblogsFilter Logged in user :"+userId);
		switch(selectedOption){
			case "My Blogs":
				fetchAllBlogs(null,userId);
				break;
			case "All Blogs":
				fetchAllBlogs();
				break;
			default:
				break;
		}
	});
	
	$('#commentSortingOrder').change(function(){ 
		var sortingorder = $(this).val();
		console.log("sorting order sortingorder:"+sortingorder);
		console.log("sorting order sortingorder text:"+$('#commentSortingOrder').find(":selected").text());
		var blogId = $("#selectedPost").data("blogData").blogId;
		console.log("sorting order blogId:"+blogId);
		$("#loadMoreComments").hide();
		$("#loadMoreComments").removeData("targetUrl");
		$("#loadMoreComments").data("sortorder",sortingorder);
		switch(sortingorder) {
			case "oldest":
				console.log("sorting order oldest first");
				fetchBlogComments(blogId);
				break;
			case "newest":
				console.log("sorting order newest first");
				fetchBlogComments(blogId,sortingorder);
				break;
			default:
				break;
		}
	});
	
	
	$("#loadMoreComments").click(function(e) {
		console.log("loading more comments**");
		var targetUrl = $(this).data("targetUrl");
		console.log("targetUrl in comment pagingOptions click :"+targetUrl);
		var loadedCommentCount = $("#loadMoreComments").data("loadedCommentCount");
		var sortorder = $("#loadMoreComments").data("sortorder");
		console.log("loading more comments sortorder:"+sortorder);
		console.log("Total divs b4 adding :"+$("#commentPosts > div").length);
		$.ajax({
			url : targetUrl,
			type : 'get',
			contentType: "application/json; charset=utf-8",
			data : {"sortOrder":sortorder},
			dataType : 'json', 
			success : function(data,textStatus, jqXHR) { 
				console.log("loading more comments success callback");
				for(i = 0;i < data.length;i++){ 
					var newcommentIdx = (loadedCommentCount+i);
					console.log("new comment Id:"+newcommentIdx);
					var commentData = data[i].comment;
					var commentAuthor = data[i].commentorId;
					var commentTime = $.format.prettyDate(data[i].postedDate);
					comment = $("<div id ='comment'+newcommentIdx class='extradivs'>").append("<p id='comment'+newcommentIdx>"+commentData+"</p>")
							       .append($("<div id ='comment'+newcommentIdx+'meta' class='commentmeta' style='margin-left: 40%;font-size: 12px;font-style: italic;'>Posted by </div>")
								   .append("<span id = 'comment'+newcommentIdx+'author'>"+commentAuthor+" "+"</span>")
							       .append("<time id = 'comment'+newcommentIdx+'time'>"+commentTime+"</time>"))
								   .append('<hr/>');;

					$("#commentPosts").append(comment);
					console.log("Total divs after adding :"+$("#commentPosts > div").length);
					console.log("Comment:"+data[i].comment);
					console.log("commentor:"+data[i].commentorId);
					console.log("Blog id:"+data[i].blogId);
					console.log("Comment created time:"+data[i].postedDate);
					console.log("Comment created time:"+($.format.prettyDate(data[i].postedDate)));

				}	
				$("#loadMoreComments").data("loadedCommentCount",loadedCommentCount+data.length);
				configureCommentPagingOptions(jqXHR.getResponseHeader("LINK"));	
			},
			error : function( jqXHR,textStatus, errorThrown ) {
				console.log("loading more comments error callback :"+jqXHR+" textStatus:"+textStatus+" errorThrown :"+errorThrown);
				showErrorScreen("Unexpected error");
			},
			 complete : function( jqXHR, textStatus ) {
				console.log("loading more comments complete callback"); 
			}
			
		});
	
	});
	
});

