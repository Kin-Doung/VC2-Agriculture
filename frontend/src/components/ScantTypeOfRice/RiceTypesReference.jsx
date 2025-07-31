import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

export default function RiceTypesReference({ title }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Reference guide for rice types:</p>
        <ul className="list-disc pl-5">
          <li>Basmati: Long-grain rice used in Indian cuisine.</li>
          <li>Jasmine: Fragrant rice used in Thai cuisine.</li>
          <li>Arborio: Short-grain rice used in risotto.</li>
        </ul>
      </CardContent>
    </Card>
  );
}