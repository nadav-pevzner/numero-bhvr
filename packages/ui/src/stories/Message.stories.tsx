// packages/ui/src/stories/Message.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "../Chat/Message";

const meta = {
  title: "Components/Message",
  component: Message,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: ["user", "assistant"],
    },
    onNodeRef: {
      control: false, // not something we fiddle with in Storybook UI
    },
  },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: "user",
    content: "היי, אפשר להסביר לי איך פותרים משוואה ריבועית?",
  },
};

export const AssistantMessage: Story = {
  args: {
    role: "assistant",
    content: "בוודאי. נתחיל מדוגמה פשוטה של משוואה מהצורה: $x^2 + 5x + 6 = 0$...",
  },
};
