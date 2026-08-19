import React, { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';

const ReportIncident: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Report Incident</h2>
      
      <div className="card">
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="badge badge-safe mb-4">SUCCESS</div>
            <h3>Incident submitted successfully.</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Thank you for helping keep the community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="flex gap-2">
                <input type="text" className="form-input" value="12.9716, 77.5946" readOnly style={{ flex: 1, backgroundColor: 'var(--bg-primary)' }} />
                <button type="button" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} /> Use GPS
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Incident Type</label>
              <select className="form-input" required>
                <option value="">Select an incident type</option>
                <option value="flooded_road">Flooded Road</option>
                <option value="waterlogging">Waterlogging</option>
                <option value="blocked_road">Blocked Road</option>
                <option value="damaged_bridge">Damaged Bridge</option>
                <option value="landslide">Landslide</option>
                <option value="other">Other Disaster</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} placeholder="Describe the situation..." required></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Photo Upload</label>
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
                <Camera size={32} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                <div style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>Click to upload a photo</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>JPG, PNG up to 5MB</div>
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Date/time will be automatically captured upon submission.
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ padding: '12px' }}>
              SUBMIT REPORT
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIncident;
