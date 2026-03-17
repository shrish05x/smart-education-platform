const Documents = ({ data, update }) => {
  const document = data.document || {};

  const handleChange = (field, value) => {
    update('document', { ...document, [field]: value });
  };

  return (
    <>
      <h2><span className="step-icon">📄</span> Documents Upload</h2>
      <div className="form-grid single-col">
        <div className="form-group">
          <label>ID Proof <span className="required">*</span></label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
          {document.idProof && (
            <small style={{ color: '#10b981', marginTop: '0.25rem' }}>✓ Current: {document.idProof.split('/').pop()}</small>
          )}
          <small style={{ color: '#6b7280', marginTop: '0.15rem' }}>Upload Aadhar, Passport, or other govt. ID (PDF/Image)</small>
        </div>
        <div className="form-group">
          <label>Resume <span className="required">*</span></label>
          <input type="file" accept=".pdf,.doc,.docx" />
          {document.resume && (
            <small style={{ color: '#10b981', marginTop: '0.25rem' }}>✓ Current: {document.resume.split('/').pop()}</small>
          )}
          <small style={{ color: '#6b7280', marginTop: '0.15rem' }}>Upload your latest resume (PDF preferred)</small>
        </div>
        <div className="form-group">
          <label>Certificates</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
          {document.certificates?.length > 0 && (
            <small style={{ color: '#10b981', marginTop: '0.25rem' }}>✓ {document.certificates.length} certificate(s) uploaded</small>
          )}
          <small style={{ color: '#6b7280', marginTop: '0.15rem' }}>Upload any relevant certificates (you can select multiple)</small>
        </div>
      </div>
    </>
  );
};

export default Documents;
