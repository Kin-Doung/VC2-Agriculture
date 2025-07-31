import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

export default function RiceComparisonTool({ userImage, detectedType, title }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {userImage && (
          <div>
            <p>Comparing your image with {detectedType || "detected type"}.</p>
            <img
              src={userImage}
              alt="User seed"
              className="w-32 h-32 object-cover rounded"
            />
            <p>Comparison results will show here.</p>
          </div>
        )}
        {!userImage && <p>No image selected for comparison.</p>}
      </CardContent>
    </Card>
  );
}