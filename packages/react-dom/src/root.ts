// ReactDOM.createRoot(root).render(<App />);

import { Container } from 'hostConfig';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { IReactElement } from 'shared/ReactTypes';
import { initEvent } from './SyntheticEvent';

export function createRoot(container: Container) {
	const root = createContainer(container);

	return {
		render(element: IReactElement) {
			initEvent(container, 'click');
			return updateContainer(element, root);
		}
	};
}
