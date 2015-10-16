buckbrowser.service('ErrorService', function() {
	return {
		'handle': function(result) {
			var errors = [];
			if (result.error)
			{
				switch(result.error) {
					case 35964:
						errors.push({type: 'warning', msg: 'Method invocation faulted'});
						break;
					case 36000:
						errors.push({type: 'warning', msg: 'You are not logged in'});
						break;
					case 36001:
						errors.push({type: 'warning', msg: 'You do not have the needed permissions'});
						break;
					case 36002:
						errors.push({type: 'warning', msg: 'Something unexplainable went wrong'});
						break;
					case 36003:
						errors.push({type: 'warning', msg: 'Wrong login credentials'});
						break;
					case 36004:
						errors.push({type: 'warning', msg: 'Identifier unknown'});
						break;
					case 36005:
						errors.push({type: 'warning', msg: 'Wrong parameters'});
						break;
					default:
						errors.push({type: 'warning', msg: 'Something unexplainable went wrong: '+result.error});
						break;
				}
			}
			if (result.create_error) {
				if (result.create_error.already_exists)
				{
					var exists = result.create_error.already_exists;
					var msg = "";
					for(i=0;i<exists.length;i++)
					{
						msg += exists[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields already exist and have to be unique: '+msg.substr(0,msg.length-2)});
				}
				if (result.create_error.empty_fields)
				{
					var empty = result.create_error.empty_fields;
					var msg = "";
					for(i=0;i<empty.length;i++)
					{
						msg += empty[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields are required: '+msg.substr(0,msg.length-1)});
				}
				if (result.create_error.incorrect_fields)
				{
					var incorrect = result.create_error.incorrect_fields;
					var msg = "";
					for(i=0;i<incorrect.length;i++)
					{
						msg += incorrect[i]+", ";
					}
					errors.push({type: 'warning', msg: 'The following fields are incorrect: '+msg.substr(0,msg.length-1)});
				}
			}
			if (result.update_error) {
				var incorrect = result.update_error.incorrect_fields;
				var msg = "";
				for(i=0;i<incorrect.length;i++)
				{
					msg += incorrect[i]+", ";
				}
				errors.push({type: 'warning', msg: 'The following fields are incorrect: '+msg.substr(0,msg.length-1)});
			}
			return errors;
		}
	}
});