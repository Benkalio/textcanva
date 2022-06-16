import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

// To access any state inside our component we use useTypedSelector
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
