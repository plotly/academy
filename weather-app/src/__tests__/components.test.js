import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { App } from '../App';
import Plot from '../Plot';

describe('components', function() {
	describe('<App />', function() {
		it('renders correctly', function() {
			const tree = renderer.create(<App redux={fromJS({})} />).toJSON();
		  expect(tree).toMatchSnapshot();
		});
	});

	describe('<Plot />', function() {
		global.Plotly = {
			newPlot: function() {}
		};
		global.document = {
			getElementById: function() { return {
				on: function() {}
			}}
		};
		it('renders correctly', function() {
			const tree = renderer.create(<Plot xData={fromJS({})} yData={fromJS({})} />).toJSON();
		  expect(tree).toMatchSnapshot();
		});
	});
});
