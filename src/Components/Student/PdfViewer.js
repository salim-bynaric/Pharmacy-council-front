import React from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { rotatePlugin } from '@react-pdf-viewer/rotate';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = ({ path,answerFile }) => 
{
    const renderError = (error: LoadError) => {
        let message = '';
        switch (error.name) {
            case 'InvalidPDFException':
                message = 'The document is invalid or corrupted';
                break;
            case 'MissingPDFException':
                message = 'The document is missing';
                break;
            case 'UnexpectedResponseException':
                message = 'Unexpected server response';
                break;
            default:
                message = 'Cannot load the document';
                break;
        }
    }

    const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    CurrentScale,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    ZoomIn,
                    ZoomOut,
                } = slots;
                return (
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomOut>
                                {(props) => (
                                    <button
                                        style={{
                                            backgroundColor: '#357edd',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            cursor: 'pointer',
                                            padding: '8px',
                                        }}
                                        onClick={props.onClick}
                                    >
                                        Zoom out
                                    </button>
                                )}
                            </ZoomOut>
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <CurrentScale>{(props) => <span>{`${Math.round(props.scale * 100)}%`}</span>}</CurrentScale>
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomIn>
                                {(props) => (
                                    <button
                                        style={{
                                            backgroundColor: '#357edd',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            cursor: 'pointer',
                                            padding: '8px',
                                        }}
                                        onClick={props.onClick}
                                    >
                                        Zoom in
                                    </button>
                                )}
                            </ZoomIn>
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                            <GoToPreviousPage>
                                {(props) => (
                                    <button
                                        style={{
                                            backgroundColor: props.isDisabled ? '#96ccff' : '#357edd',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                            padding: '8px',
                                        }}
                                        disabled={props.isDisabled}
                                        onClick={props.onClick}
                                    >
                                        Previous page
                                    </button>
                                )}
                            </GoToPreviousPage>
                        </div>
                        <div style={{ padding: '0px 2px', width: '4rem' }}>
                            <CurrentPageInput />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            / <NumberOfPages />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToNextPage>
                                {(props) => (
                                    <button
                                        style={{
                                            backgroundColor: props.isDisabled ? '#96ccff' : '#357edd',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            cursor: props.isDisabled ? 'not-allowed' : 'pointer',
                                            padding: '8px',
                                        }}
                                        disabled={props.isDisabled}
                                        onClick={props.onClick}
                                    >
                                        Next page
                                    </button>
                                )}
                            </GoToNextPage>
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );
    
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [],renderToolbar
    });
    const rotatePluginInstance = rotatePlugin();

    return (
        <div className="col-lg-12">
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table mr-1"></i>
                    {answerFile}
                </div>
                <div className="card-body">
                    {
                        path !== undefined ?
                            <>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                    <div style={{'height':'500px'}}>
                                    <Viewer
                                        fileUrl={path}
                                        plugins={[
                                            defaultLayoutPluginInstance,
                                            rotatePluginInstance
                                        ]}
                                        renderError={renderError} 
                                    />
                                    </div>
                                </Worker>
                            </>
                            : null
                    }
                </div>
            </div>
        </div>
    );
};


export default PdfViewer;