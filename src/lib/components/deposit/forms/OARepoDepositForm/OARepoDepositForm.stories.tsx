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


export const SimpleSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('submit'));
    await expect(canvas.getByText('Success!')).toBeInTheDocument();
  },
  args: {
    onSubmit: (_, { setStatus }) => {
      setStatus('Success!')
    },
    children: <h1>Simple submission form</h1>,
  },
};

export const MultiSubmitForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('publish'));
    await expect(canvas.getByText('Published!')).toBeInTheDocument();
    await userEvent.click(canvas.getByText('save'));
    await expect(canvas.getByText('Changes saved!')).toBeInTheDocument();
    await userEvent.click(canvas.getByText('preview'));
    await expect(canvas.getByText('Previewed!')).toBeInTheDocument();
  },
  args: {
    formActions: {
      publish: (_, { setStatus }) => {
        setStatus('Published!')
      },
      save: (_, { setStatus }) => {
        setStatus('Changes saved!')
      },
      preview: (_, { setStatus }) => {
        setStatus('Previewed!')
      },
    },
    children: <h1>Multiple submit actions</h1>
  }
}