import { IReactElement } from 'shared/ReactTypes';
// @ts-ignore
import { createRoot } from 'react-dom';

export function renderIntoDocument(element: IReactElement) {
	const div = document.createElement('div');
	return createRoot(div).render(element);
}
