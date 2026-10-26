import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const locationErrors = {
  1: "Location access was denied. Allow location access in your browser settings and try again, or enter coordinates manually.",
  2: "Your current location is unavailable. Check your device's location services and try again, or enter coordinates manually.",
  3: "Getting your location timed out. Try again, or enter coordinates manually."
};

export default function CurrentLocationButton({ onCoordinates, isDarkMode, disabled = false }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef(null);

  // getCurrentPosition cannot be cancelled; ignore callbacks after leaving the form.
  useEffect(() => () => { requestRef.current = null; }, []);

  const getLocation = () => {
    if (disabled || requestRef.current) return;
    setError("");
    if (!window.isSecureContext) {
      setError("Current location requires HTTPS or localhost. Open the secure site, or enter coordinates manually.");
      return;
    }
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation. Enter coordinates manually.");
      return;
    }

    const request = {};
    requestRef.current = request;
    setPending(true);
    const fail = locationError => {
      if (requestRef.current !== request) return;
      requestRef.current = null;
      setPending(false);
      setError(locationErrors[locationError?.code] || "Unable to get your current location. Try again, or enter coordinates manually.");
    };

    try {
      navigator.geolocation.getCurrentPosition(position => {
        if (requestRef.current !== request) return;
        const { latitude, longitude } = position.coords;
        if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 ||
            !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
          fail();
          return;
        }
        // Match the existing inputs and DECIMAL(10, 7) API/database precision.
        onCoordinates({ latitude: latitude.toFixed(7), longitude: longitude.toFixed(7) });
        requestRef.current = null;
        setPending(false);
      }, fail, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch (locationError) {
      fail(locationError);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={getLocation}
        disabled={disabled || pending}
        aria-busy={pending}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode
          ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-200 hover:bg-cyan-300/25"
          : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"}`}
      >
        <MapPin size={14} aria-hidden="true" />
        <span aria-live="polite">{pending ? "Getting location..." : "Use My Current Location"}</span>
      </button>
      {error && <p role="alert" className={`mt-2 text-xs ${isDarkMode ? "text-rose-300" : "text-rose-700"}`}>{error}</p>}
    </div>
  );
}
