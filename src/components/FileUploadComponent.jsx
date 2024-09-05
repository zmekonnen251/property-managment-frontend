import React, { useState } from 'react';
import { Button, Grid, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileViewerModal from './DocReaderModal';

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InsertDriveFile } from '@mui/icons-material';

const FileUploadComponent = ({ setFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async () => {
    if (!selectedFile) return;
    const URL = process.env.REACT_APP_CLOUDINARY_URL;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_NAME);

    try {
      const response = await axios.post(URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          toast.info(`Uploading: ${Math.round(progress)}%`, {
            toastId: 'upload-progress-1'
          });
        }
      });

      if (response.status === 200) {
        // Handle successful upload
        toast.success('File uploaded successfully!', {
          toastId: 'upload-success1'
        });
        const fileURL = response.data.secure_url;
        setFile(fileURL);
      } else {
        // Handle upload error
        toast.error('Error uploading file.', {
          toastId: 'upload-error1'
        });
      }
    } catch (error) {
      toast.error('Error uploading file.', {
        toastId: 'upload-error1'
      });
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '5px' }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 0, sm: 0, lg: 1, md: 0 }}>
        <Grid
          container
          rowSpacing={{
            xs: 2,
            sm: 1,
            lg: 0,
            md: 1
          }}
          columnSpacing={{ xs: 0, sm: 1, lg: 0, md: 0 }}
        >
          <Grid item xs={6} sm={3} md={6} lg={6}>
            <input
              type="file"
              accept=".pdf,.doc,.docx" // Allow PDF and DOC files
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  fontSize: {
                    xs: '0.8rem',
                    sm: '.5rem',
                    md: '1rem',
                    lg: '1rem'
                  }
                }}
              >
                Select File
              </Button>
            </label>
          </Grid>
          <Grid item xs={6} sm={3} md={6} lg={6}>
            <Button variant="contained" color="primary" onClick={() => setViewerOpen(true)}>
              Open Preview
            </Button>
          </Grid>
          {selectedFile && (
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div>
                  <InsertDriveFile style={{ fontSize: 64 }} />
                  {selectedFile && <div>{selectedFile.name}</div>}
                </div>
              </div>
            </Grid>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" size="large" onClick={handleUpload}>
            Upload
          </Button>
        </Grid>

        {viewerOpen && (
          <FileViewerModal
            fileURL={selectedFile && URL.createObjectURL(selectedFile)}
            fileType={selectedFile && selectedFile.name.split('.').pop().toLowerCase()}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </Grid>
    </Paper>
  );
};

export default FileUploadComponent;
