export default function Input({ className, ...props }) {
    return <input type="text" className={`border p-2 ${className}`} {...props} />;
  }
  