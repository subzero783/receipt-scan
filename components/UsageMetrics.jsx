'use client';

import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiFileText, FiFolder, FiMail, FiTrendingUp } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import Link from 'next/link';

const UsageMetrics = ({ usageData: initialUsageData, isPro: initialIsPro, theme = 'dark' }) => {
  const [data, setData] = useState(initialUsageData || null);
  const [isPro, setIsPro] = useState(initialIsPro || false);
  const [loading, setLoading] = useState(!initialUsageData);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUsage = async () => {
      try {
        const res = await fetch('/api/user/usage');
        if (res.ok && mounted) {
          const usageJson = await res.json();
          setData(usageJson.monthlyUsage ? usageJson : null);
          setIsPro(usageJson.isPro);
        }
      } catch (error) {
        console.error('Error fetching user usage metrics:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!initialUsageData) {
      fetchUsage();
    } else {
      setIsPro(initialIsPro);
      setData(initialUsageData);
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [initialUsageData, initialIsPro]);

  // Trigger CSS entry animations for progress bar fills
  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className={`usage-metrics-section ${theme === 'light' ? 'light-theme' : ''}`}>
        <div className="usage-metrics-header">
          <div className="usage-metrics-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiTrendingUp /> Account Usage & Limits
          </div>
        </div>
        <div className="usage-metrics-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="usage-metric-card" style={{ height: '140px', justifyContent: 'center', alignItems: 'center' }}>
              <div className="spinner-mini" style={{
                width: '24px',
                height: '24px',
                border: '2px solid rgba(255,255,255,0.1)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: 'Receipt Uploads',
      value: data.lifetimeReceipts || 0,
      limit: isPro ? null : 10,
      icon: <FiUploadCloud />,
      type: 'lifetime',
      description: isPro ? 'Unlimited uploads' : 'Lifetime uploads limit',
    },
    {
      label: 'CSV Exports',
      value: data.monthlyUsage?.csvDownloads || 0,
      limit: isPro ? null : 5,
      icon: <FiFileText />,
      type: 'monthly',
      description: isPro ? 'Unlimited exports' : 'Per month limit',
    },
    {
      label: 'ZIP Downloads',
      value: data.monthlyUsage?.zipDownloads || 0,
      limit: isPro ? null : 5,
      icon: <FiFolder />,
      type: 'monthly',
      description: isPro ? 'Unlimited downloads' : 'Per month limit',
    },
    {
      label: 'Emails Sent',
      value: data.monthlyUsage?.emails || 0,
      limit: isPro ? null : 5,
      icon: <FiMail />,
      type: 'monthly',
      description: isPro ? 'Unlimited emails' : 'Per month limit',
    },
  ];

  // Mouse hover light effect utility
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  return (
    <div className={`usage-metrics-section ${theme === 'light' ? 'light-theme' : ''}`}>
      <div className="usage-metrics-header">
        <h3 className="usage-metrics-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <FiTrendingUp /> Account Usage & Limits
        </h3>
        {isPro ? (
          <span className="usage-metrics-badge pro">
            <FaCrown size={12} /> Pro Member
          </span>
        ) : (
          <span className="usage-metrics-badge">
            Free Plan
          </span>
        )}
      </div>

      <div className="usage-metrics-grid">
        {metrics.map((metric, idx) => {
          const hasLimit = metric.limit !== null;
          const pct = hasLimit 
            ? Math.min((metric.value / metric.limit) * 100, 100) 
            : 100;
          
          let progressColorClass = 'normal';
          if (isPro) {
            progressColorClass = 'unlimited';
          } else if (pct >= 80) {
            progressColorClass = 'danger';
          } else if (pct >= 50) {
            progressColorClass = 'warning';
          }

          return (
            <div 
              key={idx} 
              className="usage-metric-card"
              onMouseMove={handleMouseMove}
            >
              <div className="usage-metric-card-top">
                <div className="usage-metric-info">
                  <span className="usage-metric-label">{metric.label}</span>
                  <div className="usage-metric-value-container">
                    <span className="usage-metric-value">{metric.value}</span>
                    {hasLimit && (
                      <span className="usage-metric-limit">/ {metric.limit}</span>
                    )}
                  </div>
                </div>
                <div className="usage-metric-icon-wrapper">
                  {metric.icon}
                </div>
              </div>

              <div className="usage-metric-progress-container">
                <div className="usage-metric-progress-bar-bg">
                  <div 
                    className={`usage-metric-progress-bar-fill ${progressColorClass}`}
                    style={{ width: animate ? `${pct}%` : '0%' }}
                  />
                </div>
                <div className="usage-metric-footer-text">
                  <span>{metric.description}</span>
                  {hasLimit && <span>{Math.round(pct)}% used</span>}
                </div>
              </div>
            </div>
          );
        })}

        {!isPro && (
          <div className="usage-metrics-cta">
            <span className="usage-metrics-cta-text">
              🚀 <strong>Unlock unlimited capabilities!</strong> Upgrade to Pro for unlimited uploads, exports, ZIP downloads, and automated email reports.
            </span>
            <Link href="/pricing" className="usage-metrics-cta-link">
              Upgrade Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageMetrics;
