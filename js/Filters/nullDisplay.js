buckbrowser.filter('nullDisplay', function() {
	return function(input) {
		if (input == null || input == "")
		{
			return "None";
		}
		else
		{
			return input;
		}
	};
});