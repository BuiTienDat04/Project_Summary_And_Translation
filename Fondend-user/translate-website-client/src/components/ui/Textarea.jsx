export default function Textarea({ className, ...props }) {
    return <textarea className={`border p-2 ${className}`} {...props} />;
  }
  