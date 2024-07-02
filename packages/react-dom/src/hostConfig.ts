export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

// createInstance = (type: string, props: any): Element
export const createInstance = (type: string): Element => {
	// TODO 处理props
	const element = document.createElement(type);
	return element;
};

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const commitTextUpdate = (
	textInstance: TextInstance,
	content: string
) => {
	textInstance.textContent = content;
};

export const removeChild = (
	container: Container,
	child: Instance | TextInstance
) => {
	container.removeChild(child);
};

export const appendChildToContainer = appendInitialChild;
