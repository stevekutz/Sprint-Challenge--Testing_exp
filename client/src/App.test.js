import React from 'react';
// import ReactDOM from 'react-dom';
import App from './App';
import { render, getByText, queryByText, } from '@testing-library/react';
//import '@testing-library/jest-dom/extend-expect';
import 'jest-dom/extend-expect';
import * as RTL from '@testing-library/react';
import renderer from 'react-test-renderer';


import '@testing-library/react/cleanup-after-each';

/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
*/
// //
describe('CLIENT tests ', () => {
  it(`1)  verifies that <App /> is rendered correctly`, () => {
    const testDOM = render(<App/>);
    testDOM.debug();

    //expect(testDOM).toBeTruthy();
  })


});