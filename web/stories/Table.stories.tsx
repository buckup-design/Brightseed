import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const compounds = [
  { id: "QFR-118", name: "Quercetin", source: "Onion skin", yield: "84%", status: "Verified" },
  { id: "QFR-204", name: "Resveratrol", source: "Grape pomace", yield: "62%", status: "In review" },
  { id: "QFR-307", name: "Sulforaphane", source: "Broccoli sprout", yield: "71%", status: "Verified" },
  { id: "QFR-411", name: "Curcumin", source: "Turmeric root", yield: "58%", status: "Pending" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Compound</TableHead>
          <TableHead>Source</TableHead>
          <TableHead className="text-right">Yield</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compounds.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono">{c.id}</TableCell>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.source}</TableCell>
            <TableCell className="text-right">{c.yield}</TableCell>
            <TableCell>{c.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Verified compounds, last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Compound</TableHead>
          <TableHead>Source</TableHead>
          <TableHead className="text-right">Yield</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compounds.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono">{c.id}</TableCell>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.source}</TableCell>
            <TableCell className="text-right">{c.yield}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Compound</TableHead>
          <TableHead className="text-right">Samples</TableHead>
          <TableHead className="text-right">Avg yield</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Quercetin</TableCell>
          <TableCell className="text-right">14</TableCell>
          <TableCell className="text-right">81%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Resveratrol</TableCell>
          <TableCell className="text-right">9</TableCell>
          <TableCell className="text-right">64%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Sulforaphane</TableCell>
          <TableCell className="text-right">11</TableCell>
          <TableCell className="text-right">73%</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">34</TableCell>
          <TableCell className="text-right">73%</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const SelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Compound</TableHead>
          <TableHead>Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compounds.map((c, i) => (
          <TableRow key={c.id} data-state={i === 1 ? "selected" : undefined}>
            <TableCell className="font-mono">{c.id}</TableCell>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.source}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
