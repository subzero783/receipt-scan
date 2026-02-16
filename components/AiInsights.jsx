'use client';

import { useState } from 'react';
import { FaRobot, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

const AiInsights = ({ receipts, data }) => {

    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receipts }),
            });

            if (res.ok) {
                const data = await res.json();
                setInsights(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-insights-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <span className="small-title">{data.small_title}</span>
                            <h2 className="title">{data.title}</h2>
                            <p className="subtitle">{data.subtitle}</p>
                            {!insights && (
                                <button
                                    onClick={generateInsights}
                                    disabled={loading || receipts.length === 0}
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                                >
                                    {loading ? 'Analyzing...' : 'Generate Insights'}
                                </button>
                            )}
                        </div>

                        {insights && (
                            <div className="insights-grid">
                                {/* Summary Card */}
                                <div className="insight-card">
                                    <h4 className="card-label">Overview</h4>
                                    <p className="card-text">{insights.summary}</p>
                                </div>

                                {/* Anomaly Card */}
                                <div className="insight-card anomaly">
                                    <div className="card-header-row">
                                        <FaExclamationTriangle color="#F59E0B" />
                                        <h4 className="card-label">Anomaly Detected</h4>
                                    </div>
                                    <p className="card-text">{insights.anomaly}</p>
                                </div>

                                {/* Tip Card */}
                                <div className="insight-card tip">
                                    <div className="card-header-row">
                                        <FaLightbulb color="#10B981" />
                                        <h4 className="card-label">Smart Tip</h4>
                                    </div>
                                    <p className="card-text">{insights.tip}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiInsights;