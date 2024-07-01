// 深度优先遍历中，递归的递阶段

import { IReactElement } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';

export const beginWork = (wip: FiberNode) => {
	// 比较React Element和fiberNode，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case FunctionComponent:
			return updateFunctionComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memorizeState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	const { memorizedState } = processUpdateQueue(baseState, pending);
	wip.memorizeState = memorizedState;
	updateQueue.shared.pending = null;
	const nextChildren = wip.memorizeState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: IReactElement) {
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
