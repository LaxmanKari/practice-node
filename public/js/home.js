//$(document).ready() function, which is used to execute code when the HTML document is fully loaded 
//and the DOM (Document Object Model) is ready to be manipulated.

//The jQuery() or $() function is used to select elements from the DOM. 
//It allows you to perform operations on those elements using jQuery methods and functions.

// Below example: 
// $() --> jQuery function 
// document --> selector 
// ready() --> function 

$(document).ready(() => {
   //ajax request
   $.get("/api/posts", results => {
      outputPosts(results, $(".postsContainer"));
   }) 
}) 

function outputPosts(results, container){
   container.html(""); 

   results.forEach(result => {
      var html = createPostHtml(result)
      container.append(html);
   }) 

   if(results.length == 0) {
      container.append("<span class='noResults'> Nothing to show. </span> ")
   }
}