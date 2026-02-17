import LinkBlock from "./LinkBlock";
import TextBlock from "./TextBlock";

export default function BlockRenderer({ block }) {
  if (!block || !block.type) return null;

  switch (block.type) {
    case "link":
      return (
        <LinkBlock
          blockId={block._id}
          pageId={block.pageId}
          uri={block.uri}
          links={block.data?.links || []}
        />
      );

    case "text":
      return <TextBlock content={block.data?.content || ""} />;

    default:
      return null;
  }
}
