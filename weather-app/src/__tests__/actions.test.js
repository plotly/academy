import {
	changeLocation,
	setSelectedDate,
	setSelectedTemp,
	setData,
	setDates,
	setTemps
} from '../actions';

describe('actions', function() {
	describe('changeLocation', function() {
		it('should have a type of CHANGE_LOCATION', function() {
			expect(changeLocation().type).toEqual('CHANGE_LOCATION');
		});

		it('should pass on the location we pass in', function() {
			var location = 'Vienna, Austria';
			expect(changeLocation(location).location).toEqual(location);
		});
	});

	describe('setSelectedDate', function() {
		it('should have a type of SET_SELECTED_DATE', function() {
			expect(setSelectedDate().type).toEqual('SET_SELECTED_DATE');
		});

		it('should pass on the date we pass in', function() {
			var date = '2016-01-01';
			expect(setSelectedDate(date).date).toEqual(date);
		});
	});

	describe('setSelectedTemp', function() {
		it('should have a type of SET_SELECTED_TEMP', function() {
			expect(setSelectedTemp().type).toEqual('SET_SELECTED_TEMP');
		});

		it('should pass on the temp we pass in', function() {
			var temp = '31';
			expect(setSelectedTemp(temp).temp).toEqual(temp);
		});
	});

	describe('setData', function() {
		it('should have a type of SET_DATA', function() {
			expect(setData().type).toEqual('SET_DATA');
		});

		it('should pass on the data we pass in', function() {
			var data = { some: 'data' };
			expect(setData(data).data).toEqual(data);
		});
	});

	describe('setDates', function() {
		it('should have a type of SET_DATES', function() {
			expect(setDates().type).toEqual('SET_DATES');
		});

		it('should pass on the dates we pass in', function() {
			var dates = ['2016-01-01', '2016-01-02'];
			expect(setDates(dates).dates).toEqual(dates);
		});
	});

	describe('setTemps', function() {
		it('should have a type of SET_TEMPS', function() {
			expect(setTemps().type).toEqual('SET_TEMPS');
		});

		it('should pass on the temps we pass in', function() {
			var temps = ['31', '32'];
			expect(setTemps(temps).temps).toEqual(temps);
		});
	});
});
