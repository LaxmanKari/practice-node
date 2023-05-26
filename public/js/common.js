//we want to setup an event for this element with id = postTextarea, event is triggered when keyup occur's 
//i.e. when we start typing something 
$("#postTextarea").keyup(event => {
   var textbox = $(event.target); 
   var value = textbox.val().trim(); 

   var submitButton = $("#submitPostButton"); 

   if(submitButton.length == 0){
      return alert("Submit button not found");
   } 

   if(value == ""){
      submitButton.prop("disabled", true);
      return; 
   } 

   submitButton.prop("disabled", false);  
})

//handle post submission 
$("#submitPostButton").click((event) => {

   var button = $(event.target); 
   var textbox = $("#postTextarea"); 

   var data = {
      content: textbox.val()
   } 

   $.post("/api/posts", data, (postData, status, xhr) => {
      var postHtml = createPostHtml(postData); 
      $(".postsContainer").prepend(postHtml); 

      textbox.val(""); 
      button.prop("disabled", true); 
   })
})

//like-button functionality
$(document).on("click", ".likeButton", (event)=> {
   var button = $(event.target); 
   var postId = getPostIdfromElement(button);

   $.ajax({
      url: `/api/posts/${postId}/like`, 
      type: "PUT", 
      success : (postData) => {
         button.find("span").text(postData.likes.length || ""); 

         if(postData.likes.includes(userLoggedIn._id)){
            button.addClass("active");
         } 
         else {
            button.removeClass("active");
         }
      }
   })
}) 

function getPostIdfromElement(element){
   var isRoot = element.hasClass("post"); 
   var rootElement = isRoot ? element : element.closest(".post"); 
   var postId = rootElement.data().id; 

   if(postId === undefined){
      return alert("post id is undefined"); 
   } 

   return postId; 
}

function createPostHtml(postData) {
   
   var postedBy = postData.postedBy; 

   //check if postedBy is populated 
   if(postedBy._id === undefined){
      return console.log("User object not populated"); 
   }

   var displayName = postedBy.firstName + " " + postedBy.lastName; 

   //let's modify timestamp, calling new Date() will create a new instance of Date object, 
   //representing the current data and time according to the system's clock on the user's device.  
   var timestamp = timeDifference(new Date(), new Date(postData.createdAt)); 

   var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : ""; 

   return `<div class='post' data-id="${postData._id}"> 
                <div class='mainContentContainer'> 
                   <div class='userImageContainer'> 
                       <img src='${postedBy.profilePic}'> 
                   </div> 
                   <div class="postContentContainer"> 
                      <div class="header"> 
                        <a href='/profile/${postedBy.userName}' class="displayName"> ${displayName} </a> 
                        <span class='username'> @${postedBy.userName} </span> 
                        <span class='date'> ${timestamp} </span>
                      </div> 
                      <div class="postBody"> 
                         <span>${postData.content} </span>
                      </div>
                      <div class="postFooter"> 
                         <div class="postButtonContainer">
                            <button> 
                            <i class="fa-solid fa-comment"></i> 
                            </button>
                         </div>
                         <div class="postButtonContainer green">
                            <button class="retweet"> 
                            <i class="fa-solid fa-retweet"></i> 
                            </button>
                         </div>
                         <div class="postButtonContainer red">
                            <button class="likeButton ${likeButtonActiveClass}"> 
                            <span> ${postData.likes.length || ""} </span>
                            <i class="fa-solid fa-heart"></i>
                            </button>
                         </div>
                      </div>
                   </div> 
                </div> 
          </div>`; 
}

function timeDifference(current, previous){

   var msPerMinute = 60*1000; 
   var msPerHour = msPerMinute * 60; 
   var msPerDay = msPerHour * 24; 
   var msPerMonth = msPerDay * 30; 
   var msPerYear = msPerMonth * 365; 

   var elapsed = current - previous; 

   if(elapsed < msPerMinute){
      if(elapsed/1000 < 30) return "Just now"; 

      return Math.round(elapsed/1000) + ' seconds ago'; 
   }

   else if(elapsed <msPerHour){
      return Math.round(elapsed/msPerMinute) + 'minutes ago';
   }
   
   else if(elapsed <msPerDay){
      return Math.round(elapsed/msPerHour) + 'hours ago';
   }

   else if(elapsed <msPerMonth){
      return Math.round(elapsed/msPerDay) + 'days ago';
   }

   else if(elapsed <msPerYear){
      return Math.round(elapsed/msPerMonth) + 'months ago';
   }

   else {
      return Math.round(elapsed/msPerYear) + 'years ago';
   }
}