import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props__';
const validEventTypeList = ['click'];

export interface DOMElement extends Element {
	[elementPropsKey]: Props;
}

type EventCallback = (e: Event) => void;

interface SyntheticEvent extends Event {
	__stopPropagation: boolean;
}

interface Paths {
	capture: EventCallback[];
	bubble: EventCallback[];
}

export function updateFiberProps(node: DOMElement, props: Props) {
	node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
	if (!validEventTypeList.includes(eventType)) {
		console.warn(`当前不支持${eventType}事件`);
		return;
	}
	if (__DEV__) {
		console.log(`初始化事件：${eventType}`);
	}
	container.addEventListener(eventType, (e) => {
		dispatchEvent(container, eventType, e);
	});
}

function createSyntheticEvent(e: Event) {
	const syntheticEvent = e as SyntheticEvent;
	syntheticEvent.__stopPropagation = false;
	const originStopPropagation = e.stopPropagation;

	syntheticEvent.stopPropagation = () => {
		syntheticEvent.__stopPropagation = true;
		if (originStopPropagation) {
			originStopPropagation();
		}
	};
	return syntheticEvent;
}

function dispatchEvent(container: Container, eventType: string, event: Event) {
	const targetElement = event.target;
	if (targetElement === null) {
		console.warn('事件不存在target', event);
		return;
	}
	// 1、收集沿途的事件
	const { bubble, capture } = collectPaths(
		targetElement as DOMElement,
		container,
		eventType
	);
	// 2、构造合成事件
	const se = createSyntheticEvent(event);
	// 3、遍历capture
	triggerEventFlow(capture, se);
	// 4、遍历bubble
	if (!se.__stopPropagation) {
		triggerEventFlow(bubble, se);
	}
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
	for (let i = 0; i < paths.length; i++) {
		const callback = paths[i];
		callback.call(null, se);

		if (se.__stopPropagation) {
			break;
		}
	}
}

function getEventCallbackNameFromEventType(
	eventType: string
): string[] | undefined {
	return {
		click: ['onClickCapture', 'onClick']
	}[eventType];
}
function collectPaths(
	targetElement: DOMElement,
	container: Container,
	eventType: string
) {
	const paths: Paths = {
		capture: [],
		bubble: []
	};

	while (targetElement && targetElement !== container) {
		// 收集
		const elementProps = targetElement[elementPropsKey];
		if (elementProps) {
			const callbackNameList = getEventCallbackNameFromEventType(eventType);
			if (callbackNameList) {
				callbackNameList.forEach((callbackName, i) => {
					const eventCallback = elementProps[callbackName];
					if (eventCallback) {
						if (i === 0) {
							// capture，从container -> targetElement
							paths.capture.unshift(eventCallback);
						} else {
							// bubble，从targetElement -> container
							paths.bubble.push(eventCallback);
						}
					}
				});
			}
		}
		targetElement = targetElement.parentNode as DOMElement;
	}

	return paths;
}
