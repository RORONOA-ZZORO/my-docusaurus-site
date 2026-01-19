import React from 'react';
import Link from '@docusaurus/Link';

export default function CareerCard({ name, description, skills, difficulty, time, link, reason, type = 'primary' }) {
    const isPrimary = type === 'primary';

    return (
        <div className="col col--6 margin-bottom--lg">
            <div className={`card ${isPrimary ? 'border--primary' : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="card__header">
                    <div className="badge badge--secondary margin-bottom--sm">
                        {isPrimary ? '⭐️ Primary Choice' : '💡 Great Alternative'}
                    </div>
                    <h3>{name}</h3>
                </div>
                <div className="card__body" style={{ flexGrow: 1 }}>
                    {reason && (
                        <p className="margin-bottom--md">
                            <strong>Why this fits:</strong> {reason}
                        </p>
                    )}
                    <p>{description}</p>
                    {skills && <p><strong>Skills:</strong> {skills}</p>}
                    {difficulty && <p><strong>Difficulty:</strong> {difficulty}</p>}
                    <p><strong>Est. Time:</strong> {time}</p>
                </div>
                <div className="card__footer">
                    <Link className="button button--primary button--block" to={link}>
                        Read Full Path
                    </Link>
                </div>
            </div>
        </div>
    );
}
