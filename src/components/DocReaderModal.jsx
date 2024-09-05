import * as React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
// import { Document, Page, usePageContext } from 'react-pdf';
import DocViewer from 'react-doc-viewer';

const FileViewerModal = ({ fileURL, fileType, onClose }) => {
	// const [numPages, setNumPages] = React.useState();
	// const page = usePageContext();

	// function onDocumentLoadSuccess({ numPages }) {
	//   setNumPages(numPages);
	// }
	const renderDocumentViewer = () => {
		if (fileType === 'pdf') {
			return (
				<div>
					{/* use iframe to display pdf */}
					<iframe src={fileURL} width='800px' height='600px' title='pdf' />
				</div>
			);
		}

		if (fileType === 'doc' || fileType === 'docx') {
			return (
				<DocViewer
					scale={1.5}
					fileUrl={fileURL}
					plugins={['zoom', 'page-navigation', 'fullscreen']}
				/>
			);
		}

		return <div>No Preview</div>;
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth maxWidth='md'>
			<DialogTitle>Document Viewer</DialogTitle>
			<DialogContent>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					{renderDocumentViewer()}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FileViewerModal;
