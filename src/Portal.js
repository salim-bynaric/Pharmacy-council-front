import React from 'react';
import ReactDOM from 'react-dom';

function Portal({children})
{

    return ReactDOM.createPortal(
        <div style={{zIndex:9999}}>{children}</div>,
        document.getElementById('portal')
    );
}

export default Portal;