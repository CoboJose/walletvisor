import { createAction } from '@reduxjs/toolkit'
import * as actionTypes from './actionTypes';

export const updateBalance = createAction(actionTypes.UPDATE_BALANCE)