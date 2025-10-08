interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export default function Input({ label, id, error, ...props }: InputProps) {
  const errorClasses = "border-red-500 focus:ring-red-500";
  const defaultClasses = "border-slate-300 focus:ring-indigo-500";

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        id={id}
        className={`w-full mt-1 p-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 text-slate-900 ${error ? errorClasses : defaultClasses}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}