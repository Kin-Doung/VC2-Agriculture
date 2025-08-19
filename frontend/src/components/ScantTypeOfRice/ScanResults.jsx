import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

export default function ScanResults({ result, error, isScanning }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning && <p>Scanning...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {result && (
          <div>
            <p><strong>Type:</strong> {result.type}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(0)}%</p>
            {result.details && <p><strong>Details:</strong> {result.details}</p>}
          </div>
        )}
        {!isScanning && !error && !result && <p>No scan results yet. Capture or upload an image to start.</p>}
      </CardContent>
    </Card>
  );
}