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
   console.log(value); 
})

//handle post submission 
$("#submitPostButton").click((event) => {

   console.log("submission in process")
   var button = $(event.target); 
   var textbox = $("#postTextarea"); 

   var data = {
      content: textbox.val()
   } 

   $.post("/api/posts", data, (postData, status, xhr) => {
      console.log(postData); 

      var postHtml = createPostHtml(postData); 
      $(".postsContainer").prepend(postHtml); 
      textbox.val(""); 
      button.prop('disabled', true); 
   })
})

function createPostHtml(postData) {
   
   var postedBy = postData.postedBy; 
   var displayName = postedBy.firstName + " " + postedBy.lastName; 
   var timestamp = postData.createdAt; 

   return `<div class='post'> 
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
                         <div class="postButtonContainer">
                            <button> 
                            <i class="fa-solid fa-retweet"></i> 
                            </button>
                         </div>
                         <div class="postButtonContainer">
                            <button> 
                            <i class="fa-solid fa-heart"></i>
                            </button>
                         </div>
                      </div>
                   </div> 
                </div> 
          </div>`; 
}