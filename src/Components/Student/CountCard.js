import React  from 'react';

function CountCard(props)
{
    return (
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3 mt-3 que-no-list-btn-wid"  onClick={props.onClick}>
          <center>
            <button type="button" className={'btn btn-sm btn-'+props.color}>{props.count}</button>&nbsp;&nbsp;{props.label}
          </center>
        </div>
    );
}

export default CountCard;
