function AuthInput({ id, label, type, placeholder, autoComplete }) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
      />
    </label>
  );
}

export default AuthInput;
