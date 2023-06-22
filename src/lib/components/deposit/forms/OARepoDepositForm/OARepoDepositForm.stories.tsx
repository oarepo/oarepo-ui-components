import type { Meta, StoryObj } from "@storybook/react";

import { OARepoDepositForm } from "./OARepoDepositForm";

const meta = {
  title: "📥 Deposit/ 📋 Forms/OARepoDepositForm",
  component: OARepoDepositForm,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof OARepoDepositForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    onSubmit: (values) => {
      console.log("onSubmit handled", values);
    },
    children: <h1>Test</h1>,
  },
};
