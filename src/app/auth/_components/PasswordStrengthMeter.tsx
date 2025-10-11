import { useMemo } from 'react';

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return 0;

    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
  }, [password]);

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div>
      <div className="flex gap-2 h-2 mt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 rounded-full ${index < strength ? strengthColors[strength - 1] : 'bg-slate-200'}`}
          ></div>
        ))}
      </div>
      <p className={`text-xs mt-1 font-semibold ${strength > 0 ? 'text-slate-600' : 'text-slate-400'}`}>
        {strength > 0 ? `Strength: ${strengthLabels[strength - 1]}` : 'Password must be at least 8 characters.'}
      </p>
    </div>
  );
}