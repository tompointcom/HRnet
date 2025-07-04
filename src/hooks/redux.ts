import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Version alternative sans TypedUseSelectorHook
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected) => useSelector(selector);