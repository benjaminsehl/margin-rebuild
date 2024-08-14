type DynamicNode = {
  [key: string]: {value: string};
};

type DynamicResponse = {
  nodes: DynamicNode[];
};

type FlattenedObject = {
  [key: string]: string;
};

export function parseMetaobjects<T extends FlattenedObject>(
  response: DynamicResponse,
): T[] {
  return response.nodes.map((node) => {
    const flattenedObject = {} as T;
    for (const key in node) {
      if (node[key] && typeof node[key].value === 'string') {
        (flattenedObject as any)[key] = node[key].value;
      }
    }
    return flattenedObject;
  });
}
