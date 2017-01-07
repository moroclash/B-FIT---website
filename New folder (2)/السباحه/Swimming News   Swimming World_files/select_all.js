// Utility function used to select all text in a form field
function select_all(obj){
	var text_val=eval(obj);
	text_val.focus();
	text_val.select();
}