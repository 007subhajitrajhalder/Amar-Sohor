function AuthButton({ children, type = "submit" }) {
  return (
    <button
      type={type}
      className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
    >
      {children}
    </button>
  );
}

export default AuthButton;
