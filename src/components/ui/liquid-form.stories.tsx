import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidForm } from './liquid-form';

const meta: Meta<typeof LiquidForm> = {
  title: 'Forms & Inputs/LiquidForm',
  component: LiquidForm,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Atmospheric tone for light or dark backgrounds',
    },
    sound: {
      control: 'boolean',
      description: 'Synthesized audio droplet feedback',
    },
    submitLabel: {
      control: 'text',
      description: 'Label on submit button in idle phase',
    },
    resetAfter: {
      control: 'number',
      description: 'Milliseconds before returning to edit phase after success',
    },
  },
  args: {
    title: 'Get in Touch',
    description: 'A responsive glass basin. Focus inputs to see the water glide.',
    tone: 'light',
    sound: true,
    submitLabel: 'Send Message',
    processingLabel: 'Transmitting',
    successLabel: 'Sent Successfully',
  },
};

export default meta;
type Story = StoryObj<typeof LiquidForm>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-[500px] w-full items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidForm {...args} />
    </div>
  ),
};

export const DarkTone: Story = {
  args: {
    tone: 'dark',
    title: 'Fluid Support Ticket',
    description: 'Submit an issue report directly to our core engineering cluster.',
    submitLabel: 'File Incident',
  },
  render: (args) => (
    <div className="flex min-h-[500px] w-full items-center justify-center p-8 bg-[#0B132B] mx-auto rounded-3xl">
      <LiquidForm {...args} />
    </div>
  ),
};

export const ContactUs: Story = {
  args: {
    title: 'Contact Engineering',
    description: 'We usually respond within one business cycle.',
    fields: [
      { name: 'name', label: 'Full Name', placeholder: 'Jordan Lee', required: true, colSpan: 1 },
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jordan@company.com', required: true, colSpan: 1 },
      {
        name: 'priority',
        label: 'Priority Level',
        type: 'select',
        defaultValue: 'normal',
        options: [
          { label: 'Low - Exploration', value: 'low' },
          { label: 'Normal - Standard Inquiry', value: 'normal' },
          { label: 'Urgent - Production Critical', value: 'urgent' },
        ],
        colSpan: 2,
      },
      { name: 'notes', label: 'Project Description', type: 'textarea', placeholder: 'Describe the project specs...', required: true, rows: 4, colSpan: 2 },
      { name: 'nda', label: 'Require mutual NDA before call', type: 'checkbox', defaultValue: false, colSpan: 2 },
    ],
    submitLabel: 'Submit Inquiry',
  },
  render: (args) => (
    <div className="flex min-h-[550px] w-full items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidForm {...args} />
    </div>
  ),
};

export const AsyncSubmission: Story = {
  args: {
    title: 'Async Cloud Provisioning',
    description: 'Simulates a real 2-second cloud resource provisioning request.',
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 2000));
      console.log('Form submitted:', values);
    },
    submitLabel: 'Deploy Cluster',
    processingLabel: 'Provisioning Waterline...',
    successLabel: 'Cluster Live',
  },
  render: (args) => (
    <div className="flex min-h-[500px] w-full items-center justify-center p-8 bg-[#DCEBF5] mx-auto rounded-3xl">
      <LiquidForm {...args} />
    </div>
  ),
};
