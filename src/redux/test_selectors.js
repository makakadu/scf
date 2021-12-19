import {createSelector} from 'reselect'

export const getTestObj = state => state.test.testObj
export const getPrimitive = state => state.test.primitive