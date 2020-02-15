$(function () {
	// Initial state of page
	var addressBook = [];
	$('.entries').hide();
	$('.searchMessage').hide();
	$('#modify').hide();
	
	
	// Validation step
	var textFields = [$("#firstname"), $("#surname"), $("#firstline"), $("#city")];
	
		
	textFields.forEach(function(field){
		field.keypress(function(e) {	
			
			// Backspace, tab, space, apostrophe, hyphen, delete - no special characters accounted for. Ctrl + V paste method not covered - which is why there is a next step to account for this. 
			var validNonAlphaNumKeys = [8, 9, 32, 39, 45, 46];
			
			var key = e.which || e.keyCode;
			
			var validKey = validNonAlphaNumKeys.join(",").match(new RegExp(key));

			if (validKey) {
				return;
			}
			
			if (90 < key && key < 97) {
				e.preventDefault();
				return;
			}			
			else if (64 > key || key > 123){
				e.preventDefault();
				return;
			}
			
		});
	
	});
		
	// Disables paste (both right-click and Ctrl+V methods) - quite inelegant but less complicated than instituting a regex check upon leaving focus
	textFields.forEach(function(field){
		field.on("paste",function(e) { 
			{
				alert('No pasting allowed!');
				e.preventDefault();
				return;
			}
		});
	});
	
	// House fields
	var $inputs = $("input[type=houseid]");
	
	$inputs.on('input', function () {
		// Set required property of other field to false if this input is not empty
		$inputs.not(this).prop('required', !$(this).val().length);
	});
	
	// Email validation
	
		
	// Upon submitting an entry
	$( "form" ).submit(function(event) {	
		
					
		// Formatting form data and storing it
		var arr = $('form').serializeArray();
		
		var filteredArr = arr.filter(function(field) {
			return field.value !== ""; 
		});
		
		if (filteredArr[filteredArr.length - 1].value === "You may include a brief description of your home here if you wish.")
		{
			filteredArr[filteredArr.length - 1].value = "No information entered.";
		} 			
		addressBook.push(filteredArr);		
		
		// Resets form after pushing entry
		$('form').trigger('reset'); 
		

		
		//Display table	by adding entries one at a time
		var appendTable = function(index){
		$('#entryRows').append('<tr><td>' + `${addressBook[index][0].value}` + '</td><td>' + `${addressBook[index][1].value}` + '</td><td>' 
		+ `${addressBook[index][2].value}` + '</td><td>' + `${addressBook[index][3].value}` + '</td><td>' + `${addressBook[index][4].value}` + '</td><td>'
		+ `${addressBook[index][5].value}` + '</td><td>' + `${addressBook[index][6].value}` + '</td><td>' + `${addressBook[index][7].value}` + '</td><td><button id="deletebutton">Delete entry?</button></td></tr>'
		);};
		
		appendTable(addressBook.length - 1);

		
		// Prevent form from submitting (default function)
		event.preventDefault();
	});
	
	
	// Delete button
	$('#entryRows').on('click','#deletebutton',function(){
		if (confirm('Delete this entry?'))
		{
			$(this).closest('tr').hide().remove(); 			
		}
		$('.initMessage').toggle($('#entryRows tr').length === 0);
	});
	

	// Search function - dynamic
	$('form').on("submit", function () {
		$('.initMessage').hide();
		$("#searchValue").on("keyup", function() {
			var value = $(this).val().toLowerCase();
			$("#entryRows tr").filter(function() {
				var match = $(this).text().toLowerCase().indexOf(value);
				$(this).toggle(match > -1);
			});
			// Modify button still not working - todo
			$("#modify").toggle($("#entryRows tr").text().toLowerCase().indexOf(value) === 1);
			$(".searchMessage").toggle($("#entryRows tr:visible").length === 0);
		});
	});


	// Coding the "View Address Book" button
	$('#viewbook').click(function(){
		$('.overlay').toggle("hide");
		$('.entries').toggle("show");
		$(this).text($(this).text() === 'Hide Address Book' ? 'View Address Book' : 'Hide Address Book');		
	});
});
