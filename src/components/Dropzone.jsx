import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ArrowDropUp, CloseSharp, CloudUploadSharp } from '@mui/icons-material';
import axios from 'axios';
import { Box, Button, Typography, ImageList, ImageListItem, ImageListItemBar, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const Dropzone = ({ title, setImageUrls, multiple = true }) => {
  const toastId = React.useRef(null);
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  // const config = {
  // 	onUploadProgress: (progressEvent) =>
  //     setProgress(
  //       Math.round((progressEvent.loaded * 100) / progressEvent.total)
  //     ),
  // };
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }))
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    multiple,
    maxSize: 3072 * 1000,
    onDrop
  });
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = 'https://api.cloudinary.com/v1_1/dokuk2daz/image/upload';

    if (!files?.length) return;
    const uploader = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'wuonozqm');
      formData.append('cloud_name', 'dokuk2daz');

      // show progress bar with percentage of upload using mui snackbar with circular progress
      const res = await axios.post(URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          if (toastId.current === null) {
            toastId.current = toast(
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress variant="determinate" value={progress} sx={{ mr: 1 }} />
                <Typography variant="body2">{progress}%</Typography>
              </Box>,
              {
                position: 'bottom-center',
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                hideProgressBar: true,
                closeButton: true,
                className: 'toast-progress-bar'
              }
            );
          } else {
            toast.update(toastId.current, {
              render: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress variant="determinate" value={progress} sx={{ mr: 1 }} />
                  <Typography variant="body2">{progress}%</Typography>
                </Box>
              )
            });
          }

          if (progress === 100 || progress === 0) {
            toast.dismiss(toastId.current);
            toastId.current = null;
          }
        }
      });

      // setProgress(Math.round((res.loaded * 100) / res.total));
      const data = res.data;
      const fileURL = data.secure_url;

      setImageUrls((previousUrls) => [...previousUrls, fileURL]);
    };

    const uploaders = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'wuonozqm');
      formData.append('cloud_name', 'dokuk2daz');

      // show progress bar with percentage of upload using mui snackbar with circular progress
      const res = await axios.post(URL, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          if (toastId.current === null) {
            toastId.current = toast(
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress variant="determinate" value={progress} sx={{ mr: 1 }} />
                <Typography variant="body2">{progress}%</Typography>
              </Box>,
              {
                position: 'bottom-center',
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                hideProgressBar: true,
                closeButton: false,
                className: 'toast-progress-bar'
              }
            );
          } else {
            toast.update(toastId.current, {
              render: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress variant="determinate" value={progress} sx={{ mr: 1 }} />
                  <Typography variant="body2">{progress}%</Typography>
                </Box>
              )
            });
          }

          if (progress === 100 || progress === 0) {
            toast.dismiss(toastId.current);
            toastId.current = null;
          }
        }
      });

      // setProgress(Math.round((res.loaded * 100) / res.total));
      const data = res.data;
      const fileURL = data.secure_url;

      setImageUrls((previousUrls) => [...previousUrls, fileURL]);
    });
    // const formData = new FormData();
    // files.forEach((file) => formData.append('file', file));
    // formData.append('upload_preset', 'wuonozqm');
    // console.log(formData);
    // const URL = 'https://api.cloudinary.com/v1_1/dokuk2daz/images/upload';
    // const data = await fetch(URL, {
    // 	method: 'POST',
    // 	body: formData,
    // }).then((res) => res.json());

    //using axios
    // const data = await axios.post(URL, formData, config);

    multiple ? await axios.all(uploaders) : await uploader(files[0]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {/* Dropzone */}
      <Box
        sx={{
          width: '100%',
          height: '200px',
          border: '1px dashed #ccc',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border .24s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main'
          }
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <ArrowDropUp sx={{ fontSize: '3rem', color: 'primary.main', cursor: 'pointer' }} />
        {isDragActive ? (
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            Drop the files here ...
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            Drag and drop files here or click to select files
          </Typography>
        )}
      </Box>

      {/* Preview */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preview
        </Typography>

        <ImageList cols={4} gap={8}>
          {files.map((file) => (
            <ImageListItem key={file.name}>
              <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              <ImageListItemBar
                title={file.name}
                actionIcon={
                  <Button variant="contained" color="error" size="small" startIcon={<CloseSharp />} onClick={() => removeFile(file.name)}>
                    Remove
                  </Button>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Rejected */}
      {rejected.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Rejected
          </Typography>

          <ImageList cols={3} gap={8}>
            {rejected.map(({ file, errors }) => (
              <ImageListItem key={file.name}>
                <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                <ImageListItemBar
                  title={file.name}
                  subtitle={
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      {errors[0].message}
                    </Typography>
                  }
                  actionIcon={
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CloseSharp />}
                      onClick={() => removeRejected(file.name)}
                    >
                      Remove
                    </Button>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      {/* Progress with snackbar and circular progress with percentage */}

      {/* Actions */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="error" size="small" startIcon={<CloseSharp />} onClick={removeAll}>
          Remove All
        </Button>

        <Button variant="contained" color="primary" size="small" startIcon={<CloudUploadSharp />} sx={{ ml: 1 }} onClick={handleSubmit}>
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default Dropzone;
