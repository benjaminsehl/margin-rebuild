import {RichText as H2RichText} from '@shopify/hydrogen';
import {Text} from '../Text';
import Link from './Link';

export default function RichText({data}: {data: string}) {
  return (
    <H2RichText
      className="prose"
      components={{
        heading({node}) {
          return <Text variant="heading">{node.children}</Text>;
        },
        paragraph({node}) {
          return (
            <Text
              variant="body"
              as="p"
              mt="2"
              mb="0"
              className="first-of-type:mt-0"
              wrap="pretty"
            >
              {node.children}
            </Text>
          );
        },
        link({node}) {
          return <Link to={node.url}>{node.children}</Link>;
        },
        list({node}) {
          /* list
({ node, }: { node: { type: "list"; listType: "unordered" | "ordered"; children?: ReactNode[]; }; }) => ReactNode
Customize lists. They can be either ordered or unordered. Defaults to <ol> or <ul> */
          if (node.listType === 'ordered') {
            return <ol className="mt-0">{node.children}</ol>;
          }
          return <ul className="mt-0">{node.children}</ul>;
        },
        listItem({node}) {
          return (
            <Text variant="body" asChild>
              <li>{node.children}</li>
            </Text>
          );
        },
        text({node}) {
          return (
            <Text wrap="pretty" variant="body">
              {node.value}
            </Text>
          );
        },
      }}
      data={data}
    />
  );
}
