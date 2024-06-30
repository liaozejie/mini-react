import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { IReactElement } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

export function updateContainer(
	element: IReactElement | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<IReactElement | null>(element);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<IReactElement | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
