'use strict';

angular.module('kkrdashboard')

	.filter('teamFilter', function() {
		return function(teamsFromBe) {
			if (!angular.isUndefined(teamsFromBe)) {
				var filtered = teamsFromBe.filter(function(team) {
					if (team.value.indexOf("ndustry Team -") != -1 ) {
			      		if (team.value.indexOf("Asia") == -1) {
			      			return true;
			      		} 
			      	} 
				});
				return filtered;
			} else {
				return teamsFromBe;
			}
      	}	
	})

	.filter('makeTeamDisplay', function() {
		return function(team) {
			if (team) {
				return team.replace(/Industry Team - /g, "");
			} else {
				return team;
			}
		}
	})

	.factory('latestDate', function($resource) {
		return $resource('/data/latestDate.json', {}, {
		    getDate: {
		      method: "GET"
		    }
	    });
	})

	.service('codeFather', function($http) {
		return {
			async: function(str) {
				var url = '';
				switch (str) {
					case 'teams':
						url = '/data/industries.json';
						break;
					case 'currencies':
						url = '/data/currencies.json';
						break;
					case 'regions':
						url = '/data/regions.json';
						break;
				};
				return $http.get(url, 
					{});
			}
		}
	})

	.factory('chartDetails', function($resource) {
		return $resource('/data/dataChartDetails.json', {}, {
		    getData: {
		      method: "GET"
		    }
	    });
	})

	.directive('tableDetails', function() {
		return {
			restrict: "A",
			scope: {
				deets: "=",
				grid: "="
			},
			controller: "tableDetailsCtrl",
			controllerAs: "ctrl",
			bindToController: true,
			templateUrl: "app/main/tableDetails.html"
		};
	})

	.controller('tableDetailsCtrl', function($http) {
		var self = this;
		$http({
		  url: "/data/tableDetails.xml",
		  method: 'GET',
		  transformResponse: [function (data) {
		      self.chartDetail=xml2json.parser(data).pmc_data_details.details;
		  }]
		});
	})

	.controller('ChartCtrl', function ($http, codeFather, latestDate, $filter, chartDetails) {
		var self = this;
		self.model = [];
		self.fsChart = new FusionCharts();

		self.detailLoaded = true;

		self.gridHeaders = [{
		    displayName: "Company",
		    field:"comp_name",
		    fieldType:"comp_name"
		  }, {
		    displayName: "Actual",
		    field: "actual_amt",
		    cellFilter: 'currency: "GPB"',
		    fieldType: 'actual_amt | currency'
		  }, {
		    displayName: "Industry",
		    field: "industry",
		    fieldType: "industry"
		  }, {
		    displayName: "Region",
		    field: "region",
		    fieldType: "region"
		  }, {
		    displayName: "% Ownership",
		    field: "ownership_perc",
		    fieldType: "ownership_perc"
		  }, {
		    displayName: "FYE",
		    field: "fye",
		    fieldType: "fye"
		  }, {
		    displayName: "Period",
		    field: "period",
		    fieldType: 'date'
		  }, {
		    displayName: "Period End",
		    field: "period_end_date",
		    fieldType: 'date'
		  }
	  	];

		self.team = {codeId: 0, value: 'All Industries'};
		self.currency = {codeId: 123, value: 'Dollars (US)'};
		self.geography = {codeId: 0, value: 'All Geographies'};
		self.fund = {fundId: 0, name: 'All Funds'};
		self.region = {codeId: 0, value: 'All Region'};
		self.fin = {codeId: 21, value: 'EBITDA'};

		self.timeIntervals = [
			{code_id: 24, 
				value: "24 months"},
			{code_id: 12, 
				value: "12 months"},
			{code_id: 6, 
				value: "6 months"}, 
			{code_id: 3, 
				value: "3 months"}
		];
		self.timeInterval = {codeId: self.timeIntervals[1].code_id, value: self.timeIntervals[1].value};

		self.selectTeam = function (codes) {
			self.team.value = codes.value;
			self.team.codeId = codes.code_id;
			self.updateDeetsUrl();
			
		}

		self.selectCurrency = function (codes) {
			self.currency.value = codes.value;
			self.currency.codeId = codes.code_id;
			self.updateDeetsUrl();
		}

		self.selectGeography = function (codes) {
			self.geography.value = codes.value;
			self.geography.codeId = codes.code_id;
		}

		

		self.selectRegion = function (region) {
			self.region.value = region.value;
			self.updateDeetsUrl();
			self.region.codeId = region.code_id;
		}

		self.selectFin = function (fin) {
			self.fin.value = fin.value;
			self.fin.codeId = fin.code_id;
		}

		

		self.selectTimeInterval = function (timeInterval) {
			self.timeInterval.value = timeInterval.value;
			self.timeInterval.codeId = timeInterval.code_id;
		}

		codeFather.async('teams').then(function(response) {
			self.teams = response.data.root.codes.teams.row;
		});

		codeFather.async('currencies').then(function(response) {
	      	self.currencies= response.data.row;
		});

		codeFather.async('regions').then(function(response) {
	      	self.regions = response.data.row;
		});

		latestDate.getDate().$promise.then(function(response) {
	      	self.date = response.data.root.pmc_data_details.row.date;
		});


		self.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			self.opened = true;
		};

		self.today = function() {
		    self.dt = new Date();
		  };
		  self.today();

		self.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		self.format = 'MM/dd/yyyy';

		self.chartResponse = [];
		self.attrs = {
			"caption": self.fin.value,
			'bgAlpha': '0',
			'legendBgAlpha': '0',
			'canvasbgAlpha': '0',
			'legendBorderAlpha': '0',
			'palettecolors': '#5bc0de,#1aaf5d,#f2c500',
			'useplotgradientcolor': '0',
			'showcanvasborder': '0',
			'showColumnShadow': '0',
			'showBorder':'0',
			'plotborderalpha': '10',
			'containerBackgroundOpacity': '0'
	  
		};

		self.divWidth = $("#chart-container").width();

		self.initFCArrays = function() {
			self.dataset = [
				{
			        "seriesname": self.fin.value,
			        "data": []
		    	}
	        ];
			self.categories = [
				{
					"category": []
				}
	        ];
	    };
		
		self.updateDeetsUrl = function() {
			self.initFCArrays();
			chartDetails.getData().$promise.then(function(response) {
		      	self.chartResponse = response.chart_data_details;

		      	for (var i = 0; i < self.chartResponse.length; i++) {
		      		self.dataset[0].data.push({ 'value': self.chartResponse[i].actual_amt});
		      		self.categories[0].category.push({ 'label': self.chartResponse[i].label});
		      	};
			});
		};
		self.updateDeetsUrl();
	});

 