import { Client } from "@notionhq/client";
import { IdeationContent, ReflectionContent } from "./types/conversation";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";

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
    const blocks = [];

    // Handle content based on conversation type
    if (note.conversation.type === "reflection") {
      let reflectionContent: ReflectionContent;
      try {
        reflectionContent = JSON.parse(note.content);
      } catch {
        // If parsing fails, create a default structure
        reflectionContent = {
          gratitude: note.content,
          tension: "",
          win: "",
        };
      }

      blocks.push(
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Gratitude" } }] },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: reflectionContent.gratitude } }],
          },
        },
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Tension" } }] },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: reflectionContent.tension } }],
          },
        },
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Win" } }] },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: reflectionContent.win } }],
          },
        }
      );
    } else {
      let ideationContent: IdeationContent;
      try {
        ideationContent = JSON.parse(note.content);
      } catch {
        // If parsing fails, create a default structure
        ideationContent = {
          summary: note.content,
          resources: [],
          todos: [],
        };
      }

      blocks.push(
        {
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Summary" } }] },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [{ text: { content: ideationContent.summary } }],
          },
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
      children: blocks as BlockObjectRequest[],
    });

    return response;
  } catch (error) {
    console.error("Failed to create Notion page:", error);
    throw error;
  }
}
