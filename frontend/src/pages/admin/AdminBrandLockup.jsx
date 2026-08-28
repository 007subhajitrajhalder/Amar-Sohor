import { ShieldCheck } from "lucide-react";

function AdminBrandLockup() {
  return (
    <div className="admin-brand-lockup" aria-label="Amar Sohor admin portal">
      <div className="admin-brand-mark" aria-hidden="true">
        <ShieldCheck size={18} strokeWidth={2.4} />
      </div>
      <div>
        <p className="admin-brand-name">Amar Sohor</p>
        <p className="admin-brand-role">City operations</p>
      </div>
    </div>
  );
}

export default AdminBrandLockup;
