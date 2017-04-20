(function (){
	'use strict'

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService', MenuSearchService)
	.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var narrow = this;

		narrow.search = "";
		narrow.foundItems = "";
		narrow.dataRetrive = false;

		var promise = MenuSearchService.getData();

		promise.then(function(response){
			narrow.items = response.data;
			console.log(narrow.items.menu_items[0]);
			narrow.dataRetrive = true;
		})
		.catch(function(error){
			console.log("error retrive data");
		});

		narrow.getMatchedMenuItems = function(serchTerm){
			if(!narrow.dataRetrive){
				console.log("notretriveyet")
				return;
			}

			var foundItems = [];

			for (var i = 0; i < narrow.items.menu_items.length; i++){
				if (narrow.items.menu_items[i].name.toLowerCase().indexOf(serchTerm) !== -1){
					foundItems.push(narrow.items.menu_items[i]);
				}
			}

			console.log(foundItems);
			return foundItems;
		}

	}

	MenuSearchService.$inject = ['ApiBasePath', '$http'];
	function MenuSearchService(ApiBasePath, $http){
		var service = this;

		service.getData = function(){
			var response = $http({
				method: "GET",
    			url: (ApiBasePath + "/menu_items.json")
			});

		return	response;
		}
	}

})();