import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Click me",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Click me",
    variant: "secondary",
  },
};

export const Icon: Story = {
  args: {
    children: "🚀",
    variant: "icon",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    variant: "default",
    disabled: true,
  },
};

export const DisabledSecondary: Story = {
  args: {
    children: "Disabled",
    variant: "secondary",
    disabled: true,
  },
};
