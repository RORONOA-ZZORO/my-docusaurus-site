import React from 'react';

export default function CareerGrid({ children }) {
    return (
        <div className="container">
            <div className="row">
                {children}
            </div>
        </div>
    );
}
