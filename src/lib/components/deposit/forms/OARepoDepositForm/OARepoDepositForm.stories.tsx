import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from "@storybook/react";

import { OARepoDepositForm } from "./OARepoDepositForm";
import { userEvent, within } from '@storybook/testing-library';

const meta = {
  title: "📥 Deposit/ 📋 Forms/OARepoDepositForm",
  component: OARepoDepositForm,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof OARepoDepositForm>;

export default meta;
type Story = StoryObj<typeof meta>;


export const EmptyForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByText('Submit'));

    await expect(
      canvas.getByText(
        'Success!'
      )
    ).toBeInTheDocument();
  },
  args: {
    onSubmit: (_, { setStatus }) => {
      setStatus('Success!')
    },
    children: <h1>Empty form</h1>,
  },
};
