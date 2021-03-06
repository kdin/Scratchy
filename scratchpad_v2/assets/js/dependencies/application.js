/**
* Defines module-scratchpadModule for the application
*@dependencies: ui-router , Angular - resource 
*@states: 2 Parent states and 1 Child state
*@Controllers: Controllers for listing, viewing and adding a scratch
*@Factory Service: Notes for the angular resource
*
*
*
*
*/
var scratchpadModule = angular.module('scratchpad',['ui.router','ngResource']);

/*----------Scratchpad Configuration States---------------*/
scratchpadModule.config(function($stateProvider,$httpProvider) {
	
	$stateProvider.state('scratchpad',{
		url:'/scratchpad',
		templateUrl:'templates/scratchpad.html',
		controller:'scratchListController'
	})
	.state('addNewScratch',{
		url:'/addNewScratch',
		templateUrl:'templates/addNewScratch.html',
		controller:'addScratchController'
	})
	.state('scratchpad.viewScratch',{
		url:'/scratchpad/:id/view',
		templateUrl:'templates/viewScratch.html',
		controller:'viewScratchController'
	})
}).run(function($state){
	$state.go('scratchpad');
});

/*----------Scratchpad Configuration States---------------*/

/*----------Scratchpad Controllers---------------*/

scratchpadModule.controller('scratchListController', function($scope,$state,Notes){
	
	$scope.scratchpad = Notes.query();

	$scope.deleteScratch = function (scratch,flag) {
		if(flag === 0) {											//Checks if Bulk delete or single delete
			if(confirm("You Clicked DELETE !! Are you sure ?")) {
			scratch.$delete(function() {							//Single delete
				window.location.href = 'http://localhost:1337';
			});
			}	
		}
		else {														//Bulk delete
			scratch.$delete(function() {
				window.location.href = 'http://localhost:1337';
			});		
		}
		
	}

	$scope.emptyScratchpad = function () {
		var ask = false;
		if (confirm ("You are about Empty Scratchpad. Sure ????")) {
			ask = true;	
		}
		if(ask === true) {
			for (var i = 0; i < $scope.scratchpad.length; i++) {
				$scope.deleteScratch($scope.scratchpad[i],1);
			}
		}
		
	}	
})

.controller('viewScratchController', function($scope,$stateParams,Notes){
	
	$scope.scratch = Notes.get({id:$stateParams.id});			//get scratch with id in state paremeters
})


.controller('addScratchController', function($scope,$state,Notes){
	
	$scope.scratch = new Notes();

	$scope.addScratch = function() {
        $scope.scratch.time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
		$scope.scratch.$save(function () {
			$state.go('scratchpad');
		});

	}
	$scope.emailScratch = function() {
			console.log($scope.scratch.mailid);
			console.log($scope.scratch.title);
			console.log($scope.scratch.content);
		/*--------------------------------Email using mandrill----------------------*/

		//#####################   API Call to Mandrill API   ###################
			$.ajax({
      		type: 'POST',
		      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
		      data: {
		        'key': 'u1IAL_R9ZDaboyElRz9TMQ',	//API key -> should come from process file
		        'message': {
		          'from_email': 'YOURSCRATCH@scratchpad.com',
		          'to': [
		              {
		                'email': $scope.scratch.mailid,	// Receiver's email id
		                'name': 'Dinesh Kannan',
		                'type': 'to'
		              }
		            ],
		          'autotext': 'false',
		          'subject': $scope.scratch.title,		//Scratch Title as the subject of the email
		          'html': $scope.scratch.content		//Scratch Content as the body of the email       
		           }
		      }
		     }).done(function(response) {				//Response of the email logged
		       console.log(response); 					
		     });
	/*----------------------------Email using mandrill----------------------*/
				$scope.addScratch();
		
	

	}
})
;

/*----------Scratchpad Controllers---------------*/

/*----------Notes factory for the resource---------------*/
scratchpadModule.factory('Notes', function($resource){
	return $resource('http://localhost:1337/scratchpadAPI/:id', {id:'@id'}, {
		update: {
			method:'PUT'
		}
	});
});
/*----------Notes factory for the resource---------------*/