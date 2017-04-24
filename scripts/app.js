(function (){
	'use strict'

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
	.directive('foundItems', foundItems);

	NarrowItDownController.$inject = ['MenuSearchService', '$timeout'];
	function NarrowItDownController(MenuSearchService, $timeout){
		var narrow = this;
		narrow.search = "";
		narrow.found = true;

		narrow.dataFilter = function(searchTerm){
			narrow.found = MenuSearchService.getDataFound(searchTerm);
		}

		narrow.remove = function(index){
			MenuSearchService.removeItem(index);
		}

		$timeout(function() {
			narrow.dataRetrieve = MenuSearchService.getRetrieve();
		}, 1500);
		
	}

	function foundItems(){
		var ddo = {
			templateUrl: 'directives/foundItems.html',
			restrict: 'E',
			scope: {
				found: '<',
				onRemove: '&'
			}
		};

		return ddo;
	}

	MenuSearchService.$inject = ['ApiBasePath', '$http'];
	function MenuSearchService(ApiBasePath, $http){
		var service = this;
		service.search = "";
		service.dataRetrieve = false;
		service.foundItems = [];

		service.getData = function(){
			var response = $http({
				method: "GET",
    			url: (ApiBasePath + "/menu_items.json")
			});

		return	response;
		}

		var promise = service.getData();

		promise.then(function(response){
			service.items = response.data;
			service.dataRetrieve = true;
		})
		.catch(function(error){
			console.log("Error retrieve data");
		});

		service.getMatchedMenuItems = function(searchTerm){
			if(!service.dataRetrieve){
				console.log("Data not Retrieve yet");
				return;
			}

			if (searchTerm.length === 0){
				return false;
			}

			searchTerm = searchTerm.toLowerCase();

			var found = [];

			for (var i = 0; i < service.items.menu_items.length; i++){
				if (service.items.menu_items[i].name.toLowerCase().indexOf(searchTerm) !== -1){
					found.push(service.items.menu_items[i]);
				}
			}

			if (found.length === 0){
				return false;
			}

			return found;
		}

		service.getDataFound = function(searchTerm){
			service.foundItems = service.getMatchedMenuItems(searchTerm);
			return service.foundItems;
		}

		service.removeItem = function(index){
			service.foundItems.splice(index, 1)
		}

		service.getRetrieve = function(){
			return service.dataRetrieve;
		}
	}

})();