// Javascript used to detect event pagination modules (any uls with a "pagination-events" class) on a page and enable pagination functionality
// Note: Requires jquery

$(document).ready(function() {
	// Search document for pagination modules
	$('ul.pagination-events').each(function(index) {
		// Find all of the pagination options and convert them to jquery data on event category row instead of hidden form fields
		$(this).find('input.hidden_pagination_options').each(function(index) {
			var fieldName = $(this).attr("name");
			var pagination_options = new Array();
			// Determine the option name
			var myregexp = /events_pagination_([a-zA-Z0-9_\-]+)/;
			var match = myregexp.exec(fieldName);
			if (match != null) {
				optionName = match[1];
			} else {
				optionName = false;
			}
			// Assign the pagination option to jquery data key:value pairs on event category row
			if(optionName){
				$('#events_pagination').data('pagination_options_'+optionName, $(this).val());
			}
		});
		// The following pagination option variables should now be located in the pagination data object:
		/*
			pagination_options_current_event_id
			pagination_options_event_per_page
			pagination_options_url_target
			pagination_options_page
			pagination_options_current_page
			pagination_options_page_count
		*/
		// Handle all of the pagination functions and states for the current event thumbnail row
		var PaginationDivID = $(this).parent().attr("id");
		var PaginationRow = $('#'+PaginationDivID);
		HandleEventPaginationButtons(PaginationDivID);
		// Set up the link for the last page
		var LastPageLink = PaginationRow.find('ul.pagination-events > li > a.pagination_link_last');
		LastPageLink.click(function(){
			var PaginationDivID = $(this).parent().parent().parent().attr("id");
			LastEventPaginationPage(PaginationDivID);
		});
		// Set up event handler for page input number field
		var PageNumberInputField = PaginationRow.find('ul.pagination-events > li > input.pagination_input_page_number');
		PageNumberInputField.keypress(function(event){
			// Listen for "enter" key and other key codes
			// enter: 13
			// up: 38
			// right: 39
			// down: 40
			// left: 37
			if (event.keyCode == '13' || event.keyCode == '38' || event.keyCode == '39' || event.keyCode == '40' || event.keyCode == '37') {
				event.preventDefault();
				var PaginationDivID = $(this).parent().parent().parent().attr("id");
				var PaginationRow = $('#'+PaginationDivID);
				var current_page = parseInt(PaginationRow.data('pagination_options_current_page'));
				var page_count = parseInt(PaginationRow.data('pagination_options_page_count'));
				var new_page_num = parseInt(PageNumberInputField.val());
				if(event.keyCode == '38' || event.keyCode == '39'){
					// Up or Right pressed. Increment by one
					var new_page_num = parseInt(PageNumberInputField.val())+1;
				}
				if(event.keyCode == '40' || event.keyCode == '37'){
					// Up or Right pressed. Reduce by one
					var new_page_num = parseInt(PageNumberInputField.val())-1;
				}
				// Enter key (and error-checking for other):
				if(new_page_num<0){
					// Lower than zero. Go to page 1.
					GoToEventPaginationPage(PaginationDivID, 1);
				}else if(new_page_num<=page_count && page_count>0){
					// Go to specified page
					GoToEventPaginationPage(PaginationDivID, new_page_num);
				}else if(new_page_num>page_count){
					// Go to last page
					GoToEventPaginationPage(PaginationDivID, page_count);
				}else{
					// Invalid entry. Reset to current page.
					PageNumberInputField.val(current_page);
				}
			}
		});
		// Preload the next pagination page
		var current_page = parseInt(PaginationRow.data('pagination_options_current_page'));
		GoToEventPaginationPage(PaginationDivID, current_page, true);
	});
});

function HandleEventPaginationButtons(PaginationDivID){
	var PaginationRow = $('#'+PaginationDivID);
	var current_page = parseInt(PaginationRow.data('pagination_options_current_page'));
	var page_count = parseInt(PaginationRow.data('pagination_options_page_count'));
	
	// Buttons and links
	var FirstLink = PaginationRow.find('ul.pagination-events > li > a.pagination_link_first');
	var FirstButton = PaginationRow.find('ul.pagination-events > li > a.pagination_link_first > img.pagination_button_first');
	var PreviousLink = PaginationRow.find('ul.pagination-events > li > a.pagination_link_previous');
	var PreviousButton = PaginationRow.find('ul.pagination-events > li > a.pagination_link_previous > img.pagination_button_previous');
	var NextLink = PaginationRow.find('ul.pagination-events > li > a.pagination_link_next');
	var NextButton = PaginationRow.find('ul.pagination-events > li > a.pagination_link_next > img.pagination_button_next');
	
	/* --------------------------------------------- */
	// Enable/disable buttons based on current page
	/* --------------------------------------------- */	
	if(current_page == 1){
		// Disable the the "first" button
		FirstLink.removeClass('enabled');
		FirstButton.removeClass('enabled');
		FirstLink.addClass('disabled');
		FirstButton.addClass('disabled');
		// Disable the "previous" button
		PreviousLink.removeClass('enabled');
		PreviousButton.removeClass('enabled');
		PreviousLink.addClass('disabled');
		PreviousButton.addClass('disabled');
	}else if(current_page>1){
		// Enable the "first" button
		FirstLink.removeClass('disabled');
		FirstButton.removeClass('disabled');
		FirstLink.addClass('enabled');
		FirstButton.addClass('enabled');
		// Enable the "previous" button
		PreviousLink.removeClass('disabled');
		PreviousButton.removeClass('disabled');
		PreviousLink.addClass('enabled');
		PreviousButton.addClass('enabled');
	}
	if(current_page==page_count){
		// Disable the "next" button
		NextLink.removeClass('enabled');
		NextButton.removeClass('enabled');
		NextLink.addClass('disabled');
		NextButton.addClass('disabled');
	}else if(current_page<page_count){
		// Enable the "next" button
		NextLink.removeClass('disabled');
		NextButton.removeClass('disabled');
		NextLink.addClass('enabled');
		NextButton.addClass('enabled');
	}
	
	// Remove the href hardlinks
	FirstLink.attr('href', 'javascript:void(0);');
	PreviousLink.attr('href', 'javascript:void(0);');
	NextLink.attr('href', 'javascript:void(0);');

	/* --------------------------------------------- */
	// Handle the "first" button
	/* --------------------------------------------- */
	if(FirstLink.hasClass('enabled')){
		/* --------------------------------------------- */
		// First button is enabled:
		/* --------------------------------------------- */
		FirstButton.attr("src", "/images/pagination/arrow-first-enabled.gif");
		// Set up rollover effect for first button
		FirstButton.unbind('mouseover');
		FirstButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-first-over.gif");
		});
		// Set up rollout effect for first button
		FirstButton.unbind('mouseout');
		FirstButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-first-enabled.gif");
		});
		// Set up the click handler for the first button
		FirstLink.unbind('click');
		FirstLink.click(function(){
			var PaginationDivID = $(this).parent().parent().parent().attr("id");
			FirstEventPaginationPage(PaginationDivID);
		});
	}else{
		/* --------------------------------------------- */
		// First button is disabled (end of the line):
		/* --------------------------------------------- */
        FirstButton.attr("src", "/images/pagination/arrow-first-disabled.gif");
		// Set up rollover effect for first button
		FirstButton.unbind('mouseover');
		FirstButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-first-disabled.gif");
		});
		// Set up rollout effect for first button
		FirstButton.unbind('mouseout');
		FirstButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-first-disabled.gif");
		});
		// Set up the click handler for the first button
		FirstLink.unbind('click');
		FirstLink.click(function(){
			return false;
		});
	}
	
	/* --------------------------------------------- */
	// Handle the "previous" button
	/* --------------------------------------------- */
	if(PreviousLink.hasClass('enabled')){
		/* --------------------------------------------- */
		// Previous button is enabled:
		/* --------------------------------------------- */
		PreviousButton.attr("src", "/images/pagination/arrow-prev-enabled.gif");
		// Set up rollover effect for previous button
		PreviousButton.unbind('mouseover');
		PreviousButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-prev-over.gif");
		});
		// Set up rollout effect for previous button
		PreviousButton.unbind('mouseout');
		PreviousButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-prev-enabled.gif");
		});
		// Set up the click handler for the previous button
		PreviousLink.unbind('click');
		PreviousLink.click(function(){
			var PaginationDivID = $(this).parent().parent().parent().attr("id");
			PreviousEventPaginationPage(PaginationDivID);
		});
	}else{
		/* --------------------------------------------- */
		// Previous button is disabled (end of the line):
		/* --------------------------------------------- */
		PreviousButton.attr("src", "/images/pagination/arrow-prev-disabled.gif");
		// Set up rollover effect for previous button
		PreviousButton.unbind('mouseover');
		PreviousButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-prev-disabled.gif");
		});
		// Set up rollout effect for previous button
		PreviousButton.unbind('mouseout');
		PreviousButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-prev-disabled.gif");
		});
		// Set up the click handler for the previous button
		PreviousLink.unbind('click');
		PreviousLink.click(function(){
			return false;
		});
	}
	
	/* --------------------------------------------- */
	// Handle the "next" button
	/* --------------------------------------------- */
	if(NextLink.hasClass('enabled')){
		/* --------------------------------------------- */
		// Next button is enabled:
		/* --------------------------------------------- */
		NextButton.attr("src", "/images/pagination/arrow-next-enabled.gif");
		// Set up rollover effect for next button
		NextButton.unbind('mouseover');
		NextButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-next-over.gif");
		});
		// Set up rollout effect for next button
		NextButton.unbind('mouseout');
		NextButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-next-enabled.gif");
		});
		// Set up the click handler for the next button
		NextLink.unbind('click');
		NextLink.click(function(){
			var PaginationDivID = $(this).parent().parent().parent().attr("id");
			NextEventPaginationPage(PaginationDivID);
		});
	}else{
		/* --------------------------------------------- */
		// Next button is disabled (end of the line):
		/* --------------------------------------------- */
		NextButton.attr("src", "/images/pagination/arrow-next-disabled.gif");
		// Set up rollover effect for next button
		NextButton.unbind('mouseover');
		NextButton.mouseover(function(){
            $(this).attr("src", "/images/pagination/arrow-next-disabled.gif");
		});
		// Set up rollout effect for next button
		NextButton.unbind('mouseout');
		NextButton.mouseout(function(){
            $(this).attr("src", "/images/pagination/arrow-next-disabled.gif");
		});
		// Set up the click handler for the next button
		NextLink.unbind('click');
		NextLink.click(function(){
			return false;
		});
	}

}

function FirstEventPaginationPage(PaginationDivID){
	// Load first page
	GoToEventPaginationPage(PaginationDivID, 1);
}

function PreviousEventPaginationPage(PaginationDivID){
	var PaginationRow = $('#'+PaginationDivID);
	var current_page = PaginationRow.data('pagination_options_current_page');
	var page_count = PaginationRow.data('pagination_options_page_count');
	// Reduce page number by one
	var prev_page = parseInt(current_page)-1;
	// Don't allow user to go below 0
	if(prev_page<1){
		prev_page = 1;
	}
	// Load previous page
	GoToEventPaginationPage(PaginationDivID, prev_page);
}

function NextEventPaginationPage(PaginationDivID){
	var PaginationRow = $('#'+PaginationDivID);
	var current_page = PaginationRow.data('pagination_options_current_page');
	var page_count = PaginationRow.data('pagination_options_page_count');
	// Increment page number by one
	var next_page = parseInt(current_page)+1;
	// Don't allow user to go beyond page limit
	if(next_page>page_count){
		next_page = page_count;
	}
	// Load next page
	GoToEventPaginationPage(PaginationDivID, next_page);
}

function LastEventPaginationPage(PaginationDivID){
	var PaginationRow = $('#'+PaginationDivID);
	var page_count = PaginationRow.data('pagination_options_page_count');
	// Load last page
	GoToEventPaginationPage(PaginationDivID, page_count);
}

function GoToEventPaginationPage(PaginationDivID, PageNumber, OnlyPreloadNextPage){
	var PaginationRow = $('#'+PaginationDivID);
	var PaginationThumbnailRow = $('#'+PaginationDivID+' > div.event_thumbnail_rows:first');
	var PaginationInputPageNumber = $('#'+PaginationDivID+' > ul.pagination-events > li > input.pagination_input_page_number:first');

	var events_url_target = PaginationRow.data('pagination_options_url_target');
	var current_event_id = PaginationRow.data('pagination_options_current_event_id');
	var events_per_page = PaginationRow.data('pagination_options_events_per_page');
	var current_page = PaginationRow.data('pagination_options_current_page');
	var page_count = PaginationRow.data('pagination_options_page_count');
	if(!PageNumber){
		PageNumber=1;
	}
	// Determine user's paging directional "momentum" so we can preload the next page in the sequence
	var PreloadPageNumber = PageNumber;
	if(PreloadPageNumber>current_page){
		PreloadPageNumber++;
	}else if(PageNumber<current_page){
		PreloadPageNumber = PreloadPageNumber-1;
	}
	if(OnlyPreloadNextPage){
		var PreloadPageNumber = parseInt(current_page)+1;
	}
	// Make sure that we don't preload beyond the paging limits
	if(PreloadPageNumber>page_count || PreloadPageNumber<1){
		PreloadPageNumber = PageNumber;
	}
	// Formulate the preloader url
	if(PreloadPageNumber != PageNumber){
		var preload_pagination_url = "/event_thumbnail_rows_ajax.php?&events_page="+PreloadPageNumber+"&events_per_page="+events_per_page+"&events_url_target="+events_url_target;
		// Create a hidden pagination preloader div (if it doesn't already exist), and load the content into it
		var pagination_preloader_div = $('#pagination-preloader-div');
		if(pagination_preloader_div.length==0){
			$('body').append('<div id="pagination-preloader-div" style="width:1px; height:1px; padding:1px; overflow:hidden; background-color:#FFFFFF;"></div>');
			pagination_preloader_div = $('#pagination-preloader-div');
		}
		// Preload the next page into the hidden div
		pagination_preloader_div.load(preload_pagination_url, function() {
			$('#pagination-preloader-div').hide();
		});
	}
	if(PageNumber!=current_page &&!OnlyPreloadNextPage ){
		// Style the event category row so that it can animate
		PaginationRow.css('width', PaginationRow.innerWidth());
		PaginationThumbnailRow.css('width', PaginationThumbnailRow.innerWidth());
		PaginationThumbnailRow.stop();
		PaginationThumbnailRow.animate({
				opacity: '0'
			}, 0, function() {
			// Animation complete.
			// Formulate the url
			var pagination_url = "/event_thumbnail_rows_ajax.php?&events_page="+PageNumber+"&events_per_page="+events_per_page+"&events_url_target="+events_url_target;
			// Load the new thumbnails
			PaginationThumbnailRow.load(pagination_url, function() {
				// New page loaded successfully, so we increment the page number
				PaginationInputPageNumber.val(PageNumber);
				PaginationRow.data('pagination_options_current_page', PageNumber);
				// Handle all of the buttons again
				HandleEventPaginationButtons(PaginationDivID);
				// Animate the page in
				if(PageNumber<current_page){
					PaginationThumbnailRow.css('margin-left', '-10px');
				}else{
					PaginationThumbnailRow.css('margin-left', '10px');
				}
				PaginationThumbnailRow.animate({
						marginLeft: '0px',
						opacity: '1'
					},{"duration": 750, "easing": "easeOutQuad"}, function() {
				});
			});
		});
	}

}
