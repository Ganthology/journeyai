import { Client } from "@notionhq/client";
import { IdeationContent, ReflectionContent } from "./types/conversation";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function createNotionPage(note: {
  id: string;
  content: string;
  conversation: {
    title: string;
    type: string;
  };
  resources?: { title: string }[];
  todos?: { task: string; completed: boolean }[];
}) {
  try {
    let parsedContent: ReflectionContent | IdeationContent;
    try {
      parsedContent = JSON.parse(note.content);
    } catch {
      parsedContent = note.content;
    }

    const blocks = [];

    // Add content blocks based on note type
    if (note.conversation.type === "reflection") {
      const content = parsedContent as ReflectionContent;
      blocks.push(
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Gratitude" } }] },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: content.gratitude } }],
          },
        },
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Tension" } }] },
        },
        {
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: content.tension } }] },
        },
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Win" } }] },
        },
        {
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: content.win } }] },
        }
      );
    } else {
      const content = parsedContent as IdeationContent;
      blocks.push(
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Summary" } }] },
        },
        {
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: content.summary } }] },
        }
      );
    }

    // Add resources if they exist
    if (note.resources?.length) {
      blocks.push({
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: "Resources" } }] },
      });
      blocks.push({
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: note.resources.map((resource) => ({
            text: { content: resource.title },
          })),
        },
      });
    }

    // Add todos if they exist
    if (note.todos?.length) {
      blocks.push({
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: "Todos" } }] },
      });
      blocks.push(
        ...note.todos.map((todo) => ({
          type: "to_do",
          to_do: {
            rich_text: [{ text: { content: todo.task } }],
            checked: todo.completed,
          },
        }))
      );
    }

    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID! },
      properties: {
        Name: {
          title: [{ text: { content: note.conversation.title } }],
        },
        Type: {
          select: {
            name: note.conversation.type,
          },
        },
        Status: {
          status: {
            name: "Synced",
          },
        },
      },
      children: blocks,
    });

    return response.url;
  } catch (error) {
    console.error("Failed to create Notion page:", error);
    throw error;
  }
} 