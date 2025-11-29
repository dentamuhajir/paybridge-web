export default function Alert({ type = "info", children }) {
  const base = "p-4 mb-4 rounded-lg text-sm border";

  const styles = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return <div className={`${base} ${styles[type]}`}>{children}</div>;
}
