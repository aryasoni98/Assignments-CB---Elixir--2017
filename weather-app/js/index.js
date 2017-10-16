'use strict';

var app = new Vue({
	el: '#app',
	data: {
		currentTime: moment().format('HH:mm:ss'),
		time_interval: null,
		currentDate: moment().format('dddd, MMMM Do YYYY'),
		currentCity: 'India',
		temp: 0,
		temp_C: 0,
		temp_F: 0,
		cityName: null,
		weatherName: null,
		weatherInfo: null,
		unit: 'C',
		apiError: null
	},
	watch: {
		currentCity: function currentCity() {
			this.getWeatherData();
		}
	},
	methods: {
		updateTime: function updateTime() {
			this.currentTime = moment().format('HH:mm:ss');
			this.currentDate = moment().format('dddd, MMMM Do YYYY');
		},
		getLocationData: function getLocationData() {
			this.getWeatherData();
		},

		getWeatherData: debounce(function () {
			var _this = this;

			var weathersApi = 'https://api.apixu.com/v1/current.json?key=b609c60f3aae44df88620941171308&q=' + this.currentCity;

			this.$http.get(weathersApi).then(function (res) {
				var rbody = res.body;
				//	console.log(rbody)
				_this.cityName = rbody.location.name;
				_this.temp = Math.round(rbody.current.temp_c);
				_this.temp_C = _this.temp;
				_this.temp_F = Math.round(_this.temp * 1.8 + 32);
				_this.weatherName = rbody.current.condition.text.toLowerCase();
				_this.weatherInfo = rbody.current.condition.text;
			}, function (res) {
				_this.apiError = res.statusText;
				console.log(_this.apiError);
			});
		}),
		switchTempUnit: function switchTempUnit() {
			if (this.unit === 'C') {
				this.unit = 'F';
				this.temp = this.temp_F;
			} else {
				this.unit = 'C';
				this.temp = this.temp_C;
			}
		},
		refreshWeather: function refreshWeather() {
			this.getLocationData();
		}
	},
	beforeMount: function beforeMount() {
		this.time_interval = setInterval(this.updateTime, 1000);
		this.getLocationData();
	}
});

// delay for input
function debounce(func) {
	var wait = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
	var immediate = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	var timeout;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}