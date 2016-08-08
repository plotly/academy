import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { App } from '../App';
import Plot from '../Plot';

describe('components', () => {
	describe('<App />', () => {
		it('renders correctly', () => {
			const tree = renderer.create(<App redux={fromJS({})} />).toJSON();
		  expect(tree).toMatchSnapshot();
		});
	});

	describe('<Plot />', () => {
		it('renders correctly', () => {
			const tree = renderer.create(<Plot />).toJSON();
		  expect(tree).toMatchSnapshot();
		});
	});
});
