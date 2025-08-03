export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: '#ffe6e6',
        padding: '10px 14px',
        border: '1px solid #cc0000',
        borderRadius: '4px',
        marginBottom: '8px',
      }}
    >
      <strong>Error:</strong> {message}
    </div>
  );
}
