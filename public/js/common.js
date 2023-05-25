$("#postTextarea").keyup(event => {
   var textbox = $(event.target); 
   var value = textbox.val().trim(); 

   var submitButton = $("#submitPostButton"); 
   
   //if there is a button in a page, length would be more than 0 
   if(submitButton.length == 0){
      return alert("No submit button is found in Post Area");
   }

   if(value == ""){
      submitButton.prop("disabled", true); 
      return;
   } 

   submitButton.prop("disabled", false); 
   console.log(value);
})