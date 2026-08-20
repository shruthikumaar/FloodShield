import React, { useState, useRef } from 'react';
import { Camera, MapPin, X } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

const ReportIncident: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  
  const { addIncidentReport } = useEmergency();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addIncidentReport({
      id: `rep-${Date.now()}`,
      location: "12.9716, 77.5946",
      type: typeRef.current?.value || 'Unknown',
      description: descRef.current?.value || '',
      photoBase64: photo,
      timestamp: new Date().toLocaleString(),
      status: 'PENDING'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhoto(null);
      if (typeRef.current) typeRef.current.value = "";
      if (descRef.current) descRef.current.value = "";
    }, 3000);
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
              <select className="form-input" ref={typeRef} required>
                <option value="">Select an incident type</option>
                <option value="Flooded Road">Flooded Road</option>
                <option value="Waterlogging">Waterlogging</option>
                <option value="Blocked Road">Blocked Road</option>
                <option value="Damaged Bridge">Damaged Bridge</option>
                <option value="Landslide">Landslide</option>
                <option value="Other">Other Disaster</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" ref={descRef} rows={4} placeholder="Describe the situation..." required></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Photo Upload</label>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />
              
              {photo ? (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={photo} alt="Uploaded Incident" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  <button 
                    type="button"
                    onClick={() => setPhoto(null)}
                    style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center', cursor: 'pointer' }}
                >
                  <Camera size={32} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>Click to upload a photo</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Any image up to 5MB</div>
                </div>
              )}
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
