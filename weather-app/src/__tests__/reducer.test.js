import mainReducer from '../reducer';
import expect from 'expect';
import { fromJS } from 'immutable';

describe('mainReducer', () => {
	it('should return the initial state', function() {
		expect(mainReducer(undefined, {})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'CHANGE_LOCATION'", function() {
		var location = 'Vienna, Austria';
		expect(mainReducer(undefined, {
			type: 'CHANGE_LOCATION',
			location: location
		})).toEqual(fromJS({
			location: location,
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_DATA'", function() {
		var data = { some: 'data' };
		expect(mainReducer(undefined, {
			type: 'SET_DATA',
			data: data
		})).toEqual(fromJS({
			location: '',
		  data: data,
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_DATES'", function() {
		var dates = ['2016-01-01', '2016-02-02'];
		expect(mainReducer(undefined, {
			type: 'SET_DATES',
			dates: dates
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: dates,
		  temps: [],
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_TEMPS'", function() {
		var temps = ['31', '32'];
		expect(mainReducer(undefined, {
			type: 'SET_TEMPS',
			temps: temps
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: temps,
		  selected: {
		    date: '',
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_SELECTED_DATE'", function() {
		var date = '2016-02-01'
		expect(mainReducer(undefined, {
			type: 'SET_SELECTED_DATE',
			date: date
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: date,
		    temp: null
		  }
		}));
	});

	it("should react to an action with the type 'SET_SELECTED_TEMP'", function() {
		var temp = '31';
		expect(mainReducer(undefined, {
			type: 'SET_SELECTED_TEMP',
			temp: temp
		})).toEqual(fromJS({
			location: '',
		  data: {},
		  dates: [],
		  temps: [],
		  selected: {
		    date: '',
		    temp: temp
		  }
		}));
	});
});
